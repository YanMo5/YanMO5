// api/stats.js - 访问统计
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    try {
      // 示例统计数据
      const stats = {
        totalVisits: global.totalVisits || 1234,
        todayVisits: 56,
        onlineUsers: 3
      };
      
      return res.status(200).json({ 
        success: true, 
        data: stats 
      });
    } catch (error) {
      return res.status(500).json({ 
        success: false, 
        error: '获取统计失败' 
      });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
