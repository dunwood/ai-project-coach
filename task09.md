# Task 09: 注册码系统（一码一机）

## 背景

项目要收费，需要用注册码控制访问。当前没有注册码系统。要求：
- 一个注册码只能在一台设备上使用，防止转发给别人
- 不使用传统数据库
- 利用 Cloudflare 现有基础设施

## 技术方案

使用 **Cloudflare Pages Functions**（本质是 Cloudflare Workers）+ **KV 存储**：

- Pages Functions 放在项目的 `functions/` 目录，部署时 Cloudflare 自动识别
- KV 是 Cloudflare 自带的键值存储，免费额度够用（每天 10 万次读、1000 次写）
- 前端生成设备指纹（浏览器特征组合的哈希值）
- 用户输入注册码 → 前端发请求到 Pages Function → Function 查 KV → 返回结果

## 流程

```
用户打开网站
  ↓
检查 localStorage 是否有已激活的注册码
  ↓ 有 → 检查是否过期 → 没过期 → 正常使用
  ↓ 没有或已过期
显示注册码输入弹窗
  ↓
用户输入注册码
  ↓
前端生成设备指纹
  ↓
发送请求到 /api/verify-code（Pages Function）
  ↓
Function 查 KV：
  - 这个码存在吗？→ 不存在 → 返回"无效注册码"
  - 这个码用过了吗？→ 没用过 → 绑定设备指纹，写入 KV，返回"激活成功"
  - 用过了，设备指纹匹配吗？→ 匹配 → 返回"验证通过"
  - 用过了，设备不匹配 → 返回"此码已在其他设备使用"
  ↓
前端收到结果 → 成功则保存到 localStorage，失败则显示错误提示
```

---

## 第一步：创建 KV 命名空间

这一步需要在 Cloudflare Dashboard 手动操作（或用 wrangler 命令）。

用 wrangler 命令（在项目目录的终端中执行）：

```bash
npx wrangler kv namespace create "ACCESS_CODES"
```

执行后会返回一个 namespace ID，记下来。

然后在项目根目录创建 `wrangler.toml`（如果已有则修改）：

```toml
name = "ai-project-coach"
compatibility_date = "2026-04-03"

[[kv_namespaces]]
binding = "ACCESS_CODES"
id = "这里填上面返回的namespace_id"
```

注意：如果项目是通过 Cloudflare Pages 连接 Git 部署的，KV 绑定需要在 Cloudflare Dashboard 的 Pages 项目设置中配置：
Settings → Bindings → Add → KV namespace → 变量名填 `ACCESS_CODES` → 选择刚创建的 namespace。

---

## 第二步：初始化注册码数据

创建一个脚本 `scripts/init-codes.js`，用来批量写入注册码到 KV：

```javascript
// scripts/init-codes.js
// 用法：在终端运行 node scripts/init-codes.js
// 需要先安装 wrangler 并登录

const codes = [
  // 格式：{ code: "注册码", plan: "basic/pro", days: 有效天数 }
  // 先生成 20 个测试码
];

// 生成注册码的函数
function generateCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // 去掉容易混淆的 0OI1
  const segments = [];
  for (let s = 0; s < 4; s++) {
    let seg = '';
    for (let i = 0; i < 5; i++) {
      seg += chars[Math.floor(Math.random() * chars.length)];
    }
    segments.push(seg);
  }
  return segments.join('-');
}

// 生成 20 个码并打印
for (let i = 0; i < 20; i++) {
  const code = generateCode();
  console.log(code);
}
```

生成码之后，用 wrangler 命令写入 KV：

```bash
npx wrangler kv key put --namespace-id=你的namespace_id "CODE:XXXXX-XXXXX-XXXXX-XXXXX" '{"status":"unused","plan":"basic","days":365}'
```

或者创建一个批量写入脚本。

**但更简单的方案是：让 Pages Function 在验证时直接读取一个硬编码的有效码列表，KV 只存储"哪个码绑了哪个设备"。** 这样不需要预先把码写入 KV。

---

## 第三步：创建 Pages Function

创建文件 `functions/api/verify-code.js`：

```javascript
// Cloudflare Pages Function
// 路径：/api/verify-code（POST）

// 有效注册码列表（硬编码在服务端，用户看不到）
const VALID_CODES = [
  // 保留旧的三个码（向后兼容）
  "ZHY26-AICPJ-7K9M2-XQ8LT",
  "ZHY26-AICPJ-V8D4N-P3WQY",
  "ZHY26-AICPJ-M7R2K-T9LXP",
  // 后续在这里添加新码...
];

export async function onRequestPost(context) {
  const { request, env } = context;
  
  // CORS 头
  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  };

  try {
    const body = await request.json();
    const { code, fingerprint } = body;

    if (!code || !fingerprint) {
      return new Response(JSON.stringify({
        success: false,
        error: "请输入注册码"
      }), { headers, status: 400 });
    }

    // 标准化注册码：大写、去空格
    const normalizedCode = code.trim().toUpperCase();

    // 检查是否是有效码
    if (!VALID_CODES.includes(normalizedCode)) {
      return new Response(JSON.stringify({
        success: false,
        error: "无效的注册码"
      }), { headers, status: 401 });
    }

    // 查 KV：这个码是否已绑定设备
    const kvKey = `BIND:${normalizedCode}`;
    const existing = await env.ACCESS_CODES.get(kvKey);

    if (existing) {
      const data = JSON.parse(existing);
      
      // 已绑定，检查设备指纹是否匹配
      if (data.fingerprint === fingerprint) {
        // 同一设备，验证通过
        return new Response(JSON.stringify({
          success: true,
          message: "验证通过",
          activated_at: data.activated_at,
          expires_at: data.expires_at
        }), { headers });
      } else {
        // 不同设备，拒绝
        return new Response(JSON.stringify({
          success: false,
          error: "此注册码已在其他设备上激活，无法重复使用"
        }), { headers, status: 403 });
      }
    }

    // 未绑定，首次激活
    const now = new Date();
    const expiresAt = new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000); // 1年有效期
    
    const bindData = {
      fingerprint: fingerprint,
      activated_at: now.toISOString(),
      expires_at: expiresAt.toISOString(),
      user_agent: request.headers.get("User-Agent") || "unknown"
    };

    // 写入 KV，过期时间设为1年（KV 支持自动过期）
    await env.ACCESS_CODES.put(kvKey, JSON.stringify(bindData), {
      expirationTtl: 365 * 24 * 60 * 60 // 秒
    });

    return new Response(JSON.stringify({
      success: true,
      message: "激活成功",
      activated_at: bindData.activated_at,
      expires_at: bindData.expires_at
    }), { headers });

  } catch (err) {
    return new Response(JSON.stringify({
      success: false,
      error: "服务器错误，请稍后再试"
    }), { headers, status: 500 });
  }
}

// 处理 OPTIONS 预检请求（CORS）
export async function onRequestOptions() {
  return new Response(null, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    }
  });
}
```

---

## 第四步：前端设备指纹生成

创建 `js/fingerprint.js`：

```javascript
// 生成设备指纹
// 不需要非常精确，只要同一设备同一浏览器生成的值一致即可
// 用多个浏览器特征组合后做简单哈希

function generateFingerprint() {
  const components = [
    navigator.userAgent,
    navigator.language,
    screen.width + 'x' + screen.height,
    screen.colorDepth,
    new Date().getTimezoneOffset(),
    navigator.hardwareConcurrency || 'unknown',
    navigator.platform || 'unknown'
  ];
  
  const raw = components.join('|');
  
  // 简单哈希函数（djb2）
  let hash = 5381;
  for (let i = 0; i < raw.length; i++) {
    hash = ((hash << 5) + hash) + raw.charCodeAt(i);
    hash = hash & hash; // 转为32位整数
  }
  
  return 'FP-' + Math.abs(hash).toString(36).toUpperCase();
}
```

---

## 第五步：前端注册码验证逻辑

创建 `js/access.js`：

```javascript
// 注册码验证和访问控制

const ACCESS_STORAGE_KEY = 'ai_coach_access';

// 检查是否已激活
function isActivated() {
  const data = localStorage.getItem(ACCESS_STORAGE_KEY);
  if (!data) return false;
  
  try {
    const parsed = JSON.parse(data);
    // 检查是否过期
    if (parsed.expires_at && new Date(parsed.expires_at) < new Date()) {
      localStorage.removeItem(ACCESS_STORAGE_KEY);
      return false;
    }
    return parsed.activated === true;
  } catch {
    return false;
  }
}

// 显示注册码输入弹窗
function showAccessDialog() {
  // 创建遮罩和弹窗（样式同法律声明弹窗风格）
  // 弹窗内容：
  //   标题："请输入注册码"
  //   说明："输入注册码以激活使用权限。每个注册码仅限一台设备使用。"
  //   输入框：placeholder "XXXXX-XXXXX-XXXXX-XXXXX"
  //   按钮：「激活」
  //   错误提示区域（默认隐藏）
  //   底部小字："如何获取注册码？请联系哲学园"
}

// 验证注册码（调用 Pages Function）
async function verifyCode(code) {
  const fingerprint = generateFingerprint();
  
  try {
    const response = await fetch('/api/verify-code', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code: code, fingerprint: fingerprint })
    });
    
    const result = await response.json();
    
    if (result.success) {
      // 保存激活状态到 localStorage
      localStorage.setItem(ACCESS_STORAGE_KEY, JSON.stringify({
        activated: true,
        code: code.trim().toUpperCase(),
        activated_at: result.activated_at,
        expires_at: result.expires_at
      }));
      return { success: true };
    } else {
      return { success: false, error: result.error };
    }
  } catch (err) {
    return { success: false, error: '网络错误，请检查网络后重试' };
  }
}

// 页面加载时检查访问权限
function checkAccess() {
  // 首页（index.html）允许免登录访问，展示产品介绍
  // 其他页面需要激活才能访问
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  const publicPages = ['index.html', '', 'routes.html']; // 免登录页面
  
  if (publicPages.includes(currentPage)) {
    return; // 公开页面，不检查
  }
  
  if (!isActivated()) {
    showAccessDialog();
  }
}

// 页面加载时自动检查
document.addEventListener('DOMContentLoaded', checkAccess);
```

---

## 第六步：集成到所有页面

在以下页面的 `<head>` 或 `<body>` 底部引入（在 nav.js 之后）：

```html
<script src="js/fingerprint.js"></script>
<script src="js/access.js"></script>
```

需要引入的页面（非公开页面）：
- idea.html
- clarify.html
- design.html
- tasks.html
- workspace.html

**不需要引入的页面（公开页面）**：
- index.html（首页可以自由浏览，看到产品介绍后想使用才需要注册码）

### 首页修改

在 index.html 的「开始做项目」按钮点击逻辑中，跳转前检查是否已激活：

```javascript
// 点击"开始做项目"按钮时
function onStartProject() {
  if (isActivated()) {
    window.location.href = 'idea.html';
  } else {
    showAccessDialog(); // 弹出注册码输入
    // 激活成功后自动跳转到 idea.html
  }
}
```

首页需要引入 fingerprint.js 和 access.js，但 checkAccess() 不要在首页自动执行。改为只在按钮点击时触发。

---

## 第七步：注册码输入弹窗样式

弹窗视觉要求（同法律声明弹窗风格）：

- 全屏半透明遮罩（不可关闭，必须输入码或刷新页面）
- 居中深色面板
- 标题："请输入注册码"
- 说明文字："输入注册码以激活使用权限。每个注册码仅限一台设备使用。"
- 输入框：大号，等宽字体，placeholder "XXXXX-XXXXX-XXXXX-XXXXX"
- 输入时自动格式化：每5个字符自动加短横线
- 「激活」按钮（btn-primary）
- 错误提示（红色文字，默认隐藏，验证失败时显示）
- 加载状态：点击激活后按钮显示"验证中..."，禁用重复点击
- 底部小字："如何获取注册码？请关注公众号「哲学园」或联系微信 iwish89"

---

## 第八步：删除旧的注册码逻辑

如果之前的代码中有硬编码在前端的注册码验证逻辑（如旧项目留下的 access-codes 相关代码），全部删除。新系统的验证完全通过 Pages Function 在服务端完成，前端看不到有效码列表。

---

## 注意事项

### Cloudflare Pages Functions 目录结构

```
ai-project-coach/
├── functions/
│   └── api/
│       └── verify-code.js    ← Pages Function，自动映射为 /api/verify-code
├── index.html
├── js/
│   ├── fingerprint.js
│   ├── access.js
│   └── ...
└── ...
```

`functions/` 目录下的文件会被 Cloudflare Pages 自动识别为 Functions，不需要额外配置路由。

### KV 绑定配置

在 Cloudflare Dashboard 中：
1. Pages 项目 → Settings → Bindings
2. Add binding → KV namespace
3. Variable name：`ACCESS_CODES`
4. KV namespace：选择之前创建的 namespace

这一步必须在 Dashboard 中手动完成，不能通过代码自动配置。

### 本地开发调试

本地双击 index.html 时 `/api/verify-code` 不可用（因为没有 Function 运行环境）。
可以在 access.js 中加一个开发模式判断：

```javascript
// 如果是本地文件访问（file:// 协议），跳过验证
if (window.location.protocol === 'file:') {
  console.log('[DEV] 本地模式，跳过注册码验证');
  return;
}
```

---

## 完成标志

- [ ] functions/api/verify-code.js 已创建
- [ ] js/fingerprint.js 已创建
- [ ] js/access.js 已创建
- [ ] 注册码输入弹窗样式正确（深色面板，居中）
- [ ] 输入时自动格式化（每5字符加短横线）
- [ ] 首页可自由浏览，点击"开始做项目"时才要求注册码
- [ ] 非公开页面（idea/clarify/design/tasks/workspace）自动弹出注册码输入
- [ ] 验证成功后保存到 localStorage，刷新不再要求
- [ ] 本地 file:// 模式跳过验证
- [ ] 旧的前端硬编码注册码逻辑已删除
- [ ] git commit -m "feat: 注册码系统（一码一机，Cloudflare KV）" 并 push

## ⚠️ 部署后手动步骤（不要忘记）

1. 在 Cloudflare Dashboard 创建 KV namespace：
   Workers & Pages → KV → Create namespace → 名称 "ai-coach-access-codes"

2. 在 Pages 项目中绑定 KV：
   ai-project-coach → Settings → Bindings → Add → KV namespace
   Variable name: ACCESS_CODES
   Namespace: ai-coach-access-codes

3. 部署后测试：用旧的三个码之一测试激活流程

## ⚠️ 禁止操作

- 不要引入任何框架
- 不要使用传统数据库
- 不要把有效码列表放在前端代码中（必须放在 Functions 服务端）
