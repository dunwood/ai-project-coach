# Task 02: 想法输入页 + 项目存储 + 工作台

## 目标

完成三个页面：
1. **idea.html**（想法输入页）：用户输入软件想法，保存为项目
2. **workspace.html**（工作台页）：管理所有已创建的项目
3. **js/project.js**：localStorage 项目数据管理

做完后用户可以：输入想法 → 保存为项目 → 在工作台看到项目列表 → 点击继续推进。

---

## 第一步：项目数据管理 js/project.js

### 数据结构

localStorage key：`ai_coach_projects`

存储格式：
```json
[
  {
    "id": "proj_1711234567890",
    "title": "高考择业助手",
    "idea": "我想做一个帮高考生选专业的AI工具，结合AI对职业的冲击分析，帮家长和学生做决策",
    "stage": "idea",
    "created_at": "2026-04-02T10:00:00Z",
    "updated_at": "2026-04-02T10:00:00Z",
    "clarify_answers": null,
    "design_doc": null,
    "task_plan": null
  }
]
```

### stage 枚举值
- `idea`：已输入想法
- `clarify`：已完成需求澄清
- `design`：已生成设计书
- `tasks`：已生成任务拆解

### 需要实现的函数

```javascript
// 获取所有项目（按更新时间倒序）
function getAllProjects() {}

// 根据 ID 获取单个项目
function getProject(id) {}

// 创建新项目（传入 title 和 idea）
function createProject(title, idea) {}

// 更新项目（传入 id 和要更新的字段对象）
function updateProject(id, updates) {}

// 删除项目（传入 id）
function deleteProject(id) {}

// 导出所有项目为 JSON 字符串
function exportProjects() {}

// 导入项目（传入 JSON 字符串，合并到现有数据）
function importProjects(jsonString) {}
```

id 生成规则：`"proj_" + Date.now() + "_" + Math.random().toString(36).slice(2,8)`

---

## 第二步：想法输入页 idea.html

### 页面结构

```
顶部导航栏（nav.js）

面包屑导航
  首页 > 开始做项目

页面标题区
  标题："告诉我，你想做什么？"
  说明文字："用大白话描述就行。比如你想做一个什么工具、给谁用、解决什么问题。不需要专业术语，想到什么说什么。"

项目名称输入
  label："给项目起个名字"
  input 输入框，placeholder："比如：高考择业助手"
  底部小字提示："简短好记就行，后面可以改"

想法输入区
  label："描述你的想法"
  textarea 大输入框（至少 6 行高）
  placeholder："比如：我想做一个帮高考生选专业的 AI 工具。家长输入孩子的成绩和兴趣，系统推荐适合的专业，并给出 AI 时代这个专业的前景分析。"

示例想法区
  标题："不知道怎么写？参考这些例子"
  3-4 个示例卡片（点击可自动填入项目名称和想法）：
  
  示例1：
    名称："高考择业助手"
    想法："我想做一个帮高考生选专业的 AI 工具。家长输入孩子的成绩和兴趣，系统推荐适合的专业，并给出 AI 时代这个专业的前景分析和就业方向。"
  
  示例2：
    名称："读书笔记整理工具"
    想法："我想做一个网页工具，把我在各种地方记的读书笔记整理归纳。我粘贴进一段摘录，工具自动识别书名、分类、提取关键观点，最后生成一份结构化的笔记合集。"
  
  示例3：
    名称："小区跑腿互助平台"
    想法："我想做一个小程序，小区居民可以发布跑腿需求（取快递、买菜、遛狗等），其他居民可以接单帮忙，赚点小钱或者积分。"
  
  示例4：
    名称："AI 面试模拟器"
    想法："我想做一个模拟面试的网页工具。用户输入目标岗位，AI 扮演面试官提问，用户回答后 AI 给出评分和改进建议。"

底部操作栏
  主按钮（btn-primary）：「保存并继续」
    - 校验：项目名称和想法不能为空
    - 校验通过后：调用 createProject() 保存到 localStorage
    - 保存成功后：跳转到 clarify.html?id=项目ID
  
  副按钮（btn-secondary）：「保存到工作台，稍后继续」
    - 同样保存，但跳转到 workspace.html
  
  链接：「查看我的工作台」→ workspace.html

Footer（nav.js）
```

### 交互细节

- 点击示例卡片时：项目名称和想法同时填入对应输入框，卡片出现"已选中"状态（青色边框）
- 用户手动修改输入框后，示例卡片的选中状态清除
- 项目名称和想法输入框下方都有字数提示（实时更新，如"已输入 45 字"）
- 想法输入框的 textarea 可拖拽调整高度
- 如果 URL 参数有 `?id=xxx`，说明是编辑已有项目，自动加载该项目数据填入表单，按钮文字改为「保存修改」

---

## 第三步：工作台页 workspace.html

### 页面结构

```
顶部导航栏（nav.js）

页面标题区
  标题："我的工作台"
  说明文字："管理你的所有项目，随时回到任何阶段继续推进。"
  右侧按钮：「创建新项目」→ idea.html

项目列表区
  如果没有项目：
    空状态卡片：
      图标或插图
      "还没有项目"
      "有了想法就可以开始，点击下方按钮创建你的第一个项目"
      按钮：「开始做第一个项目」→ idea.html
  
  如果有项目：
    项目卡片列表（每个项目一张卡片，按更新时间倒序）
    
    每张卡片包含：
      项目名称（大字）
      想法摘要（最多显示 80 字，超出截断 + ...）
      当前阶段标签：
        idea → 标签"已输入想法"（灰色）
        clarify → 标签"已澄清需求"（青色）
        design → 标签"已生成设计书"（紫色）
        tasks → 标签"已拆解任务"（绿色）
      创建时间
      最后更新时间
      
      操作按钮：
        「继续推进」→ 根据 stage 跳转到对应页面：
          idea → clarify.html?id=xxx
          clarify → design.html?id=xxx
          design → tasks.html?id=xxx
          tasks → tasks.html?id=xxx
        「编辑想法」→ idea.html?id=xxx
        「删除」→ 确认弹窗后调用 deleteProject()

数据管理区（页面底部）
  标题："数据管理"
  说明："所有数据存储在你的浏览器中。建议定期备份。"
  两个按钮：
    「导出所有项目」→ 调用 exportProjects()，生成 JSON 文件下载
    「导入项目数据」→ 弹出文件选择框，选择 JSON 文件，调用 importProjects()

Footer（nav.js）
```

### 导出功能细节

- 点击「导出所有项目」后，生成一个 `ai-coach-projects-2026-04-02.json` 文件并触发下载
- 文件名包含当前日期

### 导入功能细节

- 点击「导入项目数据」弹出文件选择器（accept=".json"）
- 读取文件后解析 JSON
- 合并逻辑：如果导入数据中有和现有项目相同 id 的，跳过（不覆盖）；新 id 的项目追加到列表
- 导入完成后刷新页面显示更新后的列表
- 解析失败时弹出提示："导入失败，请检查文件格式"

### 删除确认弹窗

- 使用自定义弹窗（不用 confirm()）
- 弹窗内容："确定要删除项目「{项目名}」吗？此操作不可恢复。"
- 两个按钮：「取消」和「确定删除」（红色按钮）

---

## 第四步：首页 index.html 更新

首页「开始做项目」按钮的跳转目标改为 `idea.html`（如果还不是的话确认一下）。

首页最近项目区域（如果有的话）不需要改动。如果首页没有最近项目区域，不用加。

---

## 第五步：clarify.html 空壳更新

clarify.html 暂时还是空壳，但更新内容为：

```
顶部导航栏（nav.js）

面包屑导航
  首页 > 工作台 > 需求澄清

页面标题区
  标题："需求澄清（即将上线）"
  说明文字："这个环节会引导你把模糊的想法变成清晰的项目定义。正在开发中，敬请期待。"

当前项目信息卡
  从 URL 参数 ?id=xxx 读取项目 ID
  调用 getProject(id) 加载项目数据
  显示：项目名称、想法内容
  
  如果找不到项目，显示错误提示并引导回工作台

底部链接
  「返回工作台」→ workspace.html
  「编辑想法」→ idea.html?id=xxx

Footer（nav.js）
```

---

## 完成标志

- [ ] idea.html：可输入项目名和想法，点击示例卡片自动填入
- [ ] idea.html：保存后数据写入 localStorage，跳转到 clarify.html?id=xxx
- [ ] idea.html：URL 带 ?id=xxx 时加载已有项目数据（编辑模式）
- [ ] workspace.html：显示所有已创建的项目卡片
- [ ] workspace.html：项目卡片显示阶段标签、时间、操作按钮
- [ ] workspace.html：删除功能正常（有确认弹窗）
- [ ] workspace.html：导出功能生成 JSON 文件下载
- [ ] workspace.html：导入功能可读取 JSON 文件并合并项目
- [ ] workspace.html：无项目时显示空状态引导
- [ ] clarify.html：空壳已更新，能显示对应项目信息
- [ ] 移动端布局正常
- [ ] git commit -m "feat: 想法输入页 + 工作台 + 项目存储" 并 push

## ⚠️ 禁止操作

- 不要引入任何 npm 包或框架
- 不要创建后端或 API
- 不要引入数据库
- 不要修改 index.html 的 Hero 区和 FAQ 内容（已在 task01-fix 中更新过）
