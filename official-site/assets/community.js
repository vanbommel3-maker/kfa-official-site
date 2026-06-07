(function () {
  var STORAGE_KEY = 'kfa_community_posts';

  function $(id) {
    return document.getElementById(id);
  }

  function readPosts() {
    try {
      var saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      return Array.isArray(saved) ? saved : [];
    } catch (error) {
      return [];
    }
  }

  function writePosts(posts) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
  }

  function escapeHtml(value) {
    return String(value || '').replace(/[&<>"']/g, function (char) {
      return {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
      }[char];
    });
  }

  function formatDate(value) {
    try {
      return new Intl.DateTimeFormat('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      }).format(new Date(value));
    } catch (error) {
      return '';
    }
  }

  function defaultPosts() {
    return [
      {
        id: 'seed-1',
        category: '공지',
        author: '대한과일협회',
        title: '커뮤니티 게시판을 열었습니다.',
        body: '교육 문의, 활동 후기, 현장 이야기를 이곳에 남길 수 있습니다.',
        createdAt: '2026-06-07T09:00:00.000Z',
        pinned: true
      },
      {
        id: 'seed-2',
        category: '교육',
        author: 'KFA',
        title: '과일코디네이터 교육 문의는 이 게시판에 남겨주세요.',
        body: '교육 일정, 과정, 준비물, 자격 관련 질문을 남기면 확인 후 안내합니다.',
        createdAt: '2026-06-07T09:10:00.000Z',
        pinned: true
      }
    ];
  }

  function getPosts() {
    var posts = readPosts();
    if (posts.length) return posts;
    var seeded = defaultPosts();
    writePosts(seeded);
    return seeded;
  }

  function renderPosts() {
    var list = $('community-posts');
    if (!list) return;

    var filter = $('community-filter') ? $('community-filter').value : '전체';
    var query = $('community-search') ? $('community-search').value.trim().toLowerCase() : '';
    var posts = getPosts().filter(function (post) {
      var categoryMatch = filter === '전체' || post.category === filter;
      var text = [post.title, post.body, post.author, post.category].join(' ').toLowerCase();
      return categoryMatch && (!query || text.indexOf(query) >= 0);
    });

    posts.sort(function (a, b) {
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

    if (!posts.length) {
      list.innerHTML = '<li class="kfa-community-empty">표시할 게시글이 없습니다.</li>';
      return;
    }

    list.innerHTML = posts.map(function (post) {
      var deleteButton = post.pinned ? '' : '<button type="button" data-delete="' + escapeHtml(post.id) + '">삭제</button>';
      return (
        '<li class="kfa-community-post">' +
          '<div class="kfa-community-post__meta">' +
            '<span>' + escapeHtml(post.category) + '</span>' +
            '<time>' + escapeHtml(formatDate(post.createdAt)) + '</time>' +
          '</div>' +
          '<h3>' + escapeHtml(post.title) + '</h3>' +
          '<p>' + escapeHtml(post.body) + '</p>' +
          '<div class="kfa-community-post__foot">' +
            '<strong>' + escapeHtml(post.author) + '</strong>' +
            deleteButton +
          '</div>' +
        '</li>'
      );
    }).join('');
  }

  function setMessage(text) {
    var message = $('community-message');
    if (message) message.textContent = text || '';
  }

  function bindForm() {
    var form = $('community-form');
    if (!form) return;

    form.addEventListener('submit', function (event) {
      event.preventDefault();
      var post = {
        id: 'post-' + Date.now(),
        category: $('community-category').value,
        author: $('community-author').value.trim(),
        title: $('community-title').value.trim(),
        body: $('community-body').value.trim(),
        createdAt: new Date().toISOString(),
        pinned: false
      };

      if (!post.author || !post.title || !post.body) {
        setMessage('이름, 제목, 내용을 모두 입력해 주세요.');
        return;
      }

      var posts = getPosts();
      posts.unshift(post);
      writePosts(posts);
      form.reset();
      setMessage('게시글이 등록되었습니다.');
      renderPosts();
    });
  }

  function bindList() {
    var list = $('community-posts');
    if (!list) return;

    list.addEventListener('click', function (event) {
      var button = event.target.closest('[data-delete]');
      if (!button) return;
      var id = button.getAttribute('data-delete');
      var posts = getPosts().filter(function (post) {
        return post.id !== id;
      });
      writePosts(posts);
      renderPosts();
    });

    ['community-filter', 'community-search'].forEach(function (id) {
      var input = $(id);
      if (input) input.addEventListener('input', renderPosts);
    });
  }

  function init() {
    bindForm();
    bindList();
    renderPosts();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
