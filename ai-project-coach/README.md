# AI 项目教练

面向零基础用户的 Web App，帮用户把模糊的软件想法一步步变成可执行的项目设计书和任务清单。

## 访问地址

[builder.zhexueyuan.com](https://builder.zhexueyuan.com)

## 功能

- **需求澄清**：AI 像项目经理一样帮你梳理需求，把模糊想法变成清晰定义
- **生成设计书**：自动输出通俗版、标准产品版、AI 编程版三种设计书
- **任务拆解**：生成分阶段任务清单和开发 prompt，直接交给 AI 编程工具执行

## 技术栈

- 纯 HTML + CSS + JavaScript，无框架、无构建工具
- AI 功能通过 DeepSeek API 在前端直接调用
- 数据持久化使用 localStorage
- 部署平台：Cloudflare Pages

## 本地运行

直接双击 `index.html` 在浏览器中打开即可，无需任何构建步骤。

## 文件结构

```
ai-project-coach/
├── index.html        # 首页
├── idea.html         # 想法输入页
├── clarify.html      # AI 需求澄清页
├── design.html       # 设计书生成页
├── tasks.html        # 任务拆解页
├── workspace.html    # 工作台
├── css/style.css     # 全局样式
├── js/
│   ├── nav.js        # 导航组件
│   ├── legal.js      # 法律声明弹窗
│   ├── project.js    # 项目状态管理
│   └── api.js        # DeepSeek API 封装
└── data/examples.js  # 示例项目数据
```

---

哲学园出品 · 2026
