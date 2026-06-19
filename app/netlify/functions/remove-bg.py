"""
Netlify Python Function: background removal via rembg.
Deployed automatically with the site.
"""
import base64
import io
import json

try:
    from rembg import remove
    from PIL import Image
    REMBG_AVAILABLE = True
except ImportError:
    REMBG_AVAILABLE = False


def handler(event, context):
    headers = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Content-Type": "application/json",
    }

    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 204, "headers": headers, "body": ""}

    if not REMBG_AVAILABLE:
        return {
            "statusCode": 503,
            "headers": headers,
            "body": json.dumps({"error": "rembg not available in this environment"}),
        }

    try:
        body = json.loads(event.get("body") or "{}")
        raw = body.get("image", "")
        if not raw:
            return {"statusCode": 400, "headers": headers, "body": json.dumps({"error": "Missing image"})}

        if "," in raw:
            raw = raw.split(",", 1)[1]

        img_bytes = base64.b64decode(raw)
        img = Image.open(io.BytesIO(img_bytes)).convert("RGBA")
        result = remove(img)

        bbox = result.getbbox()
        if bbox:
            result = result.crop(bbox)

        padded = Image.new("RGBA", (result.width + 20, result.height + 20), (0, 0, 0, 0))
        padded.paste(result, (10, 10))

        buf = io.BytesIO()
        padded.save(buf, format="PNG", optimize=True)
        encoded = base64.b64encode(buf.getvalue()).decode()

        return {
            "statusCode": 200,
            "headers": headers,
            "body": json.dumps({"processed": f"data:image/png;base64,{encoded}"}),
        }

    except Exception as e:
        return {
            "statusCode": 500,
            "headers": headers,
            "body": json.dumps({"error": str(e)}),
        }
