// portfolio.js — KFA archive portfolio
(function () {
  const ITEMS = [
    {
      src: "assets/portfolio/g37.jpg",
      cat: "선물",
      project: "프리미엄 망고 선물 프로젝트",
      purpose: "감사의 마음을 전하는 고급 선물 제안",
      audience: "기업 고객 · VIP 선물 수요",
      place: "회원사 선물 제작 현장",
      fruit: "애플망고",
      result: "프리미엄 포장 기준과 시즌 선물 구성을 사례로 정리"
    },
    {
      src: "assets/portfolio/g17.jpg",
      cat: "선물",
      project: "혼합 과일 선물세트 구성",
      purpose: "명절과 기념일용 복합 구성 테스트",
      audience: "가정 선물 · 단체 주문 고객",
      place: "과일 선물 제작 현장",
      fruit: "오렌지 · 샤인머스캣 · 제철 과일",
      result: "색, 보관성, 전달 목적을 함께 반영한 패키지 사례 확보"
    },
    {
      src: "assets/site/edu-02.jpg",
      cat: "교육",
      project: "도매시장 현장 교육",
      purpose: "시장 이해와 과일 판별 기준 교육",
      audience: "과일코디네이터 교육생",
      place: "도매시장 교육 현장",
      fruit: "시장 유통 과일 전반",
      result: "현장 중심 교육 프로그램 아카이브 구축"
    },
    {
      src: "assets/portfolio/p23.jpg",
      cat: "교육",
      project: "시식 기반 과일 수업",
      purpose: "감각 기준과 추천 언어를 연결하는 실습",
      audience: "교육 참가자 · 초급 실습반",
      place: "실습 교육 공간",
      fruit: "모둠 컷과일",
      result: "맛·향·식감 비교를 통한 실습형 수업 사례 정리"
    },
    {
      src: "assets/portfolio/g38.jpg",
      cat: "행사",
      project: "컵과일 행사 운영",
      purpose: "행사 현장에서 간편하고 위생적인 과일 제공",
      audience: "행사 방문객 · 단체 참가자",
      place: "오프라인 행사장",
      fruit: "컵과일 모둠",
      result: "행사형 과일 서비스 운영 기준 사례화"
    },
    {
      src: "assets/portfolio/g39.jpg",
      cat: "행사",
      project: "모임용 과일컵 세팅",
      purpose: "짧은 체류 행사에 맞는 소분 과일 제안",
      audience: "세미나 · 체험 행사 참가자",
      place: "모임 및 세미나 현장",
      fruit: "딸기 · 키위 · 오렌지",
      result: "소분형 과일 제공 방식과 반응 기록"
    },
    {
      src: "assets/portfolio/p24.jpg",
      cat: "문화",
      project: "생활 과일 문화 제안",
      purpose: "한 끼 과일을 일상 문화로 전환하는 제안",
      audience: "일반 소비자 · 가족 단위",
      place: "생활형 시식 콘텐츠",
      fruit: "멜론 · 배 · 감귤",
      result: "과일을 식탁 문화로 풀어내는 콘텐츠 사례 축적"
    },
    {
      src: "assets/portfolio/g31.jpg",
      cat: "문화",
      project: "계절 과일 문화 큐레이션",
      purpose: "제철 과일을 계절 경험으로 소개",
      audience: "지역 커뮤니티 · 소비자",
      place: "시즌 큐레이션 현장",
      fruit: "감귤 · 망고",
      result: "과일을 계절 문화와 연결하는 전시형 사례 확보"
    },
    {
      src: "assets/site/market-01.jpg",
      cat: "유통",
      project: "가락시장 현장 투어",
      purpose: "과일 유통 현장 이해와 연결 구조 학습",
      audience: "회원 · 교육 참가자",
      place: "가락시장",
      fruit: "도매 유통 과일 전반",
      result: "생산-유통-소비 연결 구조를 현장 기록으로 축적"
    },
    {
      src: "assets/site/auction-watermelon.jpg",
      cat: "유통",
      project: "수박 경매 관찰 기록",
      purpose: "유통 과정과 품목 흐름 이해",
      audience: "회원 · 실무 교육생",
      place: "도매시장 경매장",
      fruit: "수박",
      result: "도매시장 흐름을 교육 자료로 재구성"
    },
    {
      src: "assets/portfolio/g14.jpg",
      cat: "회원사례",
      project: "회원사 명절 과일 제안",
      purpose: "회원사의 시즌 판매 사례 기록",
      audience: "명절 선물 수요 고객",
      place: "회원사 제작 현장",
      fruit: "용과 · 머스캣 · 오렌지",
      result: "회원사의 상품 제안 방식과 포장 결과 공유"
    },
    {
      src: "assets/portfolio/g25.jpg",
      cat: "회원사례",
      project: "회원사 시즌 패키지 운영",
      purpose: "회원 사례를 아카이브로 정리",
      audience: "협회 회원 · 신규 참여자",
      place: "회원사 운영 현장",
      fruit: "제철 혼합 과일",
      result: "실제 회원 사례를 협회 포트폴리오로 축적"
    }
  ];

  function cardHTML(item, i) {
    return `
      <button class="pf-card" data-open="${i}" data-cat="${item.cat}" aria-label="${item.project}">
        <img loading="lazy" src="${item.src}" alt="${item.project}" />
        <span class="pf-card__body">
          <span class="pf-card__cat">${item.cat}</span>
          <strong class="pf-card__title">${item.project}</strong>
          <span class="pf-card__meta"><b>진행 목적</b>${item.purpose}</span>
          <span class="pf-card__meta"><b>대상 고객</b>${item.audience}</span>
          <span class="pf-card__meta"><b>진행 장소</b>${item.place}</span>
          <span class="pf-card__meta"><b>활용 과일</b>${item.fruit}</span>
          <span class="pf-card__result">${item.result}</span>
        </span>
      </button>`;
  }

  let current = ITEMS;

  function render(filter) {
    const grid = document.querySelector('[data-pf-grid]');
    if (!grid) return;
    current = filter && filter !== 'all' ? ITEMS.filter((item) => item.cat === filter) : ITEMS;
    grid.innerHTML = current.map((item) => cardHTML(item, ITEMS.indexOf(item))).join('');
  }

  function initTabs() {
    const nav = document.querySelector('[data-pf-tabs]');
    if (!nav) return;
    nav.addEventListener('click', (e) => {
      const button = e.target.closest('button');
      if (!button) return;
      nav.querySelectorAll('button').forEach((node) => node.classList.remove('is-active'));
      button.classList.add('is-active');
      render(button.dataset.cat);
    });
  }

  function initLightbox() {
    const box = document.createElement('div');
    box.className = 'pf-lb';
    box.setAttribute('hidden', '');
    box.innerHTML = `
      <div class="pf-lb__scrim" data-close></div>
      <button class="pf-lb__nav pf-lb__prev" data-prev aria-label="이전">‹</button>
      <figure class="pf-lb__fig">
        <img data-lb-img src="" alt="" />
        <figcaption class="pf-lb__cap">
          <b data-lb-title></b>
          <span data-lb-meta></span>
          <span data-lb-result></span>
        </figcaption>
      </figure>
      <button class="pf-lb__nav pf-lb__next" data-next aria-label="다음">›</button>
      <button class="pf-lb__close" data-close aria-label="닫기">✕</button>`;
    document.body.appendChild(box);

    const grid = document.querySelector('[data-pf-grid]');
    const q = (selector) => box.querySelector(selector);
    let pos = 0;
    let closeTimer;

    function paint() {
      const item = current[((pos % current.length) + current.length) % current.length];
      q('[data-lb-img]').src = item.src;
      q('[data-lb-img]').alt = item.project;
      q('[data-lb-title]').textContent = item.project;
      q('[data-lb-meta]').textContent = `${item.cat} · ${item.place} · ${item.fruit}`;
      q('[data-lb-result]').textContent = item.result;
    }

    function open(globalIdx) {
      pos = current.indexOf(ITEMS[globalIdx]);
      if (pos < 0) pos = 0;
      clearTimeout(closeTimer);
      paint();
      box.removeAttribute('hidden');
      document.body.style.overflow = 'hidden';
      requestAnimationFrame(() => box.classList.add('is-open'));
    }

    function close() {
      box.classList.remove('is-open');
      document.body.style.overflow = '';
      clearTimeout(closeTimer);
      closeTimer = setTimeout(() => box.setAttribute('hidden', ''), 280);
    }

    function step(delta) {
      pos += delta;
      paint();
    }

    if (grid) {
      grid.addEventListener('click', (e) => {
        const card = e.target.closest('[data-open]');
        if (!card) return;
        open(+card.dataset.open);
      });
    }

    box.addEventListener('click', (e) => {
      if (e.target.closest('[data-close]')) return close();
      if (e.target.closest('[data-prev]')) return step(-1);
      if (e.target.closest('[data-next]')) return step(1);
    });

    document.addEventListener('keydown', (e) => {
      if (box.hasAttribute('hidden')) return;
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') step(-1);
      if (e.key === 'ArrowRight') step(1);
    });
  }

  function boot() {
    render('all');
    initTabs();
    initLightbox();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
