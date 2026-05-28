// shared.js — inject the same nav + footer into every page.
// Pure JS, no React, no fetch. Just call kfaRenderChrome() in <body>.

(function () {
  const parts = decodeURI(location.pathname).split('/').filter(Boolean);
  const mediaIndex = parts.lastIndexOf('media');
  const base = mediaIndex >= 0 ? '../'.repeat(parts.length - mediaIndex - 1) : '';
  const href = (path) => base + path;

  const navHTML = `
    <nav class="kfa-nav" aria-label="primary">
      <div class="kfa-nav__inner">
        <a class="kfa-nav__brand" href="${href('index.html')}">대한과일협회</a>
        <ul class="kfa-nav__list">
          <li><a href="${href('tstc.html')}" data-nav="tstc">TSTC</a></li>
          <li><a href="${href('coordinator.html')}" data-nav="coordinator">과일코디네이터</a></li>
          <li><a href="${href('about.html')}" data-nav="about">협회</a></li>
          <li><a href="${href('esg.html')}" data-nav="esg">ESG</a></li>
          <li><a href="${href('media.html')}" data-nav="media">미디어</a></li>
          <li><a href="${href('notice.html')}" data-nav="notice">알림</a></li>
        </ul>
        <div class="kfa-nav__util">
          <a class="kfa-nav__login" href="${href('member-login.html')}">로그인</a>
        </div>
      </div>
    </nav>
  `;

  const footerHTML = `
    <footer class="kfa-foot">
      <div class="kfa-foot__inner">
        <p class="kfa-foot__lead">대한과일협회 · Korea Fruit Association</p>
        <div class="kfa-foot__cols">
          <div class="kfa-foot__col">
            <h4>탐색</h4>
            <ul>
              <li><a href="${href('tstc.html')}">TSTC</a></li>
              <li><a href="${href('coordinator.html')}">과일코디네이터</a></li>
              <li><a href="${href('esg.html')}">ESG</a></li>
            </ul>
          </div>
          <div class="kfa-foot__col">
            <h4>협회</h4>
            <ul>
              <li><a href="${href('about.html')}">소개</a></li>
              <li><a href="${href('notice.html')}">알림</a></li>
              <li><a href="${href('media.html')}">미디어</a></li>
            </ul>
          </div>
          <div class="kfa-foot__col">
            <h4>회원</h4>
            <ul>
              <li><a href="${href('member-login.html')}">로그인</a></li>
              <li><a href="${href('member-join.html')}">회원가입</a></li>
              <li><a href="${href('member-mypage.html')}">마이페이지</a></li>
            </ul>
          </div>
          <div class="kfa-foot__col">
            <h4>문의</h4>
            <ul>
              <li><a href="#">교육 협의</a></li>
              <li><a href="#">기관 협력</a></li>
              <li><a href="#">언론 문의</a></li>
            </ul>
          </div>
        </div>
        <div class="kfa-foot__rule"></div>
        <div class="kfa-foot__base">
          <div>© 2026 대한과일협회. 고유번호 143-82-74071 · 과일코디네이터 민간자격 2023-001094 · 농림축산식품부</div>
          <div class="kfa-foot__legal">
            <a href="${href('member-join.html')}">회원가입</a>
            <a href="${href('member-login.html')}">로그인</a>
          </div>
        </div>
      </div>
    </footer>
  `;

  function renderChrome() {
    const navMount = document.querySelector('[data-chrome="nav"]');
    const footMount = document.querySelector('[data-chrome="footer"]');
    if (navMount)  navMount.outerHTML  = navHTML;
    if (footMount) footMount.outerHTML = footerHTML;

    // mark active nav item using filename
    const file = location.pathname.split('/').pop().replace('.html','').replace(/^$/, 'index');
    const path = mediaIndex >= 0 || file === 'media' ? 'media' : file;
    const link = document.querySelector(`.kfa-nav__list a[data-nav="${path}"]`);
    if (link) link.classList.add('is-active');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', renderChrome);
  } else {
    renderChrome();
  }
})();
