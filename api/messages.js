export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method === 'GET') {
    const messages = global.messagesList || [];
    return res.status(200).json({ success: true, data: messages });
  }

  if (req.method === 'POST') {
    try {
      const { name, email, message } = req.body;
      const newMessage = {
        id: Date.now(),
        name,
        email: email || '',
        content: message,
        date: new Date().toISOString(),
        status: 'pending'
      };
      if (!global.messagesList) global.messagesList = [];
      global.messagesList.push(newMessage);
      return res.status(200).json({ success: true, message: '留言已提交' });
    } catch (error) {
      return res.status(500).json({ success: false, error: '提交失败' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
