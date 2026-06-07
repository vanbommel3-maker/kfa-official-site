(function () {
  var LEGACY_MEMBER_GAS_URLS = [
    'https://script.google.com/macros/s/AKfycbzkKVrTfbaQOivDlq6Kl7fTX_DUH1xm6zH4X2hbAfKRhBpVtU5v4Oa2xBNd7lwjIGq2fg/exec',
    'https://script.google.com/macros/s/AKfycbzBZMQ55OAWVlw1C_o-9_QIZ3zgVaSEYOW6wIvrJ8cN73jNBIWgv3ATTNE5jBJOjtE4HQ/exec'
  ];
  var DEFAULT_MEMBER_GAS_URL = 'https://script.google.com/macros/s/AKfycbw9j8C-sLm6DcsDy39YX3wHkxnpVe86PCAGL75WuXNKP78vqZSAiA3YFDIz7FamFaBwCw/exec';
  var DEFAULT_TSTC_DASHBOARD_URL = 'files/tstc-results.html';
  var DEFAULT_MEMBER_SHEET_URL = 'https://docs.google.com/spreadsheets/d/1PMEPuTUc2-AhPxnzXoFYPXhS7_kPN1Oxt5DOsX86GTA/edit';

  var KEYS = {
    gasUrl: 'kfa_member_gas_url',
    adminKey: 'kfa_member_admin_key',
    period: 'kfa_member_admin_period',
    memo: 'kfa_member_admin_memo',
    tstcUrl: 'kfa_tstc_dashboard_url'
  };

  var state = {
    members: [],
    filter: 'ALL'
  };
  var memoryStore = {};

  function $(id) {
    return document.getElementById(id);
  }

  function setText(id, text, type) {
    var el = $(id);
    if (!el) return;
    el.textContent = text || '';
    el.className = 'msg' + (type ? ' ' + type : '');
  }

  function getStored(key, fallback) {
    try {
      return localStorage.getItem(key) || memoryStore[key] || fallback || '';
    } catch (error) {
      return memoryStore[key] || fallback || '';
    }
  }

  function setStored(key, value) {
    memoryStore[key] = value || '';
    try {
      localStorage.setItem(key, value || '');
      return true;
    } catch (error) {
      return false;
    }
  }

  function jsonp(url, params) {
    return new Promise(function (resolve, reject) {
      if (!url) {
        reject(new Error('회원 Apps Script URL을 먼저 입력해주세요.'));
        return;
      }

      var callbackName = 'kfaAdminCallback_' + Date.now() + '_' + Math.floor(Math.random() * 100000);
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
        reject(new Error('회원 Apps Script 연결에 실패했습니다.'));
      };
      script.src = url + (url.indexOf('?') >= 0 ? '&' : '?') + query.join('&');
      document.body.appendChild(script);
    });
  }

  function statusLabel(status) {
    if (status === 'APPROVED') return '승인';
    if (status === 'REJECTED') return '반려';
    return '대기';
  }

  function statusClass(status) {
    if (status === 'APPROVED') return 'is-approved';
    if (status === 'REJECTED') return 'is-rejected';
    return 'is-pending';
  }

  function formatDate(value) {
    if (!value) return '-';
    var date = new Date(value);
    if (isNaN(date.getTime())) return String(value);
    return date.toLocaleString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  function escapeHtml(text) {
    return String(text == null ? '' : text)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function getGasUrl() {
    var url = getStored(KEYS.gasUrl, DEFAULT_MEMBER_GAS_URL).trim();
    if (LEGACY_MEMBER_GAS_URLS.indexOf(url) >= 0) {
      setStored(KEYS.gasUrl, DEFAULT_MEMBER_GAS_URL);
      return DEFAULT_MEMBER_GAS_URL;
    }
    return url;
  }

  function getAdminKey() {
    return getStored(KEYS.adminKey, '').trim();
  }

  function normalizeDashboardUrl(value) {
    var url = (value || '').trim();
    if (!url || /script\.google\.com\/macros/i.test(url)) {
      return DEFAULT_TSTC_DASHBOARD_URL;
    }
    return url;
  }

  function getDashboardUrl() {
    return normalizeDashboardUrl(getStored(KEYS.tstcUrl, DEFAULT_TSTC_DASHBOARD_URL));
  }

  function setAdminAccess(open) {
    var gate = $('admin-gate');
    var shell = $('admin-shell');
    if (gate) gate.hidden = !!open;
    if (shell) shell.hidden = !open;
  }

  function syncAdminKeys(value) {
    if ($('member-admin-key')) $('member-admin-key').value = value || '';
    if ($('member-admin-key-gate')) $('member-admin-key-gate').value = value || '';
  }

  function saveConfig() {
    var savedGas = setStored(KEYS.gasUrl, $('member-gas-url').value.trim());
    var savedKey = setStored(KEYS.adminKey, $('member-admin-key').value.trim());
    var savedPeriod = setStored(KEYS.period, $('member-period').value.trim());
    var savedMemo = setStored(KEYS.memo, $('member-memo').value.trim());
    var persisted = savedGas && savedKey && savedPeriod && savedMemo;
    setText(
      'admin-config-msg',
      persisted
        ? '운영 설정을 저장했습니다.'
        : '브라우저 저장소 접근이 제한되어 현재 창에서만 유지됩니다. 배포 도메인에서 열면 정상 저장됩니다.',
      persisted ? 'ok' : 'warn'
    );
    refreshLinks();
  }

  function saveDashboardUrl() {
    var dashboardUrl = normalizeDashboardUrl($('tstc-dashboard-url').value);
    var persisted = setStored(KEYS.tstcUrl, dashboardUrl);
    refreshLinks();
    setText(
      'admin-config-msg',
      persisted
        ? 'TSTC 대시보드 경로를 저장했습니다.'
        : '브라우저 저장소 접근이 제한되어 현재 창에서만 유지됩니다. 배포 도메인에서 열면 정상 저장됩니다.',
      persisted ? 'ok' : 'warn'
    );
  }

  function refreshLinks() {
    var dashboardUrl = getDashboardUrl() || DEFAULT_TSTC_DASHBOARD_URL;
    $('tstc-dashboard-url').value = dashboardUrl;
    $('open-tstc-dashboard').href = dashboardUrl;
    $('tstc-dashboard-frame').src = dashboardUrl;
    $('open-member-sheet').href = DEFAULT_MEMBER_SHEET_URL;
  }

  function initInputs() {
    $('member-gas-url').value = getGasUrl();
    syncAdminKeys(getAdminKey());
    $('member-period').value = getStored(KEYS.period, '');
    $('member-memo').value = getStored(KEYS.memo, '');
    refreshLinks();

    $('save-admin-config').addEventListener('click', saveConfig);
    $('save-tstc-url').addEventListener('click', saveDashboardUrl);
    $('refresh-members').addEventListener('click', loadMembers);
    $('member-status-filter').addEventListener('change', function (event) {
      state.filter = event.target.value;
      renderMembers();
    });
  }

  function unlockAdminAccess() {
    var key = '';
    if ($('member-admin-key-gate')) key = $('member-admin-key-gate').value.trim();
    if (!key && $('member-admin-key')) key = $('member-admin-key').value.trim();
    if (!key) {
      setText('admin-gate-msg', '관리자 키를 입력해주세요.', 'err');
      setAdminAccess(false);
      return;
    }
    setStored(KEYS.adminKey, key);
    syncAdminKeys(key);
    setText('admin-gate-msg', '', '');
    setAdminAccess(true);
    loadMembers();
  }

  function initAccessGate() {
    var unlock = $('unlock-admin');
    if (unlock) {
      unlock.addEventListener('click', unlockAdminAccess);
    }
    if ($('member-admin-key-gate')) {
      $('member-admin-key-gate').addEventListener('keydown', function (event) {
        if (event.key === 'Enter') {
          event.preventDefault();
          unlockAdminAccess();
        }
      });
    }
    if (getAdminKey()) {
      setAdminAccess(true);
      return true;
    }
    setAdminAccess(false);
    return false;
  }

  function collectAdminConfig() {
    return {
      gasUrl: $('member-gas-url').value.trim(),
      adminKey: $('member-admin-key').value.trim(),
      period: $('member-period').value.trim(),
      memo: $('member-memo').value.trim()
    };
  }

  function updateSummary(summary) {
    $('admin-total').textContent = summary.total || 0;
    $('admin-pending').textContent = summary.pending || 0;
    $('admin-approved').textContent = summary.approved || 0;
    $('admin-rejected').textContent = summary.rejected || 0;
  }

  function renderMembers() {
    var rows = state.members.filter(function (member) {
      return state.filter === 'ALL' || member.status === state.filter;
    });

    if (!rows.length) {
      $('admin-members-table').innerHTML = '<div class="m-admin-empty">표시할 회원가입 신청이 없습니다.<br />필터를 바꾸거나 새로고침해서 다시 확인해 주세요.</div>';
      return;
    }

    var html = '<div class="m-admin-table-wrap"><table class="m-admin-table"><thead><tr>'
      + '<th>신청자</th>'
      + '<th>신청일</th>'
      + '<th>연락처 / 지역</th>'
      + '<th>업체 / 목적</th>'
      + '<th>상태</th>'
      + '<th>회원기간 / 메모</th>'
      + '<th>처리</th>'
      + '</tr></thead><tbody>';

    rows.forEach(function (member) {
      html += '<tr>'
        + '<td><strong>' + escapeHtml(member.name || '-') + '</strong>' + escapeHtml(member.email || '-') + '<br />' + escapeHtml(member.memberNo || '-') + '</td>'
        + '<td>' + escapeHtml(formatDate(member.createdAt)) + '</td>'
        + '<td>' + escapeHtml(member.phone || '-') + '<br />' + escapeHtml(member.region || '-') + '</td>'
        + '<td><strong>' + escapeHtml(member.businessName || '미입력') + '</strong>' + escapeHtml(member.businessType || '-') + '<br />' + escapeHtml(member.role || '-') + '</td>'
        + '<td><span class="m-admin-status ' + statusClass(member.status) + '">' + statusLabel(member.status) + '</span></td>'
        + '<td>' + escapeHtml(member.period || '-') + '<br />' + escapeHtml(member.memo || '-') + '</td>'
        + '<td><div class="m-admin-inline-actions">'
        + '<button type="button" class="m-btn m-btn--ghost" data-action="approve" data-email="' + escapeHtml(member.email || '') + '">승인</button>'
        + '<button type="button" class="m-btn m-btn--ghost" data-action="reject" data-email="' + escapeHtml(member.email || '') + '">반려</button>'
        + '</div></td>'
        + '</tr>';
    });

    html += '</tbody></table></div>';
    $('admin-members-table').innerHTML = html;

    Array.prototype.forEach.call(document.querySelectorAll('[data-action="approve"]'), function (button) {
      button.addEventListener('click', function () {
        submitMemberAction('adminApproveMember', button.getAttribute('data-email'));
      });
    });

    Array.prototype.forEach.call(document.querySelectorAll('[data-action="reject"]'), function (button) {
      button.addEventListener('click', function () {
        submitMemberAction('adminRejectMember', button.getAttribute('data-email'));
      });
    });
  }

  async function loadMembers() {
    var config = collectAdminConfig();
    if (!config.gasUrl) {
      setText('admin-members-msg', '회원 Apps Script URL을 먼저 입력해주세요.', 'err');
      return;
    }
    if (!config.adminKey) {
      setText('admin-members-msg', '관리자 키를 입력해주세요.', 'err');
      return;
    }

    saveConfig();
    setText('admin-members-msg', '회원가입 신청 목록을 불러오는 중입니다...', 'warn');

    try {
      var result = await jsonp(config.gasUrl, {
        action: 'adminListMembers',
        adminKey: config.adminKey
      });
      if (!result.ok) throw new Error(result.message || '회원 목록을 불러오지 못했습니다.');
      state.members = result.members || [];
      updateSummary(result.summary || {});
      renderMembers();
      setText('admin-members-msg', '회원가입 신청 목록을 불러왔습니다.', 'ok');
    } catch (error) {
      updateSummary({ total: 0, pending: 0, approved: 0, rejected: 0 });
      $('admin-members-table').innerHTML = '<div class="m-admin-empty">회원 목록을 불러오지 못했습니다.<br />Apps Script URL과 관리자 키를 다시 확인해 주세요.</div>';
      setText('admin-members-msg', error.message, 'err');
    }
  }

  async function submitMemberAction(action, email) {
    var config = collectAdminConfig();
    if (!config.gasUrl || !config.adminKey) {
      setText('admin-members-msg', '승인 또는 반려 전 운영 연결 설정을 먼저 저장해주세요.', 'err');
      return;
    }
    if (action === 'adminApproveMember' && !config.period) {
      setText('admin-members-msg', '승인 처리 전에 기본 회원기간을 입력해주세요.', 'err');
      return;
    }
    if (action === 'adminRejectMember' && !config.memo) {
      setText('admin-members-msg', '반려 처리 전에 메모 / 반려 사유를 입력해주세요.', 'err');
      return;
    }

    setText('admin-members-msg', '회원 상태를 업데이트하는 중입니다...', 'warn');

    try {
      var result = await jsonp(config.gasUrl, {
        action: action,
        adminKey: config.adminKey,
        email: email,
        period: config.period,
        memo: config.memo
      });
      if (!result.ok) throw new Error(result.message || '상태 업데이트에 실패했습니다.');
      setText('admin-members-msg', result.message || '상태를 업데이트했습니다.', 'ok');
      loadMembers();
    } catch (error) {
      setText('admin-members-msg', error.message, 'err');
    }
  }

  document.addEventListener('DOMContentLoaded', function () {
    initInputs();
    if (initAccessGate()) {
      loadMembers();
    }
  });
})();
