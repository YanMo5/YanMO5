const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const port = 3000;

// 配置中间件
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '.')));

// 连接数据库
const db = new sqlite3.Database('./blog.db', (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
    } else {
        console.log('Connected to the SQLite database.');
        // 创建表
        db.run(`
            CREATE TABLE IF NOT EXISTS messages (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                email TEXT NOT NULL,
                message TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        db.run(`
            CREATE TABLE IF NOT EXISTS links (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                site_name TEXT NOT NULL,
                site_url TEXT NOT NULL,
                site_description TEXT NOT NULL,
                status TEXT DEFAULT 'pending',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        db.run(`
            CREATE TABLE IF NOT EXISTS articles (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL,
                content TEXT NOT NULL,
                category TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
    }
});

// 处理留言提交
app.post('/api/messages', (req, res) => {
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
        return res.status(400).json({ error: 'All fields are required' });
    }
    
    db.run(
        'INSERT INTO messages (name, email, message) VALUES (?, ?, ?)',
        [name, email, message],
        function(err) {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.status(201).json({ id: this.lastID, name, email, message });
        }
    );
});

// 处理友链申请
app.post('/api/links', (req, res) => {
    const { 'site-name': siteName, 'site-url': siteUrl, 'site-description': siteDescription } = req.body;
    if (!siteName || !siteUrl || !siteDescription) {
        return res.status(400).json({ error: 'All fields are required' });
    }
    
    db.run(
        'INSERT INTO links (site_name, site_url, site_description) VALUES (?, ?, ?)',
        [siteName, siteUrl, siteDescription],
        function(err) {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.status(201).json({ id: this.lastID, siteName, siteUrl, siteDescription });
        }
    );
});

// 获取留言列表
app.get('/api/messages', (req, res) => {
    db.all('SELECT * FROM messages ORDER BY created_at DESC', [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
});

// 获取友链列表
app.get('/api/links', (req, res) => {
    db.all('SELECT * FROM links ORDER BY created_at DESC', [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
});

// 审核友链
app.put('/api/links/:id', (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    
    db.run(
        'UPDATE links SET status = ? WHERE id = ?',
        [status, id],
        function(err) {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.json({ id, status });
        }
    );
});

// 删除留言
app.delete('/api/messages/:id', (req, res) => {
    const { id } = req.params;
    
    db.run(
        'DELETE FROM messages WHERE id = ?',
        id,
        function(err) {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.json({ id, deleted: true });
        }
    );
});

// 删除友链
app.delete('/api/links/:id', (req, res) => {
    const { id } = req.params;
    
    db.run(
        'DELETE FROM links WHERE id = ?',
        id,
        function(err) {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.json({ id, deleted: true });
        }
    );
});

// 管理员登录
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    // 简单的验证，实际项目中应该使用加密密码
    if (username === 'admin' && password === 'admin') {
        res.json({ success: true, message: 'Login successful' });
    } else {
        res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
});

// 启动服务器
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});