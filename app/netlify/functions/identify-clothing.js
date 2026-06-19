import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Content-Type': 'application/json',
};

export const handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: CORS, body: '' };
  }
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers: CORS, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return { statusCode: 503, headers: CORS, body: JSON.stringify({ error: 'API key not configured' }) };
  }

  let image;
  try {
    ({ image } = JSON.parse(event.body || '{}'));
    if (!image) throw new Error('Missing image');
  } catch {
    return { statusCode: 400, headers: CORS, body: JSON.stringify({ error: 'Invalid request body' }) };
  }

  // Strip data URL prefix and get media type
  let base64Data = image;
  let mediaType = 'image/jpeg';
  if (image.includes(',')) {
    const [header, data] = image.split(',', 2);
    base64Data = data;
    if (header.includes('png')) mediaType = 'image/png';
    else if (header.includes('webp')) mediaType = 'image/webp';
  }

  try {
    const response = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 200,
      messages: [{
        role: 'user',
        content: [
          {
            type: 'image',
            source: { type: 'base64', media_type: mediaType, data: base64Data },
          },
          {
            type: 'text',
            text: `Identify this clothing item. Reply with ONLY a JSON object, no other text:
{
  "category": one of: vest, tee, shirt, shorts, trousers, shoes, outerwear, accessory, other,
  "primaryColour": colour name in lowercase (e.g. "navy", "white", "grey", "olive"),
  "pattern": one of: plain, stripe, check, graphic, pattern
}

Rules:
- tee = t-shirt or crew neck with no buttons
- shirt = button-up or collared shirt
- vest = sleeveless top
- outerwear = jacket, coat, hoodie, jumper, sweatshirt
- accessory = hat, cap, belt, watch, bag, jewellery
- graphic = has text, logo, or graphic print
- pattern = floral, abstract, or non-geometric print
- check = checked, plaid, or tartan
- stripe = striped`,
          },
        ],
      }],
    });

    const text = response.content[0].text.trim();
    const result = JSON.parse(text);

    // Validate fields
    const validCategories = ['vest','tee','shirt','shorts','trousers','shoes','outerwear','accessory','other'];
    const validPatterns = ['plain','stripe','check','graphic','pattern'];
    if (!validCategories.includes(result.category)) result.category = 'other';
    if (!validPatterns.includes(result.pattern)) result.pattern = 'plain';
    if (!result.primaryColour) result.primaryColour = 'unknown';

    return { statusCode: 200, headers: CORS, body: JSON.stringify(result) };
  } catch (err) {
    return { statusCode: 500, headers: CORS, body: JSON.stringify({ error: String(err) }) };
  }
};
