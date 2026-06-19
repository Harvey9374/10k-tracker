import React, { useRef, useState } from 'react';
import { WardrobeItem, ItemCategory, ItemStatus, ItemPattern } from '../types';
import { ItemEditModal } from './ItemEditModal';
import { removeBackground } from '../removeBg';

interface PendingItem {
  id: string;
  filename: string;
  imageData: string;          // original
  processedData: string;      // bg-removed (or same as imageData if unavailable)
  didProcess: boolean;
  category: ItemCategory;
  primaryColour: string;
  pattern: ItemPattern;
  processingState: 'pending' | 'done' | 'error';
}

interface Props {
  items: WardrobeItem[];
  onAdd: (item: WardrobeItem) => void;
  onUpdate: (item: WardrobeItem) => void;
  onDelete: (id: string) => void;
}

function guessCategory(filename: string): ItemCategory {
  const lower = filename.toLowerCase();
  if (lower.includes('vest')) return 'vest';
  if (lower.includes('tee') || lower.includes('t-shirt') || lower.includes('tshirt')) return 'tee';
  if (lower.includes('shirt')) return 'shirt';
  if (lower.includes('short')) return 'shorts';
  if (lower.includes('trouser') || lower.includes('pant') || lower.includes('jean')) return 'trousers';
  if (lower.includes('shoe') || lower.includes('boot') || lower.includes('trainer') || lower.includes('sneak')) return 'shoes';
  if (lower.includes('jacket') || lower.includes('coat') || lower.includes('hoodie') || lower.includes('outer')) return 'outerwear';
  if (lower.includes('accessory') || lower.includes('belt') || lower.includes('hat') || lower.includes('watch')) return 'accessory';
  return 'other';
}

interface ImageAnalysis {
  colour: string;
  pattern: ItemPattern;
}

function analyseImage(imageData: string): Promise<ImageAnalysis> {
  return new Promise(resolve => {
    const img = new Image();
    img.onload = () => {
      const SIZE = 40;
      const canvas = document.createElement('canvas');
      canvas.width = SIZE; canvas.height = SIZE;
      const ctx = canvas.getContext('2d');
      if (!ctx) { resolve({ colour: '#888888', pattern: 'plain' }); return; }

      // Draw the central 60% of the image (avoids background edges)
      const sx = img.width * 0.2, sy = img.height * 0.2;
      const sw = img.width * 0.6, sh = img.height * 0.6;
      ctx.drawImage(img, sx, sy, sw, sh, 0, 0, SIZE, SIZE);
      const pixels = ctx.getImageData(0, 0, SIZE, SIZE).data;

      // Collect non-transparent pixel RGB values
      const rs: number[] = [], gs: number[] = [], bs: number[] = [];
      for (let i = 0; i < pixels.length; i += 4) {
        if (pixels[i + 3] < 30) continue; // skip transparent (bg-removed)
        rs.push(pixels[i]);
        gs.push(pixels[i + 1]);
        bs.push(pixels[i + 2]);
      }

      if (rs.length === 0) { resolve({ colour: '#888888', pattern: 'plain' }); return; }

      // Mean colour
      const mean = (arr: number[]) => arr.reduce((a, b) => a + b, 0) / arr.length;
      const mr = mean(rs), mg = mean(gs), mb = mean(bs);
      const colour = '#' + [mr, mg, mb].map(v => Math.round(v).toString(16).padStart(2, '0')).join('');

      // Std deviation of each channel
      const std = (arr: number[], m: number) =>
        Math.sqrt(arr.reduce((s, v) => s + (v - m) ** 2, 0) / arr.length);
      const sr = std(rs, mr), sg = std(gs, mg), sb = std(bs, mb);
      const avgStd = (sr + sg + sb) / 3;

      // Spatial variance: divide into 4x4 blocks and compare block means
      const BLOCKS = 4;
      const blockMeans: number[] = [];
      for (let by = 0; by < BLOCKS; by++) {
        for (let bx = 0; bx < BLOCKS; bx++) {
          const x0 = Math.floor(bx * SIZE / BLOCKS), x1 = Math.floor((bx + 1) * SIZE / BLOCKS);
          const y0 = Math.floor(by * SIZE / BLOCKS), y1 = Math.floor((by + 1) * SIZE / BLOCKS);
          let sum = 0, count = 0;
          for (let y = y0; y < y1; y++) {
            for (let x = x0; x < x1; x++) {
              const i = (y * SIZE + x) * 4;
              if (pixels[i + 3] < 30) continue;
              sum += (pixels[i] + pixels[i + 1] + pixels[i + 2]) / 3;
              count++;
            }
          }
          if (count > 0) blockMeans.push(sum / count);
        }
      }
      const spatialStd = blockMeans.length > 1 ? std(blockMeans, mean(blockMeans)) : 0;

      // Classify
      let pattern: ItemPattern = 'plain';
      if (avgStd > 55 || spatialStd > 30) {
        // Very high variance — likely graphic/text (concentrated contrast)
        pattern = 'graphic';
      } else if (avgStd > 30 || spatialStd > 18) {
        // Moderate variance spread across blocks — likely pattern or stripe
        pattern = spatialStd > avgStd ? 'stripe' : 'pattern';
      }
      // else: plain

      resolve({ colour, pattern });
    };
    img.onerror = () => resolve({ colour: '#888888', pattern: 'plain' });
    img.src = imageData;
  });
}

function readFileAsBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = e => resolve(e.target?.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

interface AIIdentification {
  category: ItemCategory;
  primaryColour: string;
  pattern: ItemPattern;
}

async function identifyClothing(imageDataUrl: string): Promise<AIIdentification | null> {
  try {
    const res = await fetch('/.netlify/functions/identify-clothing', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ image: imageDataUrl }),
      signal: AbortSignal.timeout(15000),
    });
    if (!res.ok) return null;
    return await res.json() as AIIdentification;
  } catch {
    return null;
  }
}

function uid() { return Math.random().toString(36).slice(2) + Date.now().toString(36); }

export function WardrobeManager({ items, onAdd, onUpdate, onDelete }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const folderInputRef = useRef<HTMLInputElement>(null);
  const [pendingItems, setPendingItems] = useState<PendingItem[]>([]);
  const [editItem, setEditItem] = useState<WardrobeItem | null>(null);
  const [filterStatus, setFilterStatus] = useState<ItemStatus | 'all'>('all');
  const [filterCategory, setFilterCategory] = useState<ItemCategory | 'all'>('all');
  const [isDragOver, setIsDragOver] = useState(false);
  const [saving, setSaving] = useState(false);

  const processFiles = async (files: FileList | File[]) => {
    const arr = Array.from(files).filter(f => f.type.startsWith('image/'));
    if (!arr.length) return;

    // Create placeholder entries immediately so user sees progress
    const placeholders: PendingItem[] = arr.map(f => ({
      id: uid(),
      filename: f.name,
      imageData: '',
      processedData: '',
      didProcess: false,
      category: guessCategory(f.name),
      primaryColour: '#888888',
      pattern: 'plain' as ItemPattern,
      processingState: 'pending',
    }));
    setPendingItems(placeholders);

    // Process each file: read → remove bg + AI identify in parallel
    for (let i = 0; i < arr.length; i++) {
      const file = arr[i];
      try {
        const imageData = await readFileAsBase64(file);
        const [{ processed, didProcess }, aiResult] = await Promise.all([
          removeBackground(imageData),
          identifyClothing(imageData),
        ]);

        // Fall back to canvas analysis for colour/pattern if AI unavailable
        const canvasAnalysis = didProcess ? await analyseImage(processed) : await analyseImage(imageData);

        const category = aiResult?.category ?? guessCategory(file.name);
        const primaryColour = aiResult?.primaryColour ?? canvasAnalysis.colour;
        const pattern = aiResult?.pattern ?? canvasAnalysis.pattern;

        setPendingItems(prev => prev.map((p, idx) =>
          idx === i
            ? { ...p, imageData, processedData: processed, didProcess, category, primaryColour, pattern, processingState: 'done' }
            : p
        ));
      } catch {
        setPendingItems(prev => prev.map((p, idx) =>
          idx === i ? { ...p, processingState: 'error' } : p
        ));
      }
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files.length > 0) processFiles(e.dataTransfer.files);
  };

  const confirmPending = async () => {
    setSaving(true);
    for (const p of pendingItems) {
      if (!p.imageData) continue;
      const item: WardrobeItem = {
        id: p.id,
        filename: p.filename,
        imageData: p.processedData || p.imageData,
        category: p.category,
        primaryColour: p.primaryColour,
        pattern: p.pattern,
        description: p.filename.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' '),
        status: 'active',
        notes: '',
        addedAt: new Date().toISOString(),
      };
      await onAdd(item);
    }
    setPendingItems([]);
    setSaving(false);
  };

  const allDone = pendingItems.length > 0 && pendingItems.every(p => p.processingState !== 'pending');
  const processingCount = pendingItems.filter(p => p.processingState === 'pending').length;

  const filtered = items.filter(i => {
    if (filterStatus !== 'all' && i.status !== filterStatus) return false;
    if (filterCategory !== 'all' && i.category !== filterCategory) return false;
    return true;
  });

  const statusColors: Record<ItemStatus, string> = {
    active: '#2a7a2a', reserve: '#7a6a2a', dirty: '#7a3a2a', retired: '#4a4a4a',
  };

  return (
    <div>
      {/* Upload zone */}
      <div
        onDrop={handleDrop}
        onDragOver={e => { e.preventDefault(); setIsDragOver(true); }}
        onDragLeave={() => setIsDragOver(false)}
        style={{
          border: `2px dashed ${isDragOver ? 'var(--accent)' : 'var(--border)'}`,
          borderRadius: 12, padding: 24, textAlign: 'center', marginBottom: 16,
          background: isDragOver ? 'rgba(201,169,110,0.1)' : 'var(--surface)',
          transition: 'all 0.2s',
        }}
      >
        <div style={{ fontSize: 32, marginBottom: 8 }}>📂</div>
        <p style={{ margin: '0 0 4px', color: 'var(--muted)', fontSize: 13 }}>Drop images here, or</p>
        <p style={{ margin: '0 0 12px', color: 'var(--accent)', fontSize: 11 }}>
          ✨ Backgrounds removed automatically
        </p>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap' }}>
          <button onClick={() => fileInputRef.current?.click()} style={uploadBtnStyle}>Select Files</button>
          <button onClick={() => folderInputRef.current?.click()} style={uploadBtnStyle}>Select Folder</button>
        </div>
        <input ref={fileInputRef} type="file" multiple accept="image/*" style={{ display: 'none' }}
          onChange={e => e.target.files && processFiles(e.target.files)} />
        <input ref={folderInputRef} type="file" multiple accept="image/*" style={{ display: 'none' }}
          // @ts-ignore
          webkitdirectory="true"
          onChange={e => e.target.files && processFiles(e.target.files)} />
      </div>

      {/* Review pending */}
      {pendingItems.length > 0 && (
        <div style={{ background: 'var(--surface)', borderRadius: 12, padding: 16, marginBottom: 16, border: '1px solid var(--accent)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <h3 style={{ margin: 0, fontSize: 15 }}>
              {processingCount > 0
                ? `Removing backgrounds… ${pendingItems.length - processingCount}/${pendingItems.length}`
                : `Review ${pendingItems.length} items`}
            </h3>
            {processingCount > 0 && (
              <div style={{ fontSize: 12, color: 'var(--accent)' }}>⏳ Processing…</div>
            )}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10, marginBottom: 12 }}>
            {pendingItems.map((p, idx) => (
              <div key={p.id} style={{ background: 'var(--bg)', borderRadius: 8, padding: 8, position: 'relative' }}>
                {p.processingState === 'pending' ? (
                  <div style={{ width: '100%', aspectRatio: '1', borderRadius: 6, background: 'var(--surface)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>
                    ⏳
                  </div>
                ) : (
                  <>
                    <img
                      src={p.processedData || p.imageData}
                      alt={p.filename}
                      style={{ width: '100%', aspectRatio: '1', objectFit: 'contain', borderRadius: 6, background: 'repeating-conic-gradient(#333 0% 25%, #222 0% 50%) 0 0 / 12px 12px' }}
                    />
                    {p.didProcess && (
                      <div style={{ position: 'absolute', top: 12, left: 12, background: 'var(--accent)', color: '#000', fontSize: 9, fontWeight: 700, padding: '2px 5px', borderRadius: 4 }}>
                        BG REMOVED
                      </div>
                    )}
                  </>
                )}
                <div style={{ fontSize: 10, color: 'var(--muted)', marginTop: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.filename}</div>
                <select
                  value={p.category}
                  onChange={e => {
                    const updated = [...pendingItems];
                    updated[idx] = { ...updated[idx], category: e.target.value as ItemCategory };
                    setPendingItems(updated);
                  }}
                  style={{ width: '100%', marginTop: 4, padding: '4px 6px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 4, color: 'var(--text)', fontSize: 11 }}
                >
                  {(['vest','tee','shirt','shorts','trousers','shoes','outerwear','accessory','other'] as ItemCategory[]).map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
                <select
                  value={p.pattern}
                  onChange={e => {
                    const updated = [...pendingItems];
                    updated[idx] = { ...updated[idx], pattern: e.target.value as ItemPattern };
                    setPendingItems(updated);
                  }}
                  style={{ width: '100%', marginTop: 4, padding: '4px 6px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 4, color: 'var(--text)', fontSize: 11 }}
                >
                  <option value="plain">Plain</option>
                  <option value="stripe">Stripe</option>
                  <option value="check">Check / Plaid</option>
                  <option value="graphic">Graphic / Text</option>
                  <option value="pattern">Pattern / Print</option>
                </select>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', gap: 8 }}>
            <button
              onClick={confirmPending}
              disabled={!allDone || saving}
              style={{ flex: 1, padding: '10px', background: allDone && !saving ? 'var(--accent)' : 'var(--surface)', border: 'none', borderRadius: 8, cursor: allDone && !saving ? 'pointer' : 'default', fontWeight: 700, color: allDone && !saving ? '#000' : 'var(--muted)' }}
            >
              {saving ? 'Saving…' : allDone ? 'Save All to Wardrobe' : 'Processing…'}
            </button>
            <button onClick={() => setPendingItems([])} style={{ padding: '10px 16px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8, cursor: 'pointer', color: 'var(--text)' }}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Filters */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16, overflowX: 'auto', paddingBottom: 4 }}>
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value as ItemStatus | 'all')} style={filterSelectStyle}>
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="reserve">Reserve</option>
          <option value="dirty">Dirty</option>
          <option value="retired">Retired</option>
        </select>
        <select value={filterCategory} onChange={e => setFilterCategory(e.target.value as ItemCategory | 'all')} style={filterSelectStyle}>
          <option value="all">All Categories</option>
          {(['vest','tee','shirt','shorts','trousers','shoes','outerwear','accessory','other'] as ItemCategory[]).map(c => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <span style={{ color: 'var(--muted)', fontSize: 12, alignSelf: 'center', whiteSpace: 'nowrap' }}>{filtered.length} items</span>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', color: 'var(--muted)', padding: 40, fontSize: 14 }}>
          No items yet. Upload some clothes to get started!
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
          {filtered.map(item => (
            <button
              key={item.id}
              onClick={() => setEditItem(item)}
              style={{ background: 'none', border: '2px solid var(--border)', borderRadius: 10, cursor: 'pointer', padding: 0, overflow: 'hidden', position: 'relative' }}
            >
              <img
                src={item.imageData}
                alt={item.description || item.filename}
                style={{ width: '100%', aspectRatio: '1', objectFit: 'contain', display: 'block', background: 'repeating-conic-gradient(#333 0% 25%, #222 0% 50%) 0 0 / 10px 10px' }}
              />
              <div style={{ position: 'absolute', top: 4, right: 4, width: 10, height: 10, borderRadius: '50%', background: statusColors[item.status], border: '1px solid rgba(255,255,255,0.3)' }} />
              <div style={{ padding: '4px 6px', background: 'var(--surface)', fontSize: 10, color: 'var(--muted)', textAlign: 'left' }}>
                {item.description || item.category}
              </div>
            </button>
          ))}
        </div>
      )}

      {editItem && (
        <ItemEditModal
          item={editItem}
          onSave={updated => { onUpdate(updated); setEditItem(null); }}
          onClose={() => setEditItem(null)}
          onDelete={id => { onDelete(id); setEditItem(null); }}
        />
      )}
    </div>
  );
}

const uploadBtnStyle: React.CSSProperties = {
  padding: '8px 16px', background: 'var(--accent)', border: 'none',
  borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 600, color: '#000',
};

const filterSelectStyle: React.CSSProperties = {
  padding: '6px 10px', background: 'var(--surface)', border: '1px solid var(--border)',
  borderRadius: 8, color: 'var(--text)', fontSize: 12, cursor: 'pointer',
};
