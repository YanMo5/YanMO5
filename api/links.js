// api/links.js - 支持获取待审核友链
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // GET 请求 - 获取友链列表
  if (req.method === 'GET') {
    try {
      const { status } = req.query; // 获取状态参数，如 ?status=pending
      let links = global.linksList || [];
      
      // 如果指定了状态，则筛选
      if (status) {
        links = links.filter(link => link.status === status);
      }
      
      return res.status(200).json({ 
        success: true, 
        data: links 
      });
    } catch (error) {
      return res.status(500).json({ 
        success: false, 
        error: '读取失败' 
      });
    }
  }

  // POST 请求 - 提交友链申请
  if (req.method === 'POST') {
    try {
      const siteName = req.body['site-name'] || req.body.name;
      const siteUrl = req.body['site-url'] || req.body.url;
      const siteDescription = req.body['site-description'] || req.body.description || '';

      if (!siteName || !siteUrl) {
        return res.status(400).json({ 
          success: false, 
          error: '网站名称和网址不能为空' 
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
        message: '友链申请已提交' 
      });
    } catch (error) {
      return res.status(500).json({ 
        success: false, 
        error: '提交失败' 
      });
    }
  }

  // PUT 请求 - 审核友链（更新状态）
  if (req.method === 'PUT') {
    try {
      const { id, status } = req.body;
      const links = global.linksList || [];
      const link = links.find(l => l.id == id);
      
      if (link) {
        link.status = status;
        return res.status(200).json({ 
          success: true, 
          message: '审核完成' 
        });
      } else {
        return res.status(404).json({ 
          success: false, 
          error: '友链不存在' 
        });
      }
    } catch (error) {
      return res.status(500).json({ 
        success: false, 
        error: '审核失败' 
      });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
