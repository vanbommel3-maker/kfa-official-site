(function () {
  const parts = decodeURI(location.pathname).split("/").filter(Boolean);
  const mediaIndex = parts.lastIndexOf("media");
  const filesIndex = parts.lastIndexOf("files");
  const nestedIndex = Math.max(mediaIndex, filesIndex);
  const base = nestedIndex >= 0 ? "../".repeat(parts.length - nestedIndex - 1) : "";
  const href = (path) => base + path;
  const siteUrl = "https://koreafruit.kr";

  const navHTML = `
    <nav class="kfa-nav" aria-label="primary">
      <div class="kfa-nav__inner">
        <a class="kfa-nav__brand" href="${href("index.html")}">대한과일협회</a>
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
            <a href="${href("tstc.html")}" data-nav="tstc">
              <strong>왜</strong>
              <span>같은 과일도 사람마다 다르게 느껴지는 이유를 읽습니다.</span>
            </a>
            <a href="${href("coordinator.html")}" data-nav="coordinator">
              <strong>사람</strong>
              <span>사람, 상황, 목적에 맞는 과일 경험을 설계하는 전문가.</span>
            </a>
            <a href="${href("esg.html")}" data-nav="esg">
              <strong>시스템</strong>
              <span>좋은 과일이 남지 않도록 만드는 대한과일협회의 기준.</span>
            </a>
            <a href="${href("about.html")}" data-nav="about">
              <strong>우리</strong>
              <span>협회가 무엇을 믿고 어디로 가는지 먼저 보여드립니다.</span>
            </a>
            <a href="${href("media.html")}" data-nav="media">
              <strong>미디어</strong>
              <span>뉴스보다 느린 속도로 남기는 관찰의 아카이브.</span>
            </a>
            <a href="${href("notice.html")}" data-nav="notice">
              <strong>커뮤니티</strong>
              <span>회원과 비회원이 함께 드나드는 게시판형 커뮤니티.</span>
            </a>
            <a href="${href("member-login.html")}" data-nav="login">
              <strong>로그인</strong>
              <span>회원 확인 상태와 마이페이지로 이어지는 입구.</span>
            </a>
          </div>
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
              <li><a href="${href("about.html")}">협회 소개</a></li>
              <li><a href="${href("coordinator.html")}">과일코디네이터</a></li>
              <li><a href="${href("tstc.html")}">TSTC</a></li>
              <li><a href="${href("portfolio.html")}">포트폴리오</a></li>
            </ul>
          </div>
          <div class="kfa-foot__col">
            <h4>아카이브</h4>
            <ul>
              <li><a href="${href("media.html")}">미디어</a></li>
              <li><a href="${href("notice.html")}">커뮤니티</a></li>
              <li><a href="${href("esg.html")}">ESG</a></li>
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
              <li><a href="${href("tstc-start.html")}">TSTC 진단</a></li>
              <li><a href="${href("coordinator.html")}">교육 안내</a></li>
              <li><a href="mailto:koreafruit@koreafruit.kr">이메일 문의</a></li>
            </ul>
          </div>
        </div>
        <div class="kfa-foot__rule"></div>
        <div class="kfa-foot__base">
          <div>© 2026 대한과일협회 · 민간자격 등록 2023-001094 · 문의 koreafruit@koreafruit.kr</div>
          <div class="kfa-foot__legal">
            <a href="${href("member-join.html")}">회원가입</a>
            <a href="${href("member-login.html")}">로그인</a>
          </div>
        </div>
      </div>
    </footer>
  `;

  function injectSeoJsonLd() {
    if (document.getElementById("kfa-jsonld")) return;

    const canonical = document.querySelector('link[rel="canonical"]');
    const currentUrl = canonical ? canonical.href : siteUrl + location.pathname;
    const title = document.title || "대한과일협회";
    const description = document.querySelector('meta[name="description"]')?.content || "";

    const graph = [
      {
        "@type": "Organization",
        "@id": siteUrl + "/#organization",
        "name": "대한과일협회",
        "alternateName": "Korea Fruit Association",
        "url": siteUrl + "/",
        "email": "koreafruit@koreafruit.kr",
        "description": "과일 교육, 유통 현장 경험, 과일코디네이터 양성, TSTC 취향 분석, ESG 활동을 이어가는 과일 산업 전문기관입니다."
      },
      {
        "@type": "WebSite",
        "@id": siteUrl + "/#website",
        "url": siteUrl + "/",
        "name": "대한과일협회",
        "publisher": {"@id": siteUrl + "/#organization"},
        "inLanguage": "ko-KR"
      },
      {
        "@type": "WebPage",
        "@id": currentUrl + "#webpage",
        "url": currentUrl,
        "name": title,
        "description": description,
        "isPartOf": {"@id": siteUrl + "/#website"},
        "about": {"@id": siteUrl + "/#organization"},
        "inLanguage": "ko-KR"
      }
    ];

    const pageParts = decodeURI(location.pathname).split("/").filter(Boolean);
    if (pageParts.length) {
      const items = [{"@type": "ListItem", "position": 1, "name": "홈", "item": siteUrl + "/"}];
      pageParts.forEach((part, index) => {
        const clean = part.replace(".html", "");
        const itemPath = "/" + pageParts.slice(0, index + 1).join("/");
        items.push({
          "@type": "ListItem",
          "position": index + 2,
          "name": clean,
          "item": siteUrl + itemPath
        });
      });
      graph.push({
        "@type": "BreadcrumbList",
        "@id": currentUrl + "#breadcrumb",
        "itemListElement": items
      });
    }

    const script = document.createElement("script");
    script.id = "kfa-jsonld";
    script.type = "application/ld+json";
    script.textContent = JSON.stringify({"@context": "https://schema.org", "@graph": graph});
    document.head.appendChild(script);
  }

  function renderChrome() {
    injectSeoJsonLd();

    const navMount = document.querySelector('[data-chrome="nav"]');
    const footMount = document.querySelector('[data-chrome="footer"]');
    if (navMount) navMount.outerHTML = navHTML;
    if (footMount) footMount.outerHTML = footerHTML;

    const file = location.pathname.split("/").pop().replace(".html", "").replace(/^$/, "index");
    const path = mediaIndex >= 0 || file === "media" ? "media" : file;
    const links = document.querySelectorAll(`[data-nav="${path}"]`);
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
