#!/bin/bash
set -euo pipefail

echo "=== Building 10k tracker ==="
cd app
npm install
npm run build
cd ..

echo "=== Building wardrobe stylist ==="
cd wardrobe
npm install
npm run build
cd ..

echo "=== Merging builds ==="
mkdir -p app/dist/wardrobe
cp -r wardrobe/dist/. app/dist/wardrobe/

echo "=== Done. Files in app/dist/wardrobe: ==="
ls app/dist/wardrobe/
