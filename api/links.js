// api/links.js - 处理友情链接申请的API

export default async function handler(req, res) {
  // 设置允许跨域和请求头
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // 处理预检请求
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // 处理 GET 请求（获取友链列表）
  if (req.method === 'GET') {
    try {
      // 从全局变量读取友链列表
      const links = global.linksList || [];
      res.status(200).json({ 
        success: true, 
        data: links 
      });
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        error: '读取友链失败' 
      });
    }
    return;
  }

  // 处理 POST 请求（提交新的友链申请）
  if (req.method === 'POST') {
    try {
      // 解析请求体中的数据
      const { siteName, siteUrl, siteDesc, email } = req.body;

      // 简单的数据验证
      if (!siteName || !siteUrl) {
        res.status(400).json({ 
          success: false, 
          error: '网站名称和网址不能为空' 
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

      // 创建新友链申请对象
      const newLink = {
        id: Date.now(),
        name: siteName,
        url: siteUrl,
        description: siteDesc || '',
        email: email || '',
        status: 'pending', // pending: 待审核, approved: 已通过, rejected: 已拒绝
        applyTime: new Date().toISOString()
      };

      // 存储到全局变量（注意：服务器重启会丢失，仅用于演示）
      if (!global.linksList) {
        global.linksList = [];
      }
      global.linksList.push(newLink);

      // 返回成功响应
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

  // 其他方法返回405
  res.status(405).json({ error: 'Method not allowed' });
}
