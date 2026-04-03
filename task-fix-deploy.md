# Task: 修复部署事故（紧急）

## 背景

在添加注册码功能（Cloudflare KV）时，项目从 Direct Upload 迁移到 Git 连接自动部署，导致两个问题：
1. pages.dev 域名能打开但 CSS 完全丢失（只有裸 HTML）
2. builder.zhexueyuan.com 返回 404

## 第一步：诊断当前项目状态

运行以下命令，把每一步的输出都告诉我：

```bash
# 1. 确认当前在正确的项目目录
pwd

# 2. 查看项目文件结构（确认 css/、js/ 等目录存在）
ls -la
ls -la css/
ls -la js/

# 3. 检查 index.html 中 CSS 引用路径
head -30 index.html

# 4. 检查 git 状态
git status
git remote -v
git log --oneline -5

# 5. 检查是否有 wrangler 配置文件（可能是事故原因）
ls -la wrangler.toml wrangler.jsonc wrangler.json 2>/dev/null || echo "无 wrangler 配置文件"

# 6. 检查是否有 _worker.js 或 functions/ 目录（Workers/KV 相关残留）
ls -la _worker.js 2>/dev/null || echo "无 _worker.js"
ls -la functions/ 2>/dev/null || echo "无 functions/ 目录"

# 7. 检查 .gitignore 是否误排除了 css 或 js 目录
cat .gitignore

# 8. 检查 GitHub 上实际有哪些文件（确认 css/ 和 js/ 已推送）
git ls-files | head -50
```

## 第二步：根据诊断结果修复

### 情况 A：如果 css/ 或 js/ 没有被 git 跟踪

```bash
git add css/ js/ assets/ data/
git commit -m "fix: 确保所有静态资源文件被跟踪"
git push
```

### 情况 B：如果有 wrangler.toml / wrangler.jsonc / wrangler.json

这些文件可能导致 Cloudflare Pages 用错误的方式构建项目。删除它们：

```bash
rm -f wrangler.toml wrangler.jsonc wrangler.json
git add -A
git commit -m "fix: 删除 wrangler 配置文件，使用纯静态部署"
git push
```

### 情况 C：如果有 _worker.js 或 functions/ 目录

这些是 Cloudflare Workers/KV 的残留，可能干扰纯静态部署：

```bash
rm -f _worker.js
rm -rf functions/
git add -A
git commit -m "fix: 删除 Workers 残留文件，恢复纯静态部署"
git push
```

### 情况 D：如果 index.html 中 CSS 路径有问题

CSS 引用应该是相对路径，例如：
```html
<link rel="stylesheet" href="css/style.css">
```

而不是绝对路径如 `/css/style.css`（在某些部署配置下可能出问题）。如果是绝对路径，改为相对路径。

### 情况 E：如果 .gitignore 排除了关键目录

检查 .gitignore 中是否有 `css/`、`js/`、`*.css` 等规则，如果有，删除这些规则并重新 add：

```bash
# 编辑 .gitignore 删除误排除的规则
git add -A
git commit -m "fix: 修复 .gitignore 误排除静态资源"
git push
```

## 第三步：综合修复

如果上面多个情况同时存在，一次性修复：

```bash
# 删除所有可能的干扰文件
rm -f wrangler.toml wrangler.jsonc wrangler.json _worker.js
rm -rf functions/

# 确保所有必要文件都被跟踪
git add -A

# 查看将要提交的变更
git status

# 提交并推送
git commit -m "fix: 清理部署残留，恢复纯静态网站"
git push
```

推送后等待 1-2 分钟（Cloudflare 自动部署），然后：

```bash
# 用 curl 测试 pages.dev 是否正常返回 CSS
curl -s -o /dev/null -w "%{http_code}" https://ai-project-coach.pages.dev/css/style.css
```

## 第四步：报告结果

请告诉我：
1. 第一步诊断中每条命令的输出
2. 发现了哪些问题（A/B/C/D/E）
3. 修复后 git push 是否成功
4. 等部署完成后，访问 https://ai-project-coach.pages.dev 是否恢复正常（有 CSS 样式）

## ⚠️ 注意

- 不要创建任何 wrangler 配置文件
- 不要运行 `npx wrangler pages deploy` 或类似命令
- 只通过 git push 触发自动部署
- 不要修改任何页面功能，只修复部署问题
