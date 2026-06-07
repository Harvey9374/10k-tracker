#!/usr/bin/env node
/**
 * Usage: node extract-recipes.js <folder> [--output <path>]
 *
 * Reads all .jpg/.jpeg/.png files from <folder>, sends each to the Anthropic
 * vision API, extracts recipe data, and writes (or merges into) recipes.json.
 *
 * Requires ANTHROPIC_API_KEY to be set in the environment.
 */

import Anthropic from '@anthropic-ai/sdk';
import fs from 'fs';
import path from 'path';

// ---------------------------------------------------------------------------
// CLI argument parsing
// ---------------------------------------------------------------------------

const args = process.argv.slice(2);

if (args.length === 0 || args[0] === '--help' || args[0] === '-h') {
  console.log('Usage: node extract-recipes.js <folder> [--output <path>]');
  console.log('');
  console.log('  <folder>           Directory containing .jpg / .png screenshots');
  console.log('  --output <path>    Where to write recipes.json (default: ./recipes.json)');
  process.exit(args.length === 0 ? 1 : 0);
}

const folderPath = path.resolve(args[0]);
let outputPath = path.join(process.cwd(), 'recipes.json');

for (let i = 1; i < args.length; i++) {
  if ((args[i] === '--output' || args[i] === '-o') && args[i + 1]) {
    outputPath = path.resolve(args[i + 1]);
    i++;
  }
}

// ---------------------------------------------------------------------------
// Validation
// ---------------------------------------------------------------------------

if (!fs.existsSync(folderPath) || !fs.statSync(folderPath).isDirectory()) {
  console.error(`Error: "${folderPath}" is not a valid directory.`);
  process.exit(1);
}

if (!process.env.ANTHROPIC_API_KEY) {
  console.error('Error: ANTHROPIC_API_KEY environment variable is not set.');
  process.exit(1);
}

// ---------------------------------------------------------------------------
// Anthropic client
// ---------------------------------------------------------------------------

const client = new Anthropic();

const MODEL = 'claude-sonnet-4-20250514';

const SYSTEM_PROMPT =
  'You are a recipe extraction assistant. When given a screenshot of a recipe, ' +
  'extract the information and return it as a JSON object. ' +
  'Return ONLY valid JSON — no markdown, no code fences, no extra text.';

const USER_PROMPT = `Extract the recipe from this image and return a JSON object with exactly this structure:

{
  "name": "Recipe Name",
  "ingredients": ["200g chicken breast", "1 cup rice"],
  "method": ["Step 1 description", "Step 2 description"],
  "macros": { "calories": 0, "protein": 0, "carbs": 0, "fat": 0 },
  "ingredientTags": ["chicken", "rice"]
}

Rules:
- name: the full recipe name as shown
- ingredients: one entry per ingredient, including its quantity and unit
- method: each step as a plain string, in order
- macros: numeric values only, no units; use 0 for any value not shown
- ingredientTags: short lowercase keywords for the main ingredients (e.g. "chicken", "rice") — no quantities or units
- Return ONLY the JSON object`;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function slugify(name) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-{2,}/g, '-')
    .replace(/^-|-$/g, '');
}

function mediaTypeFor(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  return ext === '.png' ? 'image/png' : 'image/jpeg';
}

// ---------------------------------------------------------------------------
// Core extraction
// ---------------------------------------------------------------------------

async function extractRecipe(imagePath) {
  const imageData = fs.readFileSync(imagePath).toString('base64');
  const mediaType = mediaTypeFor(imagePath);

  const response = await client.messages.create({
    model: MODEL,
    max_tokens: 2048,
    system: SYSTEM_PROMPT,
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'image',
            source: { type: 'base64', media_type: mediaType, data: imageData },
          },
          { type: 'text', text: USER_PROMPT },
        ],
      },
    ],
  });

  const text = response.content[0].text.trim();

  // Strip accidental markdown code fences if the model adds them anyway
  const cleaned = text.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '');
  return JSON.parse(cleaned);
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  const files = fs
    .readdirSync(folderPath)
    .filter(f => /\.(jpe?g|png)$/i.test(f))
    .sort();

  if (files.length === 0) {
    console.log('No .jpg / .png images found in the specified folder.');
    process.exit(0);
  }

  console.log(`Found ${files.length} image(s) in: ${folderPath}`);
  console.log(`Output file: ${outputPath}\n`);

  // Load and index any existing recipes
  const existingById = {};
  if (fs.existsSync(outputPath)) {
    try {
      const existing = JSON.parse(fs.readFileSync(outputPath, 'utf-8'));
      for (const recipe of existing) {
        existingById[recipe.id] = recipe;
      }
      console.log(`Loaded ${existing.length} existing recipe(s) from ${outputPath}\n`);
    } catch {
      console.warn(`Warning: Could not parse existing ${outputPath}; starting fresh.\n`);
    }
  }

  let succeeded = 0;
  let failed = 0;

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const imagePath = path.join(folderPath, file);
    process.stdout.write(`[${i + 1}/${files.length}] ${file} … `);

    try {
      const extracted = await extractRecipe(imagePath);

      const id = slugify(extracted.name || file);
      const recipe = {
        id: id || `recipe-${i + 1}`,
        name: extracted.name ?? '',
        ingredients: Array.isArray(extracted.ingredients) ? extracted.ingredients : [],
        method: Array.isArray(extracted.method) ? extracted.method : [],
        macros: {
          calories: extracted.macros?.calories ?? 0,
          protein: extracted.macros?.protein ?? 0,
          carbs: extracted.macros?.carbs ?? 0,
          fat: extracted.macros?.fat ?? 0,
        },
        ingredientTags: Array.isArray(extracted.ingredientTags) ? extracted.ingredientTags : [],
      };

      existingById[recipe.id] = recipe;
      console.log(`✓  "${recipe.name}" → id: ${recipe.id}`);
      succeeded++;
    } catch (err) {
      console.log(`✗  FAILED — ${err.message}`);
      failed++;
    }
  }

  const merged = Object.values(existingById);
  fs.writeFileSync(outputPath, JSON.stringify(merged, null, 2));

  console.log('');
  console.log(`Done: ${succeeded} succeeded, ${failed} failed.`);
  console.log(`Wrote ${merged.length} recipe(s) to ${outputPath}`);
}

main().catch(err => {
  console.error('\nFatal error:', err.message);
  process.exit(1);
});
