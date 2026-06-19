"""
Local background removal server for Wardrobe Stylist.
Runs alongside the Vite dev server during development.
Production uses the Netlify Python function instead.
"""
import base64
import io
import subprocess
import sys


def ensure_deps():
    for pkg, import_name in [("rembg[cpu]", "rembg"), ("Pillow", "PIL"), ("flask", "flask"), ("flask_cors", "flask_cors")]:
        try:
            __import__(import_name)
        except ImportError:
            print(f"Installing {pkg}...")
            subprocess.check_call([sys.executable, "-m", "pip", "install", pkg, "-q"])


ensure_deps()

from flask import Flask, request, jsonify  # noqa: E402
from flask_cors import CORS  # noqa: E402
from rembg import remove  # noqa: E402
from PIL import Image  # noqa: E402

app = Flask(__name__)
CORS(app, origins=["http://localhost:5173", "http://localhost:4173"])


@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok", "rembg": True})


@app.route("/remove-bg", methods=["POST"])
def remove_bg():
    data = request.get_json(force=True)
    if not data or "image" not in data:
        return jsonify({"error": "Missing image field"}), 400

    raw = data["image"]
    # Strip data URL prefix if present
    if "," in raw:
        raw = raw.split(",", 1)[1]

    try:
        img_bytes = base64.b64decode(raw)
        img = Image.open(io.BytesIO(img_bytes)).convert("RGBA")

        # Run background removal
        result: Image.Image = remove(img)

        # Crop tightly to the subject (remove transparent padding)
        bbox = result.getbbox()
        if bbox:
            result = result.crop(bbox)

        # Add a small transparent border for breathing room
        padded = Image.new("RGBA", (result.width + 20, result.height + 20), (0, 0, 0, 0))
        padded.paste(result, (10, 10))

        # Encode as PNG base64
        buf = io.BytesIO()
        padded.save(buf, format="PNG", optimize=True)
        encoded = base64.b64encode(buf.getvalue()).decode()

        return jsonify({"processed": f"data:image/png;base64,{encoded}"})

    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    print("Background removal server running on http://localhost:5174")
    app.run(host="0.0.0.0", port=5174, debug=False)
