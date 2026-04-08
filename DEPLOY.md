# 网站部署指南

## 本地开发

1. **克隆仓库**
   ```bash
   git clone https://github.com/YanMo5/YanMO5.git
   cd YanMO5
   ```

2. **启动服务器**
   ```bash
   cd server
   python server.py
   ```

3. **访问网站**
   打开浏览器，访问 http://localhost:3000

## 云环境部署

### 1. 准备工作

- 云服务器（推荐使用阿里云、腾讯云、AWS等）
- Python 3.6+ 环境
- 防火墙开放 3000 端口

### 2. 部署步骤

1. **登录云服务器**
   ```bash
   ssh root@your-server-ip
   ```

2. **安装依赖**
   ```bash
   # 安装Python（如果尚未安装）
   sudo apt update
   sudo apt install python3 python3-pip
   ```

3. **克隆仓库**
   ```bash
   git clone https://github.com/YanMo5/YanMO5.git
   cd YanMO5
   ```

4. **启动服务器**
   ```bash
   cd server
   python server.py
   ```

5. **设置后台运行**
   为了让服务器在后台持续运行，建议使用 `nohup` 或 `screen`：
   ```bash
   # 使用nohup
   nohup python server.py > server.log 2>&1 &
   
   # 或使用screen
   screen -S blog-server
   python server.py
   # 按 Ctrl+A+D  detach
   ```

### 3. 配置域名（可选）

1. **购买域名**
   在域名注册商处购买域名

2. **解析域名**
   将域名解析到云服务器的IP地址

3. **配置反向代理**
   推荐使用 Nginx 作为反向代理，将域名请求转发到 3000 端口：
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;
       
       location / {
           proxy_pass http://localhost:3000;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
       }
   }
   ```

### 4. 数据库管理

- 网站使用 SQLite 数据库，位于 `blog.db` 文件中
- 定期备份数据库文件，防止数据丢失

### 5. 监控与维护

- 定期检查服务器运行状态
- 查看服务器日志，及时发现并解决问题
- 定期更新代码，保持网站功能最新

## 常见问题

### 1. 端口被占用
   ```bash
   # 查找占用3000端口的进程
   lsof -i :3000
   # 终止进程
   kill -9 <PID>
   ```

### 2. 数据库连接失败
   - 检查 `blog.db` 文件是否存在
   - 检查文件权限是否正确

### 3. 网站访问缓慢
   - 检查服务器资源使用情况
   - 考虑使用更强大的云服务器

### 4. API 调用失败
   - 检查服务器是否正常运行
   - 检查网络连接是否正常
   - 检查API端点是否正确

## 技术支持

如果遇到部署问题，请联系：
- GitHub: https://github.com/YanMo5
- Email: 3351708803@qq.com
