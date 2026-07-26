(function () {
  const parts = decodeURI(location.pathname).split("/").filter(Boolean);
  const mediaIndex = parts.lastIndexOf("media");
  const filesIndex = parts.lastIndexOf("files");
  const nestedIndex = Math.max(mediaIndex, filesIndex);
  const base = nestedIndex >= 0 ? "../".repeat(parts.length - nestedIndex - 1) : "";
  const href = (path) => base + path;

  const navHTML = `
    <nav class="kfa-nav" aria-label="primary">
      <div class="kfa-nav__inner">
        <a class="kfa-nav__brand" href="${href("index.html")}">
          대한과일협회<em>KFA</em>
        </a>
        <ul class="kfa-nav__list">
          <li><a href="${href("index.html")}" data-nav="index">홈</a></li>
          <li><a href="${href("about.html")}" data-nav="about">협회</a></li>
          <li><a href="${href("coordinator.html")}" data-nav="coordinator">과일코디네이터</a></li>
          <li><a href="${href("tstc.html")}" data-nav="tstc">TSTC</a></li>
          <li><a href="${href("esg.html")}" data-nav="esg">ESG</a></li>
          <li><a href="${href("portfolio.html")}" data-nav="portfolio">포트폴리오</a></li>
          <li><a href="${href("media.html")}" data-nav="media">미디어</a></li>
          <li><a href="${href("notice.html")}" data-nav="notice">커뮤니티</a></li>
        </ul>
        <div class="kfa-nav__util">
          <a class="kfa-nav__test" href="${href("tstc-start.html")}">진단하기</a>
          <a class="kfa-nav__login" href="${href("member-login.html")}">로그인</a>
        </div>
        <button class="kfa-nav__menu" type="button" aria-expanded="false" aria-controls="kfa-mobile-menu" aria-label="메뉴 열기">
          <span></span>
          <span></span>
        </button>
      </div>
      <div class="kfa-mobile-menu" id="kfa-mobile-menu" aria-hidden="true">
        <div class="kfa-mobile-menu__panel">
          <div class="kfa-mobile-menu__head">
            <p>KFA NAVIGATION</p>
            <button class="kfa-mobile-menu__close" type="button" aria-label="메뉴 닫기">닫기</button>
          </div>
          <div class="kfa-mobile-menu__body">
            <a href="${href("index.html")}" data-nav="index">
              <strong>홈</strong>
              <span>대한과일협회의 첫 화면과 주요 흐름을 바로 봅니다.</span>
            </a>
            <a href="${href("about.html")}" data-nav="about">
              <strong>협회</strong>
              <span>대한과일협회가 왜 존재하는지와 방향을 소개합니다.</span>
            </a>
            <a href="${href("coordinator.html")}" data-nav="coordinator">
              <strong>과일코디네이터</strong>
              <span>사람과 과일 경험을 연결하는 현장 전문가를 설명합니다.</span>
            </a>
            <a href="${href("tstc.html")}" data-nav="tstc">
              <strong>TSTC</strong>
              <span>맛, 향, 식감, 색으로 읽는 취향 분석 구조를 봅니다.</span>
            </a>
            <a href="${href("esg.html")}" data-nav="esg">
              <strong>ESG</strong>
              <span>과일 폐기와 지속가능성에 대한 협회의 기준을 정리합니다.</span>
            </a>
            <a href="${href("portfolio.html")}" data-nav="portfolio">
              <strong>포트폴리오</strong>
              <span>협회의 활동과 현장 사례를 한눈에 모아 봅니다.</span>
            </a>
            <a href="${href("media.html")}" data-nav="media">
              <strong>미디어</strong>
              <span>과일을 다르게 보기 시작하는 콘텐츠를 모아 둡니다.</span>
            </a>
            <a href="${href("notice.html")}" data-nav="notice">
              <strong>커뮤니티</strong>
              <span>공지와 게시판, 회원 소식을 함께 확인하는 공간입니다.</span>
            </a>
            <a href="${href("member-login.html")}" data-nav="login">
              <strong>로그인</strong>
              <span>회원 확인과 마이페이지로 이어지는 입구입니다.</span>
            </a>
          </div>
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
              <li><a href="${href("about.html")}">협회 소개</a></li>
              <li><a href="${href("coordinator.html")}">과일코디네이터</a></li>
              <li><a href="${href("tstc.html")}">TSTC</a></li>
              <li><a href="${href("esg.html")}">ESG</a></li>
              <li><a href="${href("portfolio.html")}">포트폴리오</a></li>
              <li><a href="${href("media.html")}">미디어</a></li>
              <li><a href="${href("notice.html")}">커뮤니티</a></li>
            </ul>
          </div>
          <div class="kfa-foot__col">
            <h4>TSTC</h4>
            <ul>
              <li><a href="${href("tstc.html")}">개념 소개</a></li>
              <li><a href="${href("tstc-start.html")}">감각 들여다보기</a></li>
              <li><a href="#">고급형 (준비 중)</a></li>
            </ul>
          </div>
          <div class="kfa-foot__col">
            <h4>회원</h4>
            <ul>
              <li><a href="${href("member-login.html")}">로그인</a></li>
              <li><a href="${href("member-join.html")}">회원가입</a></li>
              <li><a href="${href("member-mypage.html")}">마이페이지</a></li>
            </ul>
          </div>
          <div class="kfa-foot__col">
            <h4>문의</h4>
            <ul>
              <li><a href="${href("coordinator.html")}">교육 문의</a></li>
              <li><a href="${href("notice.html")}">커뮤니티</a></li>
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

    const file = location.pathname.split("/").pop().replace(".html", "").replace(/^$/, "index");
    const path = mediaIndex >= 0 || file === "media" ? "media" : file;
    const rawActiveKey =
      path === "tstc-test" || path === "tstc-start" || path === "tstc진단프로그램"
        ? "tstc"
        : path;
    const activeKey = rawActiveKey.startsWith("education-") ? "coordinator" : rawActiveKey;
    const links = document.querySelectorAll(`[data-nav="${activeKey}"]`);
    links.forEach((link) => link.classList.add("is-active"));

    const nav = document.querySelector(".kfa-nav");
    const menuButton = nav && nav.querySelector(".kfa-nav__menu");
    const menu = nav && nav.querySelector(".kfa-mobile-menu");
    const closeButton = nav && nav.querySelector(".kfa-mobile-menu__close");
    const menuLinks = menu ? menu.querySelectorAll("a") : [];

    if (!nav || !menuButton || !menu || !closeButton) return;

    const setMenu = (open) => {
      document.body.classList.toggle("kfa-nav-open", open);
      nav.classList.toggle("is-menu-open", open);
      menuButton.setAttribute("aria-expanded", String(open));
      menu.setAttribute("aria-hidden", String(!open));
    };

    menuButton.addEventListener("click", () => {
      const open = menuButton.getAttribute("aria-expanded") !== "true";
      setMenu(open);
    });

    closeButton.addEventListener("click", () => setMenu(false));
    menuLinks.forEach((link) => link.addEventListener("click", () => setMenu(false)));
    window.addEventListener("resize", () => {
      if (window.innerWidth > 767) setMenu(false);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", renderChrome);
  } else {
    renderChrome();
  }
})();
