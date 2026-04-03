// 注册码验证和访问控制

// ===== 激活状态管理 =====

function isActivated() {
  if (window.location.protocol === 'file:') return true;
  return localStorage.getItem('apc_activated') === 'true';
}

function activateDevice(codeHash) {
  localStorage.setItem('apc_activated', 'true');
  localStorage.setItem('apc_code_hash', codeHash);
  localStorage.setItem('apc_activated_at', new Date().toISOString());
}

function markCodeUsed(codeHash) {
  var usedCodes = JSON.parse(localStorage.getItem('apc_used_codes') || '[]');
  if (usedCodes.indexOf(codeHash) === -1) {
    usedCodes.push(codeHash);
    localStorage.setItem('apc_used_codes', JSON.stringify(usedCodes));
  }
}

function isCodeUsedLocally(codeHash) {
  var usedCodes = JSON.parse(localStorage.getItem('apc_used_codes') || '[]');
  return usedCodes.indexOf(codeHash) !== -1;
}

// ===== SHA-256 验证 =====

// 前5个测试码的哈希（本地验证，不限设备）
var FREE_CODE_HASHES = new Set([
  '25ff8ea00a326de6064855cb8fb4de21c00529b8242abda342bddc39c13dad59',
  'a768a24f8ef3ea2fa1e0af08656b561f61a814f2a72c7b0cfa8df4bc7ad0745f',
  'fd645d8c57dfd5d6a4926cd56c904d51fc47cba2c754d1769fac0ef0dc10b55b',
  '90fe4532e45e39551b417477adbef92b2249bbde837bae36685a467d254351d4',
  'b992e5764a6a91a057204d40da0e198de5239921570217c33b96f808f3ffe9de'
]);

function sha256(message) {
  var msgBuffer = new TextEncoder().encode(message.toUpperCase().trim());
  return crypto.subtle.digest('SHA-256', msgBuffer).then(function (hashBuffer) {
    var hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(function (b) { return b.toString(16).padStart(2, '0'); }).join('');
  });
}

function verifyCode(inputCode) {
  return sha256(inputCode).then(function (hash) {
    // 先检查是否是有效码
    if (!window.CODE_HASHES || !window.CODE_HASHES.has(hash)) {
      return { success: false, message: '注册码无效，请检查后重新输入' };
    }

    // 前5个测试码：本地验证，不限设备
    if (FREE_CODE_HASHES.has(hash)) {
      activateDevice(hash);
      return { success: true, message: '激活成功！欢迎使用 AI 项目教练' };
    }

    // 其余码：调用服务端 KV 验证（一机一码）
    var fingerprint = typeof generateFingerprint === 'function' ? generateFingerprint() : navigator.userAgent;
    return fetch('/api/verify-code', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ codeHash: hash, fingerprint: fingerprint })
    }).then(function (response) {
      return response.json();
    }).then(function (result) {
      if (result.success) {
        activateDevice(hash);
      }
      return result;
    }).catch(function () {
      return { success: false, message: '网络错误，请检查网络后重试' };
    });
  });
}

// ===== 弹窗 UI =====

function showAccessDialog(onSuccess) {
  if (document.getElementById('access-overlay')) return;

  var overlay = document.createElement('div');
  overlay.id = 'access-overlay';
  overlay.style.cssText = [
    'position:fixed', 'inset:0', 'background:rgba(0,0,0,0.85)',
    'z-index:9000', 'display:flex', 'align-items:center',
    'justify-content:center', 'padding:20px'
  ].join(';');

  overlay.innerHTML = [
    '<div id="access-modal" style="',
      'background:var(--bg-secondary);',
      'border:1px solid rgba(0,229,255,0.25);',
      'border-radius:16px;',
      'padding:36px 32px;',
      'max-width:440px;width:100%;',
      'box-shadow:0 8px 48px rgba(0,229,255,0.1);',
      'animation:accessModalIn 0.3s cubic-bezier(0.34,1.56,0.64,1) both;',
    '">',
      '<div style="font-size:32px;text-align:center;margin-bottom:16px;">🔑</div>',
      '<h2 style="font-size:20px;font-weight:800;text-align:center;margin-bottom:10px;">请输入注册码</h2>',
      '<p style="font-size:14px;color:var(--text-secondary);text-align:center;line-height:1.7;margin-bottom:24px;">',
        '输入注册码以激活使用权限。<br>每个注册码仅限一台设备使用。',
      '</p>',
      '<input id="access-code-input" type="text" maxlength="18"',
        ' placeholder="APC-XXXX-XXXX-XXXX"',
        ' autocomplete="off" spellcheck="false"',
        ' style="',
          'width:100%;box-sizing:border-box;',
          'background:var(--bg-primary);',
          'border:1px solid var(--border);',
          'border-radius:8px;',
          'padding:12px 16px;',
          'font-family:var(--font-code);',
          'font-size:16px;',
          'color:var(--text-primary);',
          'text-align:center;',
          'letter-spacing:2px;',
          'margin-bottom:8px;',
          'outline:none;',
          'transition:border-color 0.2s;',
        '">',
      '<div id="access-error" style="',
        'font-size:13px;color:var(--danger);',
        'text-align:center;min-height:20px;',
        'margin-bottom:16px;line-height:1.5;',
      '"></div>',
      '<button id="access-submit-btn" style="',
        'width:100%;padding:13px;',
        'background:var(--accent);',
        'color:#0a0a0f;',
        'border:none;border-radius:8px;',
        'font-size:15px;font-weight:700;',
        'font-family:var(--font-main);',
        'cursor:pointer;',
        'transition:opacity 0.2s;',
      '">激活</button>',
      '<p style="font-size:12px;color:var(--text-secondary);text-align:center;margin-top:20px;line-height:1.7;">',
        '如何获取注册码？请关注公众号「哲学园」或联系微信 iwish89',
      '</p>',
    '</div>'
  ].join('');

  // 注入动画
  if (!document.getElementById('access-modal-style')) {
    var style = document.createElement('style');
    style.id = 'access-modal-style';
    style.textContent = [
      '@keyframes accessModalIn {',
        'from { opacity:0; transform:scale(0.85); }',
        'to   { opacity:1; transform:scale(1); }',
      '}',
      '#access-code-input:focus { border-color:var(--accent); }',
      '#access-submit-btn:hover { opacity:0.85; }',
      '#access-submit-btn:disabled { opacity:0.5; cursor:not-allowed; }'
    ].join('');
    document.head.appendChild(style);
  }

  document.body.appendChild(overlay);

  var input = document.getElementById('access-code-input');
  var btn = document.getElementById('access-submit-btn');
  var errorEl = document.getElementById('access-error');

  // 自动格式化：APC-XXXX-XXXX-XXXX
  input.addEventListener('input', function () {
    var val = input.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
    var result = '';
    if (val.length <= 3) {
      result = val;
    } else if (val.length <= 7) {
      result = val.slice(0, 3) + '-' + val.slice(3);
    } else if (val.length <= 11) {
      result = val.slice(0, 3) + '-' + val.slice(3, 7) + '-' + val.slice(7);
    } else {
      result = val.slice(0, 3) + '-' + val.slice(3, 7) + '-' + val.slice(7, 11) + '-' + val.slice(11, 15);
    }
    input.value = result;
    errorEl.textContent = '';
  });

  input.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') btn.click();
  });

  btn.addEventListener('click', function () {
    var code = input.value.trim();
    if (!code) {
      errorEl.textContent = '请输入注册码';
      return;
    }
    btn.textContent = '验证中...';
    btn.disabled = true;
    errorEl.textContent = '';

    verifyCode(code).then(function (result) {
      if (result.success) {
        btn.textContent = '激活成功 ✓';
        setTimeout(function () {
          document.body.removeChild(overlay);
          if (typeof onSuccess === 'function') onSuccess();
        }, 600);
      } else {
        errorEl.textContent = result.message || '验证失败，请重试';
        btn.textContent = '激活';
        btn.disabled = false;
      }
    });
  });

  input.focus();
}

// ===== 页面访问控制 =====

function checkAccess() {
  if (window.location.protocol === 'file:') {
    console.log('[DEV] 本地模式，跳过注册码验证');
    return;
  }

  var currentPage = window.location.pathname.split('/').pop() || 'index.html';
  var publicPages = ['index.html', '', 'routes.html'];

  if (publicPages.indexOf(currentPage) !== -1) return;

  if (!isActivated()) {
    showAccessDialog(function () {
      window.location.reload();
    });
  }
}

document.addEventListener('DOMContentLoaded', checkAccess);
