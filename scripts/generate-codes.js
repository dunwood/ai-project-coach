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
