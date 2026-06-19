import React, { useRef, useState } from 'react';
import { WardrobeItem, ItemCategory, ItemStatus } from '../types';
import { ItemEditModal } from './ItemEditModal';

interface PendingItem {
  filename: string;
  imageData: string;
  category: ItemCategory;
  primaryColour: string;
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

function sampleCentreColour(imageData: string): Promise<string> {
  return new Promise(resolve => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 10;
      canvas.height = 10;
      const ctx = canvas.getContext('2d');
      if (!ctx) { resolve('#888888'); return; }
      ctx.drawImage(img, img.width * 0.4, img.height * 0.4, img.width * 0.2, img.height * 0.2, 0, 0, 10, 10);
      const d = ctx.getImageData(5, 5, 1, 1).data;
      const hex = '#' + [d[0], d[1], d[2]].map(v => v.toString(16).padStart(2, '0')).join('');
      resolve(hex);
    };
    img.onerror = () => resolve('#888888');
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

export function WardrobeManager({ items, onAdd, onUpdate, onDelete }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const folderInputRef = useRef<HTMLInputElement>(null);
  const [pendingItems, setPendingItems] = useState<PendingItem[]>([]);
  const [editItem, setEditItem] = useState<WardrobeItem | null>(null);
  const [filterStatus, setFilterStatus] = useState<ItemStatus | 'all'>('all');
  const [filterCategory, setFilterCategory] = useState<ItemCategory | 'all'>('all');
  const [isDragOver, setIsDragOver] = useState(false);
  const [processingPending, setProcessingPending] = useState<(PendingItem & { id: string; category: ItemCategory })[]>([]);

  const processFiles = async (files: FileList | File[]) => {
    const arr = Array.from(files).filter(f => f.type.startsWith('image/'));
    const results: PendingItem[] = [];
    for (const file of arr) {
      const imageData = await readFileAsBase64(file);
      const colour = await sampleCentreColour(imageData);
      results.push({
        filename: file.name,
        imageData,
        category: guessCategory(file.name),
        primaryColour: colour,
      });
    }
    const withIds = results.map(p => ({ ...p, id: Math.random().toString(36).slice(2) + Date.now().toString(36) }));
    setProcessingPending(withIds);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  };

  const confirmPending = async () => {
    for (const p of processingPending) {
      const item: WardrobeItem = {
        id: p.id,
        filename: p.filename,
        imageData: p.imageData,
        category: p.category,
        primaryColour: p.primaryColour,
        description: p.filename.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' '),
        status: 'active',
        notes: '',
        addedAt: new Date().toISOString(),
      };
      await onAdd(item);
    }
    setProcessingPending([]);
  };

  const filtered = items.filter(i => {
    if (filterStatus !== 'all' && i.status !== filterStatus) return false;
    if (filterCategory !== 'all' && i.category !== filterCategory) return false;
    return true;
  });

  const statusColors: Record<ItemStatus, string> = {
    active: '#2a7a2a',
    reserve: '#7a6a2a',
    dirty: '#7a3a2a',
    retired: '#4a4a4a',
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
          borderRadius: 12,
          padding: 24,
          textAlign: 'center',
          marginBottom: 16,
          background: isDragOver ? 'rgba(201,169,110,0.1)' : 'var(--surface)',
          transition: 'all 0.2s',
        }}
      >
        <div style={{ fontSize: 32, marginBottom: 8 }}>📂</div>
        <p style={{ margin: '0 0 12px', color: 'var(--muted)', fontSize: 13 }}>Drop images here, or</p>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={() => fileInputRef.current?.click()}
            style={uploadBtnStyle}
          >
            Select Files
          </button>
          <button
            onClick={() => folderInputRef.current?.click()}
            style={uploadBtnStyle}
          >
            Select Folder
          </button>
        </div>
        <input ref={fileInputRef} type="file" multiple accept="image/*" style={{ display: 'none' }} onChange={e => e.target.files && processFiles(e.target.files)} />
        <input ref={folderInputRef} type="file" multiple accept="image/*" style={{ display: 'none' }}
          // @ts-ignore
          webkitdirectory="true"
          onChange={e => e.target.files && processFiles(e.target.files)}
        />
      </div>

      {/* Review pending */}
      {processingPending.length > 0 && (
        <div style={{ background: 'var(--surface)', borderRadius: 12, padding: 16, marginBottom: 16, border: '1px solid var(--accent)' }}>
          <h3 style={{ margin: '0 0 12px', fontSize: 15 }}>Review {processingPending.length} items before saving</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10, marginBottom: 12 }}>
            {processingPending.map((p, idx) => (
              <div key={p.id} style={{ background: 'var(--bg)', borderRadius: 8, padding: 8 }}>
                <img src={p.imageData} alt={p.filename} style={{ width: '100%', aspectRatio: '1', objectFit: 'cover', borderRadius: 6 }} />
                <div style={{ fontSize: 10, color: 'var(--muted)', marginTop: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.filename}</div>
                <select
                  value={p.category}
                  onChange={e => {
                    const updated = [...processingPending];
                    updated[idx] = { ...updated[idx], category: e.target.value as ItemCategory };
                    setProcessingPending(updated);
                  }}
                  style={{ width: '100%', marginTop: 4, padding: '4px 6px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 4, color: 'var(--text)', fontSize: 11 }}
                >
                  {(['vest','tee','shirt','shorts','trousers','shoes','outerwear','accessory','other'] as ItemCategory[]).map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={confirmPending} style={{ flex: 1, padding: '10px', background: 'var(--accent)', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 700, color: '#000' }}>
              Save All to Wardrobe
            </button>
            <button onClick={() => setProcessingPending([])} style={{ padding: '10px 16px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8, cursor: 'pointer', color: 'var(--text)' }}>
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
                style={{ width: '100%', aspectRatio: '1', objectFit: 'cover', display: 'block' }}
              />
              <div style={{
                position: 'absolute',
                top: 4,
                right: 4,
                width: 10,
                height: 10,
                borderRadius: '50%',
                background: statusColors[item.status],
                border: '1px solid rgba(255,255,255,0.3)',
              }} />
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
  padding: '8px 16px',
  background: 'var(--accent)',
  border: 'none',
  borderRadius: 8,
  cursor: 'pointer',
  fontSize: 13,
  fontWeight: 600,
  color: '#000',
};

const filterSelectStyle: React.CSSProperties = {
  padding: '6px 10px',
  background: 'var(--surface)',
  border: '1px solid var(--border)',
  borderRadius: 8,
  color: 'var(--text)',
  fontSize: 12,
  cursor: 'pointer',
};
