# Task 06: UI 美化 + 移动端适配 + 部署上线

## 目标

1. 全站 UI 美化：统一视觉风格，提升专业感
2. 全站移动端适配：确保手机上体验流畅
3. 部署到 Cloudflare Pages，绑定 builder.zhexueyuan.com

---

## 第一部分：全站 UI 美化

### 1.1 全局优化（css/style.css）

**页面过渡**
- 所有页面的 `<main>` 内容区加入淡入动画：opacity 0→1，duration 0.3s

**按钮统一**
- btn-primary：hover 时轻微上移（translateY(-2px)）+ 发光效果（box-shadow 用强调色半透明）
- btn-secondary：hover 时边框变亮 + 文字变亮
- 所有按钮加 `transition: all 0.2s ease`
- 禁用态按钮：opacity 0.5, cursor: not-allowed, 去掉 hover 效果

**卡片统一**
- 所有 .card 加 hover 效果：轻微上移 + 阴影加深
- 卡片之间间距统一 16px

**输入框统一**
- input 和 textarea focus 时：边框变为强调色，加外发光（box-shadow: 0 0 0 3px rgba(0,229,255,0.15)）

**Toast 提示组件**
- 如果还没有 toast 组件，在 css/style.css 中新增 .toast 样式
- 位置：屏幕顶部居中，固定定位
- 动画：从上方滑入，3秒后自动消失
- 样式：深色背景，白色文字，圆角，带左侧彩色竖条（成功=绿色，错误=红色，信息=青色）

**滚动条美化**
- 给 ::-webkit-scrollbar 加自定义样式
- 宽度 6px，滑块颜色用边框色，圆角

### 1.2 首页美化（index.html）

**Hero 区**
- 主标题加微弱的渐变色效果（从白色到浅青色）
- 标签徽章加呼吸动画（缓慢的 opacity 变化）
- 两个按钮之间间距适当加大

**价值卡片**
- 每张卡片左上角的 emoji 字号加大到 32px
- 卡片标题和描述之间间距加大

**流程步骤区**
- 步骤之间的箭头用 CSS 伪元素实现，不用文字"→"
- 每个步骤圈一个序号圆（1、2、3），用强调色背景

**FAQ 区**
- 展开/收起的箭头图标用 CSS 三角形实现旋转动画
- 展开时内容区有左侧青色竖线装饰

### 1.3 想法输入页美化（idea.html）

**示例卡片**
- 选中态：左侧加青色竖条 + 背景微亮
- hover 态：边框变亮

**输入框**
- textarea 底部显示字数统计，右对齐，小字灰色

### 1.4 需求澄清页美化（clarify.html）

**提示词展示区**
- 代码框左侧加一条青色竖线装饰
- 代码框内文字用等宽字体

**表单分组**
- 每组标题（基本定义、功能定义、技术约束、范围收束）用小号加粗 + 上方分割线
- 必填字段的 label 后加红色 * 标记

**进度条**
- 进度条高度 8px，圆角，背景用边框色
- 填充部分带动画过渡（width transition 0.3s）

### 1.5 设计书页美化（design.html）

**Tab 切换**
- 选中的 tab 底部加青色下划线（2px）
- 切换时内容区有淡入效果

**Markdown 预览区**
- 预览区和编辑区并排显示（桌面端左右分栏，移动端上下堆叠）
- 预览区加背景色区分（比 textarea 略亮一点）

### 1.6 任务拆解页美化（tasks.html）

**手风琴**
- 与首页 FAQ 风格统一
- 基础知识的两项（CLI、VS Code）标题前加 📖 图标
- AI 工具的三项标题前加 🤖 图标
- 最后一项标题前加 💡 图标

**庆祝弹窗**
- 弹窗出现时有缩放动画（从 0.8 放大到 1）
- 🎉 emoji 大号显示

### 1.7 工作台页美化（workspace.html）

**项目卡片**
- 阶段标签用不同颜色的小圆角标签
- 卡片右上角显示相对时间（"3小时前"、"昨天"）

**空状态**
- 空状态区域居中显示，加一个大号 emoji（📝 或 🚀）

---

## 第二部分：移动端适配

检查并修复所有页面在 < 768px 宽度下的表现：

### 全局

- 导航栏：logo 和工作台链接保持一行，字号适当缩小
- .container：左右 padding 改为 16px
- 所有按钮：在移动端该全宽的地方设为 width: 100%
- 页面导航条（返回首页 | 返回上一页）：保持一行，字号缩小

### 首页

- Hero 区：文字居中，按钮堆叠为上下两个全宽按钮
- 价值卡片：改为单列
- 流程步骤：改为纵向排列，箭头变为向下
- 成果预览卡片：改为单列
- FAQ：不变（本身就是全宽）

### 想法输入页

- 示例卡片：改为单列
- 按钮区：改为纵向堆叠

### 需求澄清页

- 提示词展示区：全宽显示
- AI 平台链接：改为两行三列网格（而非横排）
- 表单字段：全宽
- 单选按钮组：如果太挤，改为纵向排列

### 设计书页

- Tab 按钮：如果三个放不下，缩小字号或换行
- 编辑区和预览区：改为上下堆叠（编辑在上，预览在下）
- 操作按钮：纵向堆叠

### 任务拆解页

- 各区域全宽
- 手风琴展开内容中的代码文字：允许横向滚动，不折行
- 底部按钮：纵向堆叠

### 工作台

- 项目卡片：单列全宽
- 数据管理按钮：纵向堆叠

---

## 第三部分：部署到 Cloudflare Pages

### 步骤

1. 确保所有文件已 commit 并 push 到 GitHub（dunwood/ai-project-coach）

2. 通过 Wrangler CLI 部署：

```bash
npx wrangler pages deploy . --project-name=ai-project-coach
```

首次部署时会提示选择账号和创建项目，按提示操作即可。

3. 部署成功后会得到一个 *.pages.dev 的临时域名，先用这个测试。

4. 绑定自定义域名 builder.zhexueyuan.com：
   - 在 Cloudflare Dashboard → Pages → ai-project-coach 项目
   - 进入 Custom domains
   - 添加 `builder.zhexueyuan.com`
   - 因为 zhexueyuan.com 已经在 Cloudflare 上，DNS 会自动配置

5. 等待 DNS 生效（通常几分钟），然后访问 https://builder.zhexueyuan.com 确认可用。

### 注意事项

- 这是纯静态网站，不需要任何构建命令
- 部署目录就是项目根目录（`.`）
- 不需要 wrangler.toml 或 wrangler.jsonc（如果根目录有旧项目留下的，忽略或删除）
- 每次更新后重新运行 `npx wrangler pages deploy . --project-name=ai-project-coach` 即可

---

## 完成标志

- [ ] 全站 hover 效果、过渡动画统一且流畅
- [ ] Toast 提示组件可用
- [ ] 首页流程步骤的序号圆和箭头视觉效果好
- [ ] FAQ 和手风琴展开/收起动画流畅
- [ ] 所有页面在手机（< 768px）上布局合理，不溢出、不重叠
- [ ] 按钮在移动端该全宽的地方是全宽
- [ ] 设计书页移动端编辑区和预览区上下堆叠
- [ ] 已成功部署到 Cloudflare Pages
- [ ] builder.zhexueyuan.com 可正常访问
- [ ] 在手机浏览器中打开 builder.zhexueyuan.com 测试正常
- [ ] git commit -m "feat: UI美化 + 移动端适配 + 部署上线" 并 push

## ⚠️ 禁止操作

- 不要引入任何 CSS 框架
- 不要引入任何 JS 动画库
- 不要修改页面的功能逻辑，只改样式和布局
- 不要创建 package.json 或引入构建工具
