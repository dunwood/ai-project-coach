# Task 09-fix: 清理旧项目残留文件，修复 Cloudflare Pages 404

## 背景

仓库里残留了旧 Next.js 项目的文件（package.json、wrangler.jsonc 等），导致 Cloudflare Pages 构建失败返回 404。需要清理干净，只保留纯静态网站文件。

## 目标

删除所有旧项目残留文件，保留纯静态网站文件，更新 CLAUDE.md 部署规则，push 触发 Cloudflare 自动重新部署。

---

## 第一步：删除以下文件和目录（如果存在的话）

文件：
- package.json
- package-lock.json
- wrangler.jsonc
- wrangler.toml
- open-next.config.ts
- next.config.ts
- next-env.d.ts
- tsconfig.json
- tailwind.config.ts
- postcss.config.js
- eslint.config.mjs
- middleware.ts
- product_design.md

目录（整个删除）：
- prisma/
- app/
- components/
- lib/
- node_modules/
- .open-next/

---

## 第二步：确认保留以下文件和目录（不要删！）

页面文件：
- index.html
- idea.html
- clarify.html
- design.html
- tasks.html
- workspace.html
- routes.html

目录：
- css/
- js/
- data/
- assets/
- functions/
- scripts/

配置和文档：
- CLAUDE.md
- README.md
- .gitignore
- 所有 task*.md 文件（task01.md, task02.md 等）

---

## 第三步：更新 CLAUDE.md

在 CLAUDE.md 末尾新增以下内容：

```markdown
## 部署规则
- 项目通过 Git push 自动部署到 Cloudflare Pages（连接了 GitHub 仓库 dunwood/ai-project-coach）
- 禁止使用 wrangler 命令部署（不要运行 npx wrangler pages deploy 或类似命令）
- 禁止创建 package.json、wrangler.toml、wrangler.jsonc 等构建配置文件
- 这是纯静态网站，不需要任何构建步骤
- 每次 git push 到 main 分支后，Cloudflare 自动拉取代码并部署
- 域名：builder.zhexueyuan.com
```

---

## 第四步：更新 README.md

把 README.md 内容替换为：

```markdown
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
```

---

## 第五步：更新 .gitignore

确保 .gitignore 包含以下内容（去掉 node_modules 相关的旧条目，只保留必要的）：

```
.env
.DS_Store
Thumbs.db
*.log
node_modules/
.open-next/
```

---

## 第六步：提交并推送

```bash
git add -A
git commit -m "fix: 清理旧项目残留文件，修复Cloudflare Pages 404"
git push
```

推送后 Cloudflare Pages 会自动重新部署。等 1-2 分钟后访问 https://builder.zhexueyuan.com 确认可用。

---

## 完成标志

- [ ] 所有旧项目文件已删除（package.json、prisma/、app/、components/、lib/ 等）
- [ ] 纯静态网站文件全部保留
- [ ] CLAUDE.md 已更新部署规则
- [ ] README.md 已更新
- [ ] 代码已 push 到 GitHub
- [ ] （等待 Cloudflare 自动部署后）builder.zhexueyuan.com 可正常访问

## ⚠️ 禁止操作

- 不要运行任何 wrangler 命令
- 不要创建 package.json
- 不要创建任何构建配置文件
