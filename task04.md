# Task 04: 设计书生成页

## 目标

实现 design.html——用户在需求澄清之后，在这里生成项目设计书。

本站不调用 AI，而是：
1. 展示用户已澄清的项目定义摘要
2. 提供三个版本的「设计书生成提示词」，用户复制到站外大模型生成设计书
3. 用户把 AI 生成的设计书粘贴回来保存
4. 支持三个版本切换、编辑、导出

---

## 页面结构 design.html

```
顶部导航栏（nav.js）

页面导航条
  ← 返回首页 | ← 返回上一页

面包屑
  首页 > 工作台 > 设计书生成

页面标题区
  标题："生成项目设计书"
  说明："根据你已澄清的需求，用 AI 生成一份专业的设计书。选择一个版本，复制提示词到 AI 大模型，把生成的结果粘贴回来。"

项目摘要卡（折叠式）
  标题栏："项目定义摘要"  +  展开/收起按钮
  默认收起，只显示项目名称和核心目标
  展开后显示 clarify_answers 中所有已填字段：
    每个字段一行：字段名（加粗） + 值
    未填写的字段不显示
  底部链接：「返回修改需求」→ clarify.html?id=xxx

版本选择 Tab
  三个 tab 按钮横排：
    「通俗版」— 给非技术人看的大白话
    「标准产品版」— 规范的 PRD 格式
    「AI 编程版」— 给 AI 编程工具读的版本
  默认选中「标准产品版」
  tab 切换时下方内容区跟着切换

每个版本的内容区（三个版本结构相同）：

  提示词生成区
    说明文字（每个版本不同，见下方模板区域）
    按钮（btn-primary）：「生成{版本名}提示词」
    
    提示词展示区（点击按钮后显示）：
      深色代码风格背景框
      提示词全文（根据 clarify_answers 动态生成）
      右上角「复制」按钮（点击后变"已复制 ✓"）
    
    AI 平台链接区（同 clarify.html）
      Claude / ChatGPT / 豆包 / Kimi / 通义千问 / DeepSeek

  分割线 + 过渡文字
    "在 AI 中生成设计书后，粘贴到下面："

  设计书内容区
    textarea 大输入框（至少 20 行高，可拖拽调整）
    placeholder："把 AI 生成的设计书内容粘贴到这里..."
    如果已有保存内容，预填显示

  设计书预览区
    标题："预览"
    把 textarea 中的内容渲染为格式化展示：
      识别 Markdown 标题（# ## ###）加粗加大
      识别列表（- 或 1.）缩进显示
      识别代码块（```）用代码样式
      不需要完整 Markdown 解析库，简单的正则替换即可
    实时预览：textarea 输入时预览区同步更新

操作按钮栏（固定在内容区底部）

  左侧：
    「保存当前版本」（btn-secondary）
      保存当前 tab 对应版本的内容到 localStorage
      弹出 toast "已保存"
    
    「导出 Markdown」（btn-secondary）
      将当前版本内容导出为 .md 文件下载
      文件名：{项目名}-设计书-{版本名}-{日期}.md
      例如：高考择业助手-设计书-标准产品版-2026-04-02.md

  右侧：
    「保存并继续生成任务拆解」（btn-primary）
      保存所有已填版本的内容
      更新项目 stage 为 "design"
      跳转 tasks.html?id=xxx
      至少要有一个版本填了内容才可点击，否则按钮灰色禁用

Footer（nav.js）
```

---

## 三个版本的提示词模板

### 通俗版提示词

```
请根据以下项目信息，写一份通俗易懂的产品说明书。

要求：
- 用大白话，不要技术术语
- 像在跟朋友介绍你做的东西
- 让完全不懂技术的人也能看明白这个产品是什么、给谁用、怎么用
- 篇幅适中，不要太长

项目信息：
---
项目名称：{project_name}
核心目标：{core_goal}
目标用户：{target_users}
使用场景：{use_cases}
用户输入：{input_data}
系统输出：{output_result}
核心功能：{core_features}
暂不实现的功能：{non_core_features}
平台形态：{platform_type}
是否需要登录：{need_login}
是否需要支付：{need_payment}
是否需要后台：{need_admin}
数据来源：{data_source}
第一版范围：{mvp_scope}
---
```

### 标准产品版提示词

```
请根据以下项目信息，生成一份标准的产品需求文档（PRD）。

要求包含以下章节：
1. 项目概述
2. 项目目标
3. 目标用户
4. 用户痛点
5. 核心使用场景
6. MVP 定义（第一版做什么，不做什么）
7. 功能模块说明（每个功能详细描述）
8. 页面与流程说明（用户从打开到完成的完整路径）
9. 数据与输入输出说明
10. 技术实现建议（推荐技术栈和架构）
11. 风险与边界（可能遇到的问题和限制）
12. 开发阶段建议（分几期做，每期做什么）

格式要求：
- 使用 Markdown 格式
- 每个章节用 ## 标题
- 重要内容加粗
- 适当使用列表和表格

项目信息：
---
项目名称：{project_name}
核心目标：{core_goal}
目标用户：{target_users}
使用场景：{use_cases}
用户输入：{input_data}
系统输出：{output_result}
核心功能：{core_features}
暂不实现的功能：{non_core_features}
平台形态：{platform_type}
是否需要登录：{need_login}
是否需要支付：{need_payment}
是否需要后台：{need_admin}
数据来源：{data_source}
第一版范围：{mvp_scope}
---
```

### AI 编程版提示词

```
请根据以下项目信息，生成一份专门给 AI 编程工具（如 Claude Code、Cursor、TRAE）阅读的项目规格文档。

格式要求：CLAUDE.md / AGENTS.md 风格，包含以下部分：

## 项目名称
## 项目定位（一句话 + 详细说明）
## 技术栈建议
  - 推荐使用的语言、框架、部署平台
  - 优先考虑纯前端方案（HTML + CSS + JS），除非项目确实需要后端
  - 如果面向中国大陆用户，部署推荐 Cloudflare Pages，不用 Vercel
## 开发原则（给 AI 编程工具的约束）
## UI 设计原则
## 文件结构建议（目录树）
## 功能模块详细说明
## 数据结构设计（JSON 格式）
## 页面清单与路由
## 开发任务分解建议（task01, task02...的大致规划）

项目信息：
---
项目名称：{project_name}
核心目标：{core_goal}
目标用户：{target_users}
使用场景：{use_cases}
用户输入：{input_data}
系统输出：{output_result}
核心功能：{core_features}
暂不实现的功能：{non_core_features}
平台形态：{platform_type}
是否需要登录：{need_login}
是否需要支付：{need_payment}
是否需要后台：{need_admin}
数据来源：{data_source}
第一版范围：{mvp_scope}
---
```

### 提示词中的变量替换

所有 `{xxx}` 变量从 localStorage 中该项目的 clarify_answers 读取。如果某字段为空，该行不显示（不要显示空值）。

---

## 数据存储

设计书内容保存在项目的 `design_doc` 字段：

```json
{
  "design_doc": {
    "popular": "这是通俗版内容...",
    "standard": "# 产品需求文档\n\n## 1. 项目概述...",
    "ai_coding": "# CLAUDE.md\n\n## 项目名称..."
  }
}
```

需要在 js/project.js 确保 updateProject 支持更新 design_doc 字段。

---

## 页面加载逻辑

1. 从 URL 读取 `?id=xxx` 参数
2. 调用 getProject(id) 加载项目
3. 项目不存在 → 错误提示 + 返回工作台
4. 项目没有 clarify_answers → 提示"请先完成需求澄清" + 链接到 clarify.html?id=xxx
5. 已有 design_doc → 预填到对应版本的 textarea 中
6. Tab 切换时保持各版本 textarea 内容不丢失（用 JS 变量暂存）

---

## 简易 Markdown 预览函数

不引入第三方库，用简单正则实现基本渲染：

```javascript
function simpleMarkdownRender(text) {
  // ### 标题 → <h3>
  // ## 标题 → <h2>
  // # 标题 → <h1>
  // **加粗** → <strong>
  // - 列表项 → <li>
  // 1. 有序列表 → <li>
  // ```代码块``` → <pre><code>
  // 空行 → <br>
  // 其他行 → <p>
}
```

不需要完美，能让预览基本可读即可。

---

## 完成标志

- [ ] design.html 能正确加载项目和澄清数据
- [ ] 项目摘要卡能展开/收起
- [ ] 三个 tab 切换正常，内容不丢失
- [ ] 三个版本的提示词都能正确生成（变量替换正确）
- [ ] 复制按钮正常工作
- [ ] 6 个 AI 平台链接正常
- [ ] textarea 可粘贴内容
- [ ] 预览区实时同步渲染
- [ ] 保存功能正确写入 localStorage
- [ ] 导出 Markdown 文件下载正常
- [ ] 至少填一个版本才能点「继续生成任务拆解」
- [ ] 再次打开页面时已保存内容预填
- [ ] 移动端布局正常
- [ ] git commit -m "feat: 设计书生成页完整实现" 并 push

## ⚠️ 禁止操作

- 不要调用任何 AI API
- 不要引入任何第三方 Markdown 渲染库
- 不要引入任何框架
- 不要创建后端
