# Git安装指导

## 下载Git

1. 访问Git官方下载页面：[https://git-scm.com/download/win](https://git-scm.com/download/win)
2. 点击下载最新版本的Git for Windows安装程序

## 安装Git

1. 运行下载的安装程序
2. 按照安装向导的提示进行操作：
   - 选择安装路径（默认即可）
   - 选择组件（默认即可）
   - 选择开始菜单文件夹（默认即可）
   - 选择默认编辑器（推荐使用VS Code或默认选项）
   - 选择PATH环境变量配置（推荐选择"Git from the command line and also from 3rd-party software"）
   - 选择HTTPS传输后端（默认即可）
   - 选择行尾转换（默认即可）
   - 选择终端模拟器（默认即可）
   - 选择额外选项（默认即可）
   - 点击"Install"开始安装

## 验证安装

1. 安装完成后，打开命令提示符或PowerShell
2. 运行命令：`git --version`
3. 如果显示Git版本信息，则安装成功

## 配置Git

安装完成后，需要配置Git的用户信息：

```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

将"Your Name"替换为您的GitHub用户名，"your.email@example.com"替换为您的GitHub邮箱。

## 继续上传操作

安装完成后，请回到命令行，重新运行上传操作。