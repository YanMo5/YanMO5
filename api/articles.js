// api/articles.js - 文章管理
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    try {
      // 示例文章数据（实际可从数据库读取）
      const articles = global.articlesList || [
        { id: 1, title: '欢迎来到我的博客', status: 'published', date: '2024-01-01' },
        { id: 2, title: '关于本站的介绍', status: 'published', date: '2024-01-02' }
      ];
      return res.status(200).json({ 
        success: true, 
        data: articles 
      });
    } catch (error) {
      return res.status(500).json({ 
        success: false, 
        error: '读取文章失败' 
      });
    }
  }

  if (req.method === 'POST') {
    try {
      const { title, content } = req.body;
      const newArticle = {
        id: Date.now(),
        title: title,
        content: content,
        status: 'published',
        date: new Date().toISOString()
      };
      
      if (!global.articlesList) global.articlesList = [];
      global.articlesList.push(newArticle);
      
      return res.status(200).json({ 
        success: true, 
        message: '文章发布成功' 
      });
    } catch (error) {
      return res.status(500).json({ 
        success: false, 
        error: '发布失败' 
      });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
