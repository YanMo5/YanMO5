import http.server
import socketserver
import json
import sqlite3
import os

PORT = 3000

# 数据库路径
db_path = os.path.join(os.path.dirname(__file__), '..', 'blog.db')

class MyHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        # 更改工作目录到网站根目录
        super().__init__(*args, directory=os.path.join(os.path.dirname(__file__), '..'), **kwargs)
    
    def do_GET(self):
        if self.path == '/api/messages':
            conn = sqlite3.connect(db_path)
            c = conn.cursor()
            c.execute('SELECT * FROM messages ORDER BY created_at DESC')
            messages = c.fetchall()
            conn.close()
            
            # 转换为字典列表
            messages_list = []
            for msg in messages:
                messages_list.append({
                    'id': msg[0],
                    'name': msg[1],
                    'email': msg[2],
                    'message': msg[3],
                    'created_at': msg[4]
                })
            
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps(messages_list).encode('utf-8'))
            
        elif self.path == '/api/links':
            conn = sqlite3.connect(db_path)
            c = conn.cursor()
            c.execute('SELECT * FROM links ORDER BY created_at DESC')
            links = c.fetchall()
            conn.close()
            
            # 转换为字典列表
            links_list = []
            for link in links:
                links_list.append({
                    'id': link[0],
                    'site_name': link[1],
                    'site_url': link[2],
                    'site_description': link[3],
                    'status': link[4],
                    'created_at': link[5]
                })
            
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps(links_list).encode('utf-8'))
            
        elif self.path == '/api/articles':
            conn = sqlite3.connect(db_path)
            c = conn.cursor()
            c.execute('SELECT * FROM articles ORDER BY created_at DESC')
            articles = c.fetchall()
            conn.close()
            
            # 转换为字典列表
            articles_list = []
            for article in articles:
                articles_list.append({
                    'id': article[0],
                    'title': article[1],
                    'content': article[2],
                    'category': article[3],
                    'created_at': article[4]
                })
            
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps(articles_list).encode('utf-8'))
            
        elif self.path == '/api/stats':
            conn = sqlite3.connect(db_path)
            c = conn.cursor()
            
            # 获取待审核友链数量
            c.execute('SELECT COUNT(*) FROM links WHERE status = ?', ('pending',))
            pending_links = c.fetchone()[0]
            
            # 获取已发布文章数量
            c.execute('SELECT COUNT(*) FROM articles')
            published_articles = c.fetchone()[0]
            
            # 简单的访问量统计（实际项目中应该使用更复杂的方法）
            # 这里我们使用一个简单的文件来存储访问量
            views_file = os.path.join(os.path.dirname(__file__), '..', 'views.txt')
            if not os.path.exists(views_file):
                with open(views_file, 'w') as f:
                    f.write('1000')
            
            with open(views_file, 'r') as f:
                views = int(f.read())
            
            # 每次访问增加10个访问量（模拟）
            views += 10
            with open(views_file, 'w') as f:
                f.write(str(views))
            
            conn.close()
            
            stats = {
                'pending_links': pending_links,
                'published_articles': published_articles,
                'total_views': views
            }
            
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps(stats).encode('utf-8'))
        else:
            super().do_GET()
    
    def do_POST(self):
        if self.path == '/api/messages':
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            data = json.loads(post_data.decode('utf-8'))
            
            conn = sqlite3.connect(db_path)
            c = conn.cursor()
            c.execute(
                'INSERT INTO messages (name, email, message) VALUES (?, ?, ?)',
                (data['name'], data['email'], data['message'])
            )
            conn.commit()
            conn.close()
            
            self.send_response(201)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps(data).encode('utf-8'))
            
        elif self.path == '/api/links':
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            data = json.loads(post_data.decode('utf-8'))
            
            # 处理前端发送的字段名格式
            site_name = data.get('site-name', data.get('site_name', ''))
            site_url = data.get('site-url', data.get('site_url', ''))
            site_description = data.get('site-description', data.get('site_description', ''))
            
            conn = sqlite3.connect(db_path)
            c = conn.cursor()
            c.execute(
                'INSERT INTO links (site_name, site_url, site_description) VALUES (?, ?, ?)',
                (site_name, site_url, site_description)
            )
            conn.commit()
            conn.close()
            
            self.send_response(201)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps(data).encode('utf-8'))
            
        elif self.path == '/api/articles':
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            data = json.loads(post_data.decode('utf-8'))
            
            conn = sqlite3.connect(db_path)
            c = conn.cursor()
            c.execute(
                'INSERT INTO articles (title, content, category) VALUES (?, ?, ?)',
                (data['title'], data['content'], data['category'])
            )
            conn.commit()
            conn.close()
            
            self.send_response(201)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps(data).encode('utf-8'))
            
        elif self.path == '/api/login':
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            data = json.loads(post_data.decode('utf-8'))
            
            # 读取管理员密码
            admin_password_file = os.path.join(os.path.dirname(__file__), '..', 'admin_password.txt')
            if not os.path.exists(admin_password_file):
                # 默认密码
                with open(admin_password_file, 'w') as f:
                    f.write('admin')
            
            with open(admin_password_file, 'r') as f:
                admin_password = f.read().strip()
            
            if data['username'] == 'admin' and data['password'] == admin_password:
                response = {'success': True, 'message': 'Login successful'}
                self.send_response(200)
            else:
                response = {'success': False, 'message': 'Invalid credentials'}
                self.send_response(401)
            
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps(response).encode('utf-8'))
        
        elif self.path == '/api/change-password':
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            data = json.loads(post_data.decode('utf-8'))
            
            # 读取当前密码
            admin_password_file = os.path.join(os.path.dirname(__file__), '..', 'admin_password.txt')
            if not os.path.exists(admin_password_file):
                with open(admin_password_file, 'w') as f:
                    f.write('admin')
            
            with open(admin_password_file, 'r') as f:
                current_password = f.read().strip()
            
            # 验证当前密码
            if data['current_password'] != current_password:
                response = {'success': False, 'message': 'Current password is incorrect'}
                self.send_response(401)
            else:
                # 更新密码
                with open(admin_password_file, 'w') as f:
                    f.write(data['new_password'])
                response = {'success': True, 'message': 'Password changed successfully'}
                self.send_response(200)
            
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps(response).encode('utf-8'))
        else:
            self.send_response(404)
            self.end_headers()
    
    def do_PUT(self):
        if self.path.startswith('/api/links/'):
            # 处理友链审核
            link_id = self.path.split('/')[-1]
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            data = json.loads(post_data.decode('utf-8'))
            
            conn = sqlite3.connect(db_path)
            c = conn.cursor()
            c.execute(
                'UPDATE links SET status = ? WHERE id = ?',
                (data['status'], link_id)
            )
            conn.commit()
            conn.close()
            
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({'id': link_id, 'status': data['status']}).encode('utf-8'))
            
        elif self.path.startswith('/api/articles/'):
            # 处理文章编辑
            article_id = self.path.split('/')[-1]
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            data = json.loads(post_data.decode('utf-8'))
            
            conn = sqlite3.connect(db_path)
            c = conn.cursor()
            c.execute(
                'UPDATE articles SET title = ?, content = ?, category = ? WHERE id = ?',
                (data['title'], data['content'], data['category'], article_id)
            )
            conn.commit()
            conn.close()
            
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps(data).encode('utf-8'))
        else:
            self.send_response(404)
            self.end_headers()
    
    def do_DELETE(self):
        if self.path.startswith('/api/messages/'):
            # 处理留言删除
            message_id = self.path.split('/')[-1]
            
            conn = sqlite3.connect(db_path)
            c = conn.cursor()
            c.execute('DELETE FROM messages WHERE id = ?', (message_id,))
            conn.commit()
            conn.close()
            
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({'id': message_id, 'deleted': True}).encode('utf-8'))
            
        elif self.path.startswith('/api/links/'):
            # 处理友链删除
            link_id = self.path.split('/')[-1]
            
            conn = sqlite3.connect(db_path)
            c = conn.cursor()
            c.execute('DELETE FROM links WHERE id = ?', (link_id,))
            conn.commit()
            conn.close()
            
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({'id': link_id, 'deleted': True}).encode('utf-8'))
            
        elif self.path.startswith('/api/articles/'):
            # 处理文章删除
            article_id = self.path.split('/')[-1]
            
            conn = sqlite3.connect(db_path)
            c = conn.cursor()
            c.execute('DELETE FROM articles WHERE id = ?', (article_id,))
            conn.commit()
            conn.close()
            
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({'id': article_id, 'deleted': True}).encode('utf-8'))
        else:
            self.send_response(404)
            self.end_headers()

# 启动服务器
with socketserver.TCPServer(("", PORT), MyHTTPRequestHandler) as httpd:
    print(f"服务器运行在 http://localhost:{PORT}")
    httpd.serve_forever()
