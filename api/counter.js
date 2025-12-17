// api/counter.js
let count = 0;

export default function handler(req, res) {
  if (req.method === 'GET') {
    count++;
    res.status(200).json({ views: count });
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
