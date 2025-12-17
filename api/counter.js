import { kv } from '@vercel/kv';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    // tăng bộ đếm
    const views = await kv.incr('page_views');
    res.status(200).json({ views });
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
