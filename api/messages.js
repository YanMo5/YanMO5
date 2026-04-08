// api/messages.js - 完整的留言API

export default async function handler(req, res) {
  // 1. 设置允许跨域和请求头
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // 2. 处理预检请求（浏览器在POST前会自动发送）
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // 3. 处理 GET 请求（获取留言列表）
  if (req.method === 'GET') {
    try {
      // 这里先从内存数组读取，之后可以改为从数据库读取
      const messages = global.messagesList || [];
      res.status(200).json({ 
        success: true, 
        data: messages 
      });
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        error: '读取留言失败' 
      });
    }
    return;
  }

  // 4. 处理 POST 请求（提交新留言）
  if (req.method === 'POST') {
    try {
      // 解析请求体中的数据
      const { name, email, message } = req.body;

      // 简单的数据验证
      if (!name || !message) {
        res.status(400).json({ 
          success: false, 
          error: '姓名和留言内容不能为空' 
        });
        return;
      }

      // 创建新留言对象
      const newMessage = {
        id: Date.now(),
        name: name,
        email: email || '',
        content: message,
        time: new Date().toISOString(),
        status: 'pending' // 待审核
      };

      // 存储到全局变量（注意：服务器重启会丢失，仅用于演示）
      if (!global.messagesList) {
        global.messagesList = [];
      }
      global.messagesList.push(newMessage);

      // 返回成功响应
      res.status(200).json({ 
        success: true, 
        message: '留言提交成功，等待审核',
        data: newMessage
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

  // 5. 其他方法返回405
  res.status(405).json({ error: 'Method not allowed' });
}
