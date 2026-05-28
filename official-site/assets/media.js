(function () {
  const posts = Array.isArray(window.KFA_MEDIA_POSTS) ? window.KFA_MEDIA_POSTS : [];
  const featured = document.querySelector('[data-media-featured]');
  const list = document.querySelector('[data-media-list]');

  function esc(value) {
    return String(value || '').replace(/[&<>"']/g, function (ch) {
      return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[ch];
    });
  }

  function cardSlides(post) {
    return (post.cards || []).map(function (line, i) {
      return '<li><span>' + String(i + 1).padStart(2, '0') + '</span><p>' + esc(line) + '</p></li>';
    }).join('');
  }

  function metrics(post) {
    return (post.metrics || []).map(function (m) {
      return '<div><strong>' + esc(m.v) + '</strong><span>' + esc(m.k) + '</span></div>';
    }).join('');
  }

  function renderFeatured(post) {
    if (!featured || !post) return;
    featured.innerHTML =
      '<article class="kfa-media-hero">' +
        '<div class="kfa-media-hero__copy">' +
          '<p class="kfa-eyebrow">' + esc(post.label) + ' · ' + esc(post.date) + '</p>' +
          '<h2>' + esc(post.title) + '</h2>' +
          '<p>' + esc(post.lead) + '</p>' +
          '<div class="kfa-media-metrics">' + metrics(post) + '</div>' +
        '</div>' +
        '<ol class="kfa-cardnews">' + cardSlides(post) + '</ol>' +
      '</article>';
  }

  function renderList(items) {
    if (!list) return;
    if (!items.length) {
      list.innerHTML = '<p class="kfa-media-empty">아직 등록된 미디어가 없습니다.</p>';
      return;
    }
    list.innerHTML =
      '<div class="kfa-media-list__head">' +
        '<p class="kfa-eyebrow">Archive</p>' +
        '<h2>쌓이는 기록</h2>' +
      '</div>' +
      '<div class="kfa-media-items">' +
        items.map(function (post) {
          return '<article class="kfa-media-item">' +
            '<time>' + esc(post.date) + '</time>' +
            '<div>' +
              '<span>' + esc(post.label) + '</span>' +
              '<h3>' + esc(post.title) + '</h3>' +
              '<p>' + esc(post.lead) + '</p>' +
              (post.sourceUrl ? '<a class="kfa-link-arrow" href="' + esc(post.sourceUrl) + '">자료 보기</a>' : '') +
            '</div>' +
          '</article>';
        }).join('') +
      '</div>';
  }

  renderFeatured(posts[0]);
  renderList(posts);
})();
