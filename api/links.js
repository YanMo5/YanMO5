// api/links.js - 适配前端字段名（site-name, site-url, site-description）
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
      // 使用前端发送的字段名（带短横线）
      const siteName = req.body['site-name'];
      const siteUrl = req.body['site-url'];
      const siteDescription = req.body['site-description'] || '';

      // 验证必填字段
      if (!siteName) {
        return res.status(400).json({ 
          success: false, 
          error: '网站名称不能为空' 
        });
      }
      
      if (!siteUrl) {
        return res.status(400).json({ 
          success: false, 
          error: '网站链接不能为空' 
        });
      }

      // 验证URL格式
      try {
        new URL(siteUrl);
      } catch (e) {
        return res.status(400).json({ 
          success: false, 
          error: '请填写正确的网址格式（包含http://或https://）' 
        });
      }

      // 创建新友链申请
      const newLink = {
        id: Date.now(),
        name: siteName,
        url: siteUrl,
        description: siteDescription,
        status: 'pending',
        applyTime: new Date().toISOString()
      };

      // 存储到全局变量
      if (!global.linksList) {
        global.linksList = [];
      }
      global.linksList.push(newLink);

      // 返回成功响应
      return res.status(200).json({ 
        success: true, 
        message: '友链申请已提交，等待管理员审核！',
        data: newLink
      });
      
    } catch (error) {
      console.error('服务器错误：', error);
      return res.status(500).json({ 
        success: false, 
        error: '服务器处理失败：' + error.message 
      });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
