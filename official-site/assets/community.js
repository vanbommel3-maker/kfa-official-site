(function () {
  var DEFAULT_GAS_URL = 'https://script.google.com/macros/s/AKfycbzBZMQ55OAWVlw1C_o-9_QIZ3zgVaSEYOW6wIvrJ8cN73jNBIWgv3ATTNE5jBJOjtE4HQ/exec';
  var GAS_KEY = 'kfa_member_gas_url';
  var posts = [];

  function $(id) {
    return document.getElementById(id);
  }

  function getGasUrl() {
    return (localStorage.getItem(GAS_KEY) || DEFAULT_GAS_URL).trim();
  }

  function jsonp(params) {
    return new Promise(function (resolve, reject) {
      var gasUrl = getGasUrl();
      if (!gasUrl) {
        reject(new Error('Apps Script URL이 필요합니다.'));
        return;
      }

      var callbackName = 'kfaCommunityCallback_' + Date.now() + '_' + Math.floor(Math.random() * 100000);
      var script = document.createElement('script');
      var query = Object.keys(params).map(function (key) {
        return encodeURIComponent(key) + '=' + encodeURIComponent(params[key] == null ? '' : params[key]);
      });
      query.push('callback=' + encodeURIComponent(callbackName));

      window[callbackName] = function (data) {
        cleanup();
        resolve(data || {});
      };

      function cleanup() {
        delete window[callbackName];
        if (script.parentNode) script.parentNode.removeChild(script);
      }

      script.onerror = function () {
        cleanup();
        reject(new Error('커뮤니티 서버에 연결하지 못했습니다.'));
      };

      script.src = gasUrl + '?' + query.join('&');
      document.body.appendChild(script);
    });
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

  function renderPosts() {
    var list = $('community-posts');
    if (!list) return;

    var filter = $('community-filter') ? $('community-filter').value : '전체';
    var query = $('community-search') ? $('community-search').value.trim().toLowerCase() : '';
    var filtered = posts.filter(function (post) {
      var categoryMatch = filter === '전체' || post.category === filter;
      var text = [post.title, post.body, post.author, post.category].join(' ').toLowerCase();
      return categoryMatch && (!query || text.indexOf(query) >= 0);
    });

    if (!filtered.length) {
      list.innerHTML = '<li class="kfa-community-empty">표시할 게시글이 없습니다.</li>';
      return;
    }

    list.innerHTML = filtered.map(function (post) {
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
            '<em>' + escapeHtml(post.postId || '') + '</em>' +
          '</div>' +
        '</li>'
      );
    }).join('');
  }

  function setMessage(text, type) {
    var message = $('community-message');
    if (!message) return;
    message.textContent = text || '';
    message.dataset.type = type || '';
  }

  async function loadPosts() {
    var list = $('community-posts');
    if (list) list.innerHTML = '<li class="kfa-community-empty">게시글을 불러오는 중입니다.</li>';

    try {
      var result = await jsonp({ action: 'listCommunityPosts' });
      if (!result.ok) throw new Error(result.message || '게시글을 불러오지 못했습니다.');
      posts = Array.isArray(result.posts) ? result.posts : [];
      renderPosts();
    } catch (error) {
      posts = [];
      if (list) list.innerHTML = '<li class="kfa-community-empty">게시글을 불러오지 못했습니다.<br />Apps Script 배포와 CommunityPosts 시트를 확인해 주세요.</li>';
      setMessage(error.message, 'err');
    }
  }

  function bindForm() {
    var form = $('community-form');
    if (!form) return;

    form.addEventListener('submit', async function (event) {
      event.preventDefault();
      var payload = {
        action: 'createCommunityPost',
        category: $('community-category').value,
        author: $('community-author').value.trim(),
        title: $('community-title').value.trim(),
        body: $('community-body').value.trim()
      };

      if (!payload.author || !payload.title || !payload.body) {
        setMessage('이름, 제목, 내용을 모두 입력해 주세요.', 'err');
        return;
      }

      setMessage('게시글을 등록하는 중입니다...', 'warn');
      try {
        var result = await jsonp(payload);
        if (!result.ok) throw new Error(result.message || '게시글 등록에 실패했습니다.');
        form.reset();
        setMessage(result.message || '게시글이 등록되었습니다.', 'ok');
        loadPosts();
      } catch (error) {
        setMessage(error.message, 'err');
      }
    });
  }

  function bindFilters() {
    ['community-filter', 'community-search'].forEach(function (id) {
      var input = $(id);
      if (input) input.addEventListener('input', renderPosts);
    });
  }

  function init() {
    bindForm();
    bindFilters();
    loadPosts();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
