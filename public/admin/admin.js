(function () {
  'use strict';

  var state = { page: 1, pageSize: 50, q: '', status: 'all', matched: 0 };
  var $ = function (id) { return document.getElementById(id); };
  var headers = { 'Content-Type': 'application/json', 'X-TSC-Admin': '1' };

  function show(view) {
    ['login-view', 'setup-view', 'app-view'].forEach(function (id) { $(id).hidden = id !== view; });
    $('logout').hidden = view !== 'app-view';
  }

  function api(path, options) {
    return fetch(path, Object.assign({ credentials: 'same-origin', cache: 'no-store' }, options || {})).then(function (res) {
      return res.json().catch(function () { return {}; }).then(function (body) { return { status: res.status, body: body }; });
    });
  }

  function fmtDate(value) {
    if (!value) return '';
    var d = new Date(value);
    return isNaN(d) ? '' : d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
  }

  function cell(text, className) {
    var td = document.createElement('td');
    if (className) td.className = className;
    td.textContent = text;
    return td;
  }

  function render(data) {
    var c = data.counts || {};
    $('stat-total').textContent = c.total != null ? c.total : '–';
    $('stat-active').textContent = c.active != null ? c.active : '–';
    $('stat-unsub').textContent = c.unsubscribed != null ? c.unsubscribed : '–';
    $('stat-30').textContent = c.last30 != null ? c.last30 : '–';
    state.matched = data.matched || 0;

    var tbody = $('rows');
    tbody.textContent = '';
    (data.items || []).forEach(function (row) {
      var tr = document.createElement('tr');
      tr.appendChild(cell(row.email, 'email'));
      tr.appendChild(cell(row.source || '—'));
      tr.appendChild(cell(fmtDate(row.subscribedAt), 'when'));
      var statusTd = document.createElement('td');
      var pill = document.createElement('span');
      pill.className = 'pill ' + (row.unsubscribed ? 'pill--off' : 'pill--on');
      pill.textContent = row.unsubscribed ? 'Unsubscribed' : 'Subscribed';
      statusTd.appendChild(pill);
      tr.appendChild(statusTd);
      var actionTd = document.createElement('td');
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'btn btn--ghost row-btn';
      btn.textContent = row.unsubscribed ? 'Resubscribe' : 'Unsubscribe';
      btn.setAttribute('aria-label', btn.textContent + ' ' + row.email);
      btn.addEventListener('click', function () { toggle(row, btn); });
      actionTd.appendChild(btn);
      tr.appendChild(actionTd);
      tbody.appendChild(tr);
    });
    $('empty').hidden = (data.items || []).length > 0;
    var pages = Math.max(1, Math.ceil(state.matched / state.pageSize));
    $('page-info').textContent = 'Page ' + state.page + ' of ' + pages + ' · ' + state.matched + ' shown by filter';
    $('prev').disabled = state.page <= 1;
    $('next').disabled = state.page >= pages;
    var params = new URLSearchParams({ format: 'csv', q: state.q, status: state.status });
    $('export').href = '/api/admin/subscribers?' + params.toString();
  }

  function load() {
    $('app-error').hidden = true;
    var params = new URLSearchParams({ q: state.q, status: state.status, page: String(state.page), pageSize: String(state.pageSize) });
    return api('/api/admin/subscribers?' + params.toString()).then(function (r) {
      if (r.status === 401) { show('login-view'); return; }
      if (r.status !== 200) { $('app-error').textContent = r.body.error || 'Could not load subscribers.'; $('app-error').hidden = false; return; }
      render(r.body);
    }).catch(function () { $('app-error').textContent = 'Network error. Try again.'; $('app-error').hidden = false; });
  }

  function toggle(row, btn) {
    btn.disabled = true;
    api('/api/admin/subscribers', { method: 'PATCH', headers: headers, body: JSON.stringify({ id: row.id, unsubscribed: !row.unsubscribed }) })
      .then(function (r) {
        if (r.status === 401) { show('login-view'); return; }
        if (r.status !== 200) { $('app-error').textContent = r.body.error || 'Update failed.'; $('app-error').hidden = false; btn.disabled = false; return; }
        load();
      });
  }

  function boot() {
    api('/api/admin/session').then(function (r) {
      if (!r.body.configured) { show('setup-view'); return; }
      if (r.body.authenticated) { show('app-view'); load(); } else { show('login-view'); $('password').focus(); }
    });

    $('login-form').addEventListener('submit', function (e) {
      e.preventDefault();
      var err = $('login-error');
      err.hidden = true;
      var submit = e.target.querySelector('button[type="submit"]');
      submit.disabled = true;
      api('/api/admin/login', { method: 'POST', headers: headers, body: JSON.stringify({ password: $('password').value }) })
        .then(function (r) {
          submit.disabled = false;
          if (r.status === 200) { $('password').value = ''; show('app-view'); load(); return; }
          err.textContent = r.body.error || 'Sign in failed.';
          err.hidden = false;
        });
    });

    $('logout').addEventListener('click', function () {
      api('/api/admin/logout', { method: 'POST', headers: headers }).then(function () { show('login-view'); });
    });

    var timer;
    $('q').addEventListener('input', function () {
      clearTimeout(timer);
      timer = setTimeout(function () { state.q = $('q').value; state.page = 1; load(); }, 250);
    });
    $('filters').addEventListener('submit', function (e) { e.preventDefault(); });
    $('status').addEventListener('change', function () { state.status = $('status').value; state.page = 1; load(); });
    $('prev').addEventListener('click', function () { if (state.page > 1) { state.page -= 1; load(); } });
    $('next').addEventListener('click', function () { state.page += 1; load(); });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
