// 法律声明弹窗逻辑

var LEGAL_KEY = 'legal_accepted';

var legalHTML = `
<div class="legal-overlay" id="legal-overlay">
  <div class="legal-modal">
    <div class="legal-header">
      <h2>用户服务与免责声明</h2>
      <p>请在使用前完整阅读以下内容。</p>
    </div>
    <div class="legal-body">
      <p>欢迎访问"AI 项目教练"（builder.zhexueyuan.com）。本站致力于帮助零基础用户通过 AI 工具将软件想法变成可执行的项目方案，旨在为用户提供项目规划参考与学习支持。</p>

      <h3>一、声明性质</h3>
      <p>本站提供的内容和工具均为辅助性的项目规划参考工具，主要用于帮助用户梳理想法、生成设计文档与任务清单。本站并非商业性培训机构，亦不构成电信业务经营服务。</p>

      <h3>二、免责声明</h3>

      <h3>1. 内容仅供参考</h3>
      <p>本站生成的设计书、任务清单、技术建议等内容，均由 AI 模型辅助生成，仅供学习、研究与个人实践参考。我们不对相关内容的适用性、准确性、完整性或运行结果作出保证。</p>

      <h3>2. 使用风险自负</h3>
      <p>AI 模型具有不确定性，其生成内容可能存在错误、遗漏、偏差或不符合特定场景要求。用户在实际使用本站内容或 AI 生成结果时，应自行审慎判断并独立核实其真实性、合法性、安全性与适用性。因使用本站内容而产生的技术故障、数据损失、项目失败、第三方争议或其他后果，本站不承担责任。</p>

      <h3>3. 外部服务风险</h3>
      <p>本站使用第三方 AI 服务（如 DeepSeek）。相关服务的可用性、稳定性、访问速度、政策调整与功能变化，不受本站控制。若因网络环境、第三方平台限制、服务中断或其他外部原因导致使用异常，本站将尽力维护与更新，但不承诺持续可用。</p>

      <h3>4. 不构成专业建议</h3>
      <p>本站内容不构成法律、财务、经营、投资、工程、安全或其他专业建议。</p>

      <h3>5. 数据存储说明</h3>
      <p>本站所有数据均存储在用户本地浏览器中（localStorage），不会上传至任何服务器。清除浏览器数据将导致项目记录丢失，请用户自行做好数据备份。</p>

      <p style="margin-top: 16px; font-size: 13px;">Copyright © 哲学园</p>
    </div>
    <div class="legal-footer">
      <button class="btn-primary" id="legal-accept-btn">我已阅读并同意</button>
    </div>
  </div>
</div>
`;

function openLegalModal() {
  if (document.getElementById('legal-overlay')) return;
  var div = document.createElement('div');
  div.innerHTML = legalHTML;
  document.body.appendChild(div.firstElementChild);
  document.getElementById('legal-accept-btn').addEventListener('click', closeLegalModal);
}

function closeLegalModal() {
  var overlay = document.getElementById('legal-overlay');
  if (overlay) {
    overlay.remove();
    localStorage.setItem(LEGAL_KEY, 'true');
  }
}

// 首次访问自动弹出
(function () {
  if (!localStorage.getItem(LEGAL_KEY)) {
    // 等 nav.js 执行完毕再弹出，确保 Footer 按钮已绑定
    window.addEventListener('DOMContentLoaded', function () {
      setTimeout(openLegalModal, 300);
    });
  }
})();
