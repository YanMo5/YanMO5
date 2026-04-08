// api/links.js - 兼容多种字段名的友链API

export default async function handler(req, res) {
  // 设置跨域
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'GET') {
    try {
      const links = global.linksList || [];
      res.status(200).json({ success: true, data: links });
    } catch (error) {
      res.status(500).json({ success: false, error: '读取友链失败' });
    }
    return;
  }

  if (req.method === 'POST') {
    try {
      console.log('收到的数据：', req.body); // 添加日志，方便调试

      // 兼容多种可能的字段名
      const siteName = req.body.siteName || req.body.name || req.body.sitename;
      const siteUrl = req.body.siteUrl || req.body.url || req.body.website;
      const siteDesc = req.body.siteDesc || req.body.description || req.body.desc || '';
      const email = req.body.email || '';

      // 验证必填字段
      if (!siteName || !siteUrl) {
        res.status(400).json({ 
          success: false, 
          error: '网站名称和网址不能为空',
          received: req.body // 返回收到的数据，方便调试
        });
        return;
      }

      // 验证URL格式
      try {
        new URL(siteUrl);
      } catch (e) {
        res.status(400).json({ 
          success: false, 
          error: '请填写正确的网址格式（包含http://或https://）' 
        });
        return;
      }

      // 创建新友链申请
      const newLink = {
        id: Date.now(),
        name: siteName,
        url: siteUrl,
        description: siteDesc,
        email: email,
        status: 'pending',
        applyTime: new Date().toISOString()
      };

      if (!global.linksList) {
        global.linksList = [];
      }
      global.linksList.push(newLink);

      res.status(200).json({ 
        success: true, 
        message: '友链申请已提交，等待管理员审核',
        data: newLink
      });
    } catch (error) {
      console.error('POST错误：', error);
      res.status(500).json({ 
        success: false, 
        error: '服务器处理失败：' + error.message 
      });
    }
    return;
  }

  res.status(405).json({ error: 'Method not allowed' });
}
