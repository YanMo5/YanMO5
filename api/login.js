// api/login.js - 管理员登录接口
export default async function handler(req, res) {
  // 设置响应头
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // 处理预检请求
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // 只允许 POST 请求
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { username, password } = req.body;

    // 验证用户名和密码
    // 这里使用环境变量存储管理员账号，更安全
    const adminUser = process.env.ADMIN_USER || 'admin';
    const adminPass = process.env.ADMIN_PASS || 'admin123';

    if (username === adminUser && password === adminPass) {
      // 登录成功
      return res.status(200).json({
        success: true,
        message: '登录成功',
        token: 'admin-session-token-' + Date.now(), // 简单令牌，生产环境建议用JWT
        redirect: '/admin/dashboard.html' // 登录后跳转地址
      });
    } else {
      // 登录失败
      return res.status(401).json({
        success: false,
        error: '用户名或密码错误'
      });
    }
  } catch (error) {
    console.error('登录错误：', error);
    return res.status(500).json({
      success: false,
      error: '服务器错误：' + error.message
    });
  }
}
