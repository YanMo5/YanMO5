// api/links.js - 处理友链申请
export default async function handler(req, res) {
  // 设置响应头
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // 处理预检请求
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // 处理 GET 请求
  if (req.method === 'GET') {
    const links = global.linksList || [];
    return res.status(200).json({ success: true, data: links });
  }

  // 处理 POST 请求
  if (req.method === 'POST') {
    try {
      const { name, url, description, email } = req.body;
      
      // 验证必填字段
      if (!name || !url) {
        return res.status(400).json({ 
          success: false, 
          error: '网站名称和网址不能为空' 
        });
      }

      // 保存友链
      const newLink = {
        id: Date.now(),
        name: name,
        url: url,
        description: description || '',
        email: email || '',
        status: 'pending',
        applyTime: new Date().toISOString()
      };

      if (!global.linksList) global.linksList = [];
      global.linksList.push(newLink);

      return res.status(200).json({ 
        success: true, 
        message: '友链申请已提交！' 
      });
    } catch (error) {
      return res.status(500).json({ 
        success: false, 
        error: '服务器错误：' + error.message 
      });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
