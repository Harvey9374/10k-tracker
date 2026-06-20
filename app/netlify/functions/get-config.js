export const handler = async () => ({
  statusCode: 200,
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  },
  body: JSON.stringify({
    googleClientId: process.env.VITE_GOOGLE_CLIENT_ID ?? null,
  }),
});
