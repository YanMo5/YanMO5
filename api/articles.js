export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method === 'GET') {
    const articles = global.articlesList || [
      { id: 1, title: '示例文章', date: '2024-01-01', category: '随笔', status: 'published' }
    ];
    return res.status(200).json({ success: true, data: articles });
  }

  if (req.method === 'POST') {
    try {
      const { title, content, category } = req.body;
      const newArticle = {
        id: Date.now(),
        title,
        content: content || '',
        category: category || '未分类',
        date: new Date().toISOString().split('T')[0],
        status: 'published'
      };
      if (!global.articlesList) global.articlesList = [];
      global.articlesList.push(newArticle);
      return res.status(200).json({ success: true, message: '文章发布成功', data: newArticle });
    } catch (error) {
      return res.status(500).json({ success: false, error: '发布失败' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
