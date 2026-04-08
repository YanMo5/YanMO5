// api/links.js - 完全适配前端字段名
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // 处理 GET 请求（获取友链，支持状态筛选）
  if (req.method === 'GET') {
    const { status } = req.query;
    let links = global.linksList || [];
    if (status) {
      links = links.filter(link => link.status === status);
    }
    return res.status(200).json({ success: true, data: links });
  }

  // 处理 POST 请求（提交友链申请）
  if (req.method === 'POST') {
    try {
      // 关键：使用前端发送的字段名
      const siteName = req.body['site-name'];
      const siteUrl = req.body['site-url'];
      const siteDescription = req.body['site-description'] || '';

      if (!siteName || !siteUrl) {
        return res.status(400).json({
          success: false,
          error: '网站名称和网址不能为空'
        });
      }

      // 验证URL格式
      try {
        new URL(siteUrl);
      } catch (e) {
        return res.status(400).json({
          success: false,
          error: '请填写正确的网址格式（包含 http:// 或 https://）'
        });
      }

      const newLink = {
        id: Date.now(),
        name: siteName,
        url: siteUrl,
        description: siteDescription,
        status: 'pending',
        applyTime: new Date().toISOString()
      };

      if (!global.linksList) global.linksList = [];
      global.linksList.push(newLink);

      return res.status(200).json({
        success: true,
        message: '友链申请已提交，等待管理员审核',
        data: newLink
      });
    } catch (error) {
      console.error('提交友链错误:', error);
      return res.status(500).json({
        success: false,
        error: '服务器处理失败：' + error.message
      });
    }
  }

  // 处理 PUT 请求（审核友链）
  if (req.method === 'PUT') {
    try {
      const { id, status } = req.body;
      const links = global.linksList || [];
      const link = links.find(l => l.id == id);
      if (link) {
        link.status = status;
        return res.status(200).json({ success: true, message: '审核完成' });
      }
      return res.status(404).json({ success: false, error: '友链不存在' });
    } catch (error) {
      return res.status(500).json({ success: false, error: '审核失败' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
