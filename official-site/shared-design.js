(function () {
  const navHTML = `
    <nav class="kfa-nav" aria-label="primary">
      <div class="kfa-nav__inner">
        <a class="kfa-nav__brand" href="index.html">
          대한과일협회<em>KFA</em>
        </a>
        <ul class="kfa-nav__list">
          <li><a href="index.html" data-nav="index">홈</a></li>
          <li><a href="about.html" data-nav="about">협회</a></li>
          <li><a href="coordinator.html" data-nav="coordinator">과일코디네이터</a></li>
          <li><a href="tstc.html" data-nav="tstc">TSTC</a></li>
          <li><a href="esg.html" data-nav="esg">ESG</a></li>
          <li><a href="portfolio.html" data-nav="portfolio">포트폴리오</a></li>
          <li><a href="media.html" data-nav="media">미디어</a></li>
          <li><a href="notice.html" data-nav="notice">커뮤니티</a></li>
        </ul>
        <div class="kfa-nav__util">
          <a class="kfa-nav__login" href="member-login.html">로그인</a>
        </div>
      </div>
    </nav>
  `;

  const footerHTML = `
    <footer class="kfa-foot">
      <div class="kfa-foot__inner">
        <p class="kfa-foot__brand">대한과일협회<em>KFA</em></p>
        <p class="kfa-foot__tagline">사람과 과일 사이의 감각을 잇습니다.</p>

        <div class="kfa-foot__cols">
          <div class="kfa-foot__col">
            <h4>바로가기</h4>
            <ul>
              <li><a href="about.html">협회 소개</a></li>
              <li><a href="coordinator.html">과일코디네이터</a></li>
              <li><a href="tstc.html">TSTC</a></li>
              <li><a href="esg.html">ESG</a></li>
              <li><a href="portfolio.html">포트폴리오</a></li>
              <li><a href="media.html">미디어</a></li>
              <li><a href="notice.html">커뮤니티</a></li>
            </ul>
          </div>
          <div class="kfa-foot__col">
            <h4>TSTC</h4>
            <ul>
              <li><a href="tstc.html">개념 소개</a></li>
              <li><a href="files/tstc진단프로그램.html">감각 들여다보기</a></li>
              <li><a href="#">고급형 (준비 중)</a></li>
            </ul>
          </div>
          <div class="kfa-foot__col">
            <h4>회원</h4>
            <ul>
              <li><a href="member-login.html">로그인</a></li>
              <li><a href="member-join.html">회원가입</a></li>
              <li><a href="member-mypage.html">마이페이지</a></li>
            </ul>
          </div>
          <div class="kfa-foot__col">
            <h4>문의</h4>
            <ul>
              <li><a href="coordinator.html">교육 문의</a></li>
              <li><a href="notice.html">커뮤니티</a></li>
              <li><a href="mailto:koreafruit@koreafruit.kr">이메일 문의</a></li>
            </ul>
          </div>
        </div>

        <div class="kfa-foot__base">
          <div>© 2026 대한과일협회 · Korea Fruit Association · 2022 설립<br />민간자격 등록 2023-001094 · 문의 koreafruit@koreafruit.kr</div>
          <div class="kfa-foot__legal">
            <a href="#">개인정보 처리방침</a>
            <a href="#">이용약관</a>
          </div>
        </div>
      </div>
    </footer>
  `;

  function renderChrome() {
    const navMount = document.querySelector('[data-chrome="nav"]');
    const footMount = document.querySelector('[data-chrome="footer"]');
    if (navMount) navMount.outerHTML = navHTML;
    if (footMount) footMount.outerHTML = footerHTML;

    const path = location.pathname.split("/").pop().replace(".html", "").replace(/^$/, "index");
    const activeKey = path === "tstc-test" || path === "tstc진단프로그램" ? "tstc" : path;
    const link = document.querySelector(`.kfa-nav__list a[data-nav="${activeKey}"]`);
    if (link) link.classList.add("is-active");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", renderChrome);
  } else {
    renderChrome();
  }
})();
