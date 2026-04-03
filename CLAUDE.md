# CLAUDE.md

## 项目名称
AI 项目教练

## 项目定位
面向零基础用户的 Web App，帮用户把模糊的软件想法一步步变成可执行的项目设计书和任务清单。

## 技术栈
- 纯 HTML + CSS + JavaScript，无框架、无构建工具
- 本站不直接调用任何 AI API，而是生成提示词模板供用户在站外大模型中使用
- 提供各大模型的超链接入口方便用户跳转
- 数据持久化使用 localStorage
- 部署平台：Cloudflare Pages
- 域名：builder.zhexueyuan.com

## 开发原则
- 一次只执行一个 task 文件
- 未经明确要求，不要跨 task 扩展功能
- 中文界面文案优先
- 所有页面必须有返回导航
- 移动端优先设计
- 不引入任何构建工具（webpack、vite 等）
- 不引入任何 CSS 框架（tailwind、bootstrap 等）
- 不引入任何 JS 框架（react、vue 等）
- 文件直接用浏览器打开即可运行

## 文件结构约定
- 页面文件放根目录：index.html, idea.html, clarify.html 等
- 样式统一在 css/style.css
- JS 按功能拆分放 js/ 目录
- 静态数据放 data/ 目录

## 任务执行流程
1. 先读取当前 task 文件
2. 说明将创建或修改哪些文件
3. 执行任务
4. 完成后列出新增和修改的文件清单

## Windows 环境
- Python 命令用 python（不是 python3）
- 路径分隔符用 \
- 项目目录：C:\Users\Admin\ai-project-coach

## 部署规则
- 项目通过 Git push 自动部署到 Cloudflare Pages（连接了 GitHub 仓库 dunwood/ai-project-coach）
- 禁止使用 wrangler 命令部署（不要运行 npx wrangler pages deploy 或类似命令）
- 禁止创建 package.json、wrangler.toml、wrangler.jsonc 等构建配置文件
- 这是纯静态网站，不需要任何构建步骤
- 每次 git push 到 main 分支后，Cloudflare 自动拉取代码并部署
- 域名：builder.zhexueyuan.com
