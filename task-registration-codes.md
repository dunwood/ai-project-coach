# Task: 注册码系统完整实现（1000个码）

## 背景

之前添加注册码时因为 Root directory 没配置导致部署事故，现在已修复。当前状态：
- Cloudflare Pages Root directory 已设置为 `ai-project-coach`
- functions/ 目录已被删除
- js/access.js 已改为临时本地验证（跳过了注册码检查）
- 网站已恢复正常运行

现在需要：重新实现注册码功能，生成 1000 个唯一注册码。

## 技术方案：客户端哈希验证

**不使用 Cloudflare Functions 或 KV**，避免再次出现部署问题。采用纯前端方案：

1. 生成 1000 个格式统一的注册码明文
2. 对每个码做 SHA-256 哈希
3. 把 1000 个哈希值存到 `data/codes.js` 文件中
4. 用户输入注册码时，前端对输入做同样的哈希，比对是否在列表中
5. 验证通过后，将该哈希标记为"已使用"存入 localStorage
6. 同时在 localStorage 中记录设备已激活，后续访问不再弹注册码弹窗

**安全性说明**：这个方案足够用了。注册码的哈希值公开在 JS 里，但反推原始码的成本极高（SHA-256 不可逆）。唯一弱点是用户可以清 localStorage 重复使用同一个码——对于你的场景（哲学园粉丝访问）完全可以接受。

---

## 第一步：生成 1000 个注册码

### 注册码格式

```
APC-XXXX-XXXX-XXXX
```

其中：
- APC = AI Project Coach 前缀
- X = 大写字母或数字（不含容易混淆的 0/O/1/I/L）
- 可用字符：`ABCDEFGHJKMNPQRSTUVWXYZ23456789`
- 示例：`APC-K7M3-R9PN-V4HJ`

### 生成脚本

在项目根目录创建 `scripts/generate-codes.js`（这个文件不会部署，仅本地使用）：

```javascript
// scripts/generate-codes.js
// 用 Node.js 运行：node scripts/generate-codes.js

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const CHARS = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
const CODE_COUNT = 1000;

function generateCode() {
    let parts = ['APC'];
    for (let p = 0; p < 3; p++) {
        let segment = '';
        for (let i = 0; i < 4; i++) {
            const randomIndex = crypto.randomInt(0, CHARS.length);
            segment += CHARS[randomIndex];
        }
        parts.push(segment);
    }
    return parts.join('-');
}

function sha256(str) {
    return crypto.createHash('sha256').update(str.toUpperCase().trim()).digest('hex');
}

// 生成唯一的码
const codesSet = new Set();
while (codesSet.size < CODE_COUNT) {
    codesSet.add(generateCode());
}
const codes = Array.from(codesSet);

// 生成哈希列表（用于前端验证）
const hashes = codes.map(code => sha256(code));

// 输出 1：明文注册码列表（给你自己保管，不要放到代码仓库！）
const codesText = codes.join('\n');
fs.writeFileSync(
    path.join(__dirname, '..', 'registration-codes.txt'),
    codesText,
    'utf-8'
);

// 输出 2：哈希列表 JS 文件（放到 data/ 目录，会部署到线上）
const hashesJS = `// 自动生成，勿手动编辑
// 共 ${hashes.length} 个注册码哈希
window.CODE_HASHES = new Set(${JSON.stringify(hashes)});
`;
fs.writeFileSync(
    path.join(__dirname, '..', 'data', 'codes.js'),
    hashesJS,
    'utf-8'
);

console.log(`✅ 已生成 ${codes.length} 个注册码`);
console.log(`📄 明文码保存到: registration-codes.txt（请妥善保管，不要提交到 Git）`);
console.log(`📄 哈希文件保存到: data/codes.js（将部署到线上）`);
console.log(`\n前 5 个注册码示例：`);
codes.slice(0, 5).forEach(c => console.log(`  ${c}`));
```

### 运行生成脚本

```bash
mkdir -p scripts
# （写入上面的代码到 scripts/generate-codes.js）
node scripts/generate-codes.js
```

### 确保明文码不被提交

在 `.gitignore` 中添加：

```
registration-codes.txt
```

---

## 第二步：修改 index.html

在 `<head>` 中引入 codes.js（在 access.js 之前）：

```html
<script src="data/codes.js"></script>
```

注意：确保所有需要注册码验证的页面都引入了这个文件。检查以下页面的 `<head>`，如果有引入 `js/access.js` 的，在它前面加上 `data/codes.js`：
- index.html
- idea.html
- clarify.html
- design.html
- tasks.html
- workspace.html

---

## 第三步：修改 js/access.js

重写验证逻辑，替换掉之前的临时本地验证：

### 核心逻辑

```javascript
// SHA-256 哈希函数（浏览器原生）
async function sha256(message) {
    const msgBuffer = new TextEncoder().encode(message.toUpperCase().trim());
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// 检查设备是否已激活
function isDeviceActivated() {
    return localStorage.getItem('apc_activated') === 'true';
}

// 激活设备
function activateDevice(codeHash) {
    localStorage.setItem('apc_activated', 'true');
    localStorage.setItem('apc_code_hash', codeHash);
    localStorage.setItem('apc_activated_at', new Date().toISOString());
}

// 标记码为已使用（本地记录）
function markCodeUsed(codeHash) {
    const usedCodes = JSON.parse(localStorage.getItem('apc_used_codes') || '[]');
    if (!usedCodes.includes(codeHash)) {
        usedCodes.push(codeHash);
        localStorage.setItem('apc_used_codes', JSON.stringify(usedCodes));
    }
}

// 检查码是否已被本地标记为已使用
function isCodeUsedLocally(codeHash) {
    const usedCodes = JSON.parse(localStorage.getItem('apc_used_codes') || '[]');
    return usedCodes.includes(codeHash);
}

// 验证注册码
async function verifyCode(inputCode) {
    const hash = await sha256(inputCode);
    
    // 检查是否是有效码
    if (!window.CODE_HASHES || !window.CODE_HASHES.has(hash)) {
        return { success: false, message: '注册码无效，请检查后重新输入' };
    }
    
    // 检查是否已被使用
    if (isCodeUsedLocally(hash)) {
        // 如果是同一设备之前用的码，允许重新激活
        const myCodeHash = localStorage.getItem('apc_code_hash');
        if (myCodeHash === hash) {
            activateDevice(hash);
            return { success: true, message: '欢迎回来！设备已重新激活' };
        }
        return { success: false, message: '此注册码已被使用' };
    }
    
    // 激活成功
    activateDevice(hash);
    markCodeUsed(hash);
    return { success: true, message: '激活成功！欢迎使用 AI 项目教练' };
}
```

### 页面加载时的验证逻辑

```javascript
// 页面加载时检查
document.addEventListener('DOMContentLoaded', function() {
    if (isDeviceActivated()) {
        // 已激活，正常显示页面
        return;
    }
    
    // 未激活，显示注册码弹窗
    showAccessModal();
});
```

### 弹窗 UI

保留现有弹窗的 HTML 和 CSS 结构，只替换验证逻辑。弹窗中的"验证"按钮点击后调用 `verifyCode(inputValue)`，根据返回结果显示成功/失败提示。

**重要**：仔细阅读现有的 `js/access.js` 代码，保留弹窗 UI 部分，只替换验证相关的函数。不要重写整个文件，只改验证逻辑。

---

## 第四步：提交和推送

```bash
# 确认 registration-codes.txt 不在 git 跟踪中
git status

# 应该看到：
# - data/codes.js（新增，哈希文件）
# - js/access.js（修改，新验证逻辑）
# - scripts/generate-codes.js（新增，生成脚本）
# - .gitignore（修改，排除明文码）
# 不应该看到 registration-codes.txt

git add -A
git commit -m "feat: 注册码系统完整实现（1000个码，SHA-256哈希验证）"
git push
```

---

## 第五步：验证

推送后等 2 分钟，然后：

1. 打开 https://ai-project-coach.pages.dev
2. 应该看到注册码弹窗
3. 用 registration-codes.txt 中的第一个码测试
4. 输入后应该显示"激活成功"
5. 关闭弹窗后正常使用网站
6. 刷新页面，不应该再弹注册码窗口（已激活）

用 curl 测试 CSS 仍然正常：
```bash
curl -s -o /dev/null -w "%{http_code}" https://ai-project-coach.pages.dev/css/style.css
```

---

## 完成后告诉我

1. 生成的 registration-codes.txt 前 5 个码（我来帮你测试）
2. 线上是否正常弹出注册码弹窗
3. CSS 是否正常加载

---

## ⚠️ 注意事项

- **绝对不要**创建 functions/ 目录
- **绝对不要**创建 wrangler.toml / wrangler.jsonc / wrangler.json
- **绝对不要**运行 `npx wrangler` 任何命令
- registration-codes.txt **绝对不要**提交到 Git
- 只通过 git push 触发自动部署
