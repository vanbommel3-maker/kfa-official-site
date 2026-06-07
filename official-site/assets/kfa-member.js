(function () {
  var OLD_GAS_URL = 'https://script.google.com/macros/s/AKfycbzkKVrTfbaQOivDlq6Kl7fTX_DUH1xm6zH4X2hbAfKRhBpVtU5v4Oa2xBNd7lwjIGq2fg/exec';
  var DEFAULT_GAS_URL = 'https://script.google.com/macros/s/AKfycbzBZMQ55OAWVlw1C_o-9_QIZ3zgVaSEYOW6wIvrJ8cN73jNBIWgv3ATTNE5jBJOjtE4HQ/exec';
  var GAS_KEY = 'kfa_member_gas_url';
  var SESSION_KEY = 'kfa_member_session';

  function $(id) {
    return document.getElementById(id);
  }

  function setText(id, text, type) {
    var el = $(id);
    if (!el) return;
    el.textContent = text || '';
    el.className = 'msg' + (type ? ' ' + type : '');
  }

  function getGasUrl() {
    var url = localStorage.getItem(GAS_KEY) || DEFAULT_GAS_URL;
    if (url === OLD_GAS_URL) {
      localStorage.setItem(GAS_KEY, DEFAULT_GAS_URL);
      return DEFAULT_GAS_URL;
    }
    return url;
  }

  function saveGasUrl() {
    var input = $('gas-url');
    if (!input) return;
    var value = input.value.trim();
    localStorage.setItem(GAS_KEY, value);
    setText('config-msg', value ? 'Apps Script URL이 저장되었습니다.' : 'URL이 비어 있습니다.', value ? 'ok' : 'warn');
  }

  function initGasInput() {
    var input = $('gas-url');
    if (!input) return;
    input.value = getGasUrl();
    var btn = $('save-gas-url');
    if (btn) btn.addEventListener('click', saveGasUrl);
  }

  function jsonp(params) {
    return new Promise(function (resolve, reject) {
      var gasUrl = getGasUrl();
      if (!gasUrl) {
        reject(new Error('Apps Script URL을 먼저 입력해주세요.'));
        return;
      }

      var callbackName = 'kfaMemberCallback_' + Date.now() + '_' + Math.floor(Math.random() * 100000);
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
        reject(new Error('Apps Script 연결에 실패했습니다.'));
      };
      script.src = gasUrl + (gasUrl.indexOf('?') >= 0 ? '&' : '?') + query.join('&');
      document.body.appendChild(script);
    });
  }

  async function sha256(text) {
    var bytes = new TextEncoder().encode(text);
    var hash = await crypto.subtle.digest('SHA-256', bytes);
    return Array.from(new Uint8Array(hash)).map(function (b) {
      return b.toString(16).padStart(2, '0');
    }).join('');
  }

  function readSession() {
    try {
      return JSON.parse(localStorage.getItem(SESSION_KEY) || 'null');
    } catch (e) {
      return null;
    }
  }

  function writeSession(session) {
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  }

  function clearSession() {
    localStorage.removeItem(SESSION_KEY);
  }

  function formValue(form, name) {
    return (form.elements[name] && form.elements[name].value || '').trim();
  }

  function setupJoin() {
    var form = $('join-form');
    if (!form) return;
    form.addEventListener('submit', async function (event) {
      event.preventDefault();
      setText('join-msg', '회원가입 신청을 접수하는 중입니다...', 'warn');

      var email = formValue(form, 'email').toLowerCase();
      var password = formValue(form, 'password');
      var password2 = formValue(form, 'password2');
      if (password.length < 8) {
        setText('join-msg', '비밀번호는 8자 이상으로 입력해주세요.', 'err');
        return;
      }
      if (password !== password2) {
        setText('join-msg', '비밀번호 확인이 일치하지 않습니다.', 'err');
        return;
      }

      try {
        var passwordHash = await sha256(email + ':' + password);
        var result = await jsonp({
          action: 'signup',
          email: email,
          passwordHash: passwordHash,
          name: formValue(form, 'name'),
          phone: formValue(form, 'phone'),
          businessName: formValue(form, 'businessName'),
          businessType: formValue(form, 'businessType'),
          region: formValue(form, 'region'),
          role: formValue(form, 'role')
        });
        if (!result.ok) throw new Error(result.message || '가입 신청에 실패했습니다.');
        setText('join-msg', result.message || '회원가입 신청이 접수되었습니다. 관리자 승인 후 로그인할 수 있습니다.', 'ok');
        form.reset();
      } catch (error) {
        setText('join-msg', error.message, 'err');
      }
    });
  }

  function setupLogin() {
    var form = $('login-form');
    if (!form) return;
    form.addEventListener('submit', async function (event) {
      event.preventDefault();
      setText('login-msg', '로그인 확인 중입니다...', 'warn');
      var email = formValue(form, 'email').toLowerCase();
      var password = formValue(form, 'password');

      try {
        var passwordHash = await sha256(email + ':' + password);
        var result = await jsonp({
          action: 'login',
          email: email,
          passwordHash: passwordHash
        });
        if (!result.ok) throw new Error(result.message || '로그인에 실패했습니다.');
        writeSession({
          token: result.token,
          memberNo: result.member && result.member.memberNo,
          name: result.member && result.member.name,
          email: email
        });
        setText('login-msg', '로그인되었습니다. 마이페이지로 이동합니다.', 'ok');
        setTimeout(function () {
          location.href = 'member-mypage.html';
        }, 500);
      } catch (error) {
        setText('login-msg', error.message, 'err');
      }
    });
  }

  function renderMember(member) {
    var fields = {
      'member-no': member.memberNo,
      'member-name': member.name,
      'member-email': member.email,
      'member-phone': member.phone,
      'member-business': member.businessName,
      'member-type': member.businessType,
      'member-region': member.region,
      'member-role': member.role,
      'member-status': member.status,
      'member-period': member.period || '승인 후 기재'
    };
    Object.keys(fields).forEach(function (id) {
      if ($(id)) $(id).textContent = fields[id] || '-';
    });
  }

  function setupMyPage() {
    var box = $('member-panel');
    if (!box) return;
    var session = readSession();
    if (!session || !session.token) {
      setText('mypage-msg', '로그인이 필요합니다.', 'err');
      box.style.display = 'none';
      return;
    }

    jsonp({ action: 'me', token: session.token }).then(function (result) {
      if (!result.ok) throw new Error(result.message || '회원 정보를 불러오지 못했습니다.');
      renderMember(result.member || {});
      setText('mypage-msg', '회원 정보를 불러왔습니다.', 'ok');
    }).catch(function (error) {
      clearSession();
      box.style.display = 'none';
      setText('mypage-msg', error.message, 'err');
    });

    var logout = $('logout-btn');
    if (logout) {
      logout.addEventListener('click', function () {
        clearSession();
        location.href = 'member-login.html';
      });
    }
  }

  document.addEventListener('DOMContentLoaded', function () {
    initGasInput();
    setupJoin();
    setupLogin();
    setupMyPage();
  });
})();
