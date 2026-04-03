# AI 项目教练

面向零基础用户的 Web App，帮用户把模糊的软件想法一步步变成可执行的项目设计书和任务清单。

## 在线访问

https://builder.zhexueyuan.com

## 技术栈

- 纯 HTML + CSS + JavaScript，无框架、无构建工具
- Cloudflare Pages Functions（注册码验证）
- Cloudflare Workers KV（注册码绑定存储）

## 部署

项目通过 GitHub 连接 Cloudflare Pages，push 到 main 分支自动部署。不需要手动操作。

## 本地开发

双击 index.html 即可在浏览器中预览。注册码验证在本地 file:// 模式下自动跳过。
