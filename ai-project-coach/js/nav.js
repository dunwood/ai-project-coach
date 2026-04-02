// 动态插入顶部导航栏和底部 Footer

(function () {
  // 插入导航栏
  var navMount = document.getElementById('nav-mount');
  if (navMount) {
    navMount.innerHTML = `
      <nav>
        <div class="nav-inner">
          <a href="index.html" class="nav-logo">AI 项目教练</a>
          <div class="nav-links">
            <a href="workspace.html">工作台</a>
          </div>
        </div>
      </nav>
    `;
  }

  // 插入 Footer
  var footerMount = document.getElementById('footer-mount');
  if (footerMount) {
    footerMount.innerHTML = `
      <footer>
        <div class="footer-inner">
          <span class="footer-text">AI 项目教练 v1.0 · 哲学园出品 · 2026 · Copyright &copy;</span>
          <button class="footer-legal" id="open-legal-btn">用户服务与免责声明</button>
        </div>
      </footer>
    `;

    // 绑定 Footer 中的法律声明链接
    var openBtn = document.getElementById('open-legal-btn');
    if (openBtn) {
      openBtn.addEventListener('click', function () {
        if (typeof openLegalModal === 'function') {
          openLegalModal();
        }
      });
    }
  }
})();
