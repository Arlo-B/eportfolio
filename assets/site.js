/* ------------------------------------------------------------------
   Shared behaviour for the portfolio.

   Five pieces of state, held in the URL so they survive navigation:

     ?cat=fsae      kind of work   (all | work | fsae | uni | personal)
     ?skill=welding skill          (all | any SKILLS id)
     ?sort=new      order          (new | old | type)
     ?view=short    resume detail  (long | short)
     ?pics=on       resume photos  (off | on)

   Kind of work and skill live in the side panel. Order, detail and
   photos are one press controls in the top bar.
   ------------------------------------------------------------------ */

(function () {
  'use strict';

  var SKILLS = window.SKILLS || [];
  var CATS   = window.CATEGORIES || [];
  var ALL    = window.ENTRIES || [];

  var SORTS = [
    { id: 'new',  label: 'Newest' },
    { id: 'old',  label: 'Oldest' },
    { id: 'type', label: 'By type' }
  ];
  var VIEWS = [
    { id: 'long',  label: 'Full' },
    { id: 'short', label: 'Summary' }
  ];
  var PICS = [
    { id: 'off', label: 'Hide' },
    { id: 'on',  label: 'Show' }
  ];

  var state = { skill: 'all', cat: 'all', sort: 'new', view: 'long', pics: 'off' };

  /* ---------- helpers ---------- */

  function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }
  function attr(s) { return String(s).replace(/"/g, '&quot;'); }

  function skillLabel(id) {
    for (var i = 0; i < SKILLS.length; i++) if (SKILLS[i].id === id) return SKILLS[i].label;
    return 'All work';
  }
  function cat(id) {
    for (var i = 0; i < CATS.length; i++) if (CATS[i].id === id) return CATS[i];
    return { label: 'All work', note: '' };
  }
  function catIndex(id) {
    for (var i = 0; i < CATS.length; i++) if (CATS[i].id === id) return i;
    return 99;
  }
  function store(k, v) {
    try { if (v === undefined) return window.localStorage.getItem(k);
          window.localStorage.setItem(k, v); } catch (e) { return null; }
  }

  /* ---------- URL state ---------- */

  function readState() {
    var q = window.location.search;
    var s = { skill: 'all', cat: 'all', sort: 'new', view: 'long', pics: 'off' };
    function pick(name, list, key) {
      var r = new RegExp('[?&]' + name + '=([a-z]+)').exec(q);
      if (!r) return;
      for (var i = 0; i < list.length; i++) if (list[i].id === r[1]) s[key] = r[1];
    }
    pick('skill', SKILLS, 'skill');
    pick('cat', CATS, 'cat');
    pick('sort', SORTS, 'sort');
    pick('view', VIEWS, 'view');
    pick('pics', PICS, 'pics');
    return s;
  }

  function query(s) {
    var p = [];
    if (s.cat !== 'all')   p.push('cat=' + s.cat);
    if (s.skill !== 'all') p.push('skill=' + s.skill);
    if (s.sort !== 'new')  p.push('sort=' + s.sort);
    if (s.view !== 'long') p.push('view=' + s.view);
    if (s.pics !== 'off')  p.push('pics=' + s.pics);
    return p.length ? '?' + p.join('&') : '';
  }

  function propagate() {
    var q = query(state);
    var links = document.querySelectorAll('a[href*=".html"]');
    for (var i = 0; i < links.length; i++) {
      var href = links[i].getAttribute('href');
      if (/^https?:/.test(href)) continue;
      var hash = href.indexOf('#') > -1 ? href.slice(href.indexOf('#')) : '';
      links[i].setAttribute('href', href.split('?')[0].split('#')[0] + q + hash);
    }
  }

  function update(patch) {
    for (var k in patch) if (patch.hasOwnProperty(k)) state[k] = patch[k];
    var base = window.location.pathname.split('/').pop() || 'index.html';
    var url = base + query(state);
    if (window.history && window.history.replaceState) {
      window.history.replaceState({}, '', url);
      apply();
    } else {
      window.location.href = url;
    }
  }

  /* ---------- selection ---------- */

  function selected() {
    var out = ALL.filter(function (e) {
      if (state.cat !== 'all' && e.cat !== state.cat) return false;
      if (state.skill !== 'all' && e.skills.indexOf(state.skill) < 0) return false;
      return true;
    });
    /* roles read first inside a year, they give the context for the projects */
    function kindRank(e) { return e.kind === 'role' ? 0 : 1; }
    return out.sort(function (a, b) {
      if (state.sort === 'type') {
        var d = catIndex(a.cat) - catIndex(b.cat);
        if (d) return d;                       /* one block per kind of work */
        if (a.from !== b.from) return a.from - b.from;   /* beginning to now */
        if (kindRank(a) !== kindRank(b)) return kindRank(a) - kindRank(b);
        return a.to - b.to;
      }
      if (state.sort === 'old') {
        if (a.from !== b.from) return a.from - b.from;
        if (kindRank(a) !== kindRank(b)) return kindRank(a) - kindRank(b);
        return a.to - b.to;
      }
      if (a.from !== b.from) return b.from - a.from;
      if (kindRank(a) !== kindRank(b)) return kindRank(a) - kindRank(b);
      return b.to - a.to;
    });
  }

  /* ---------- top bar controls ---------- */

  function buildTopbar() {
    var host = document.querySelector('[data-topbar]');
    if (!host) return;
    var onResume = !!document.querySelector('[data-entries]');

    var h = seg('sort', 'Order', SORTS);
    if (onResume) {
      h += seg('view', 'Detail', VIEWS);
      h += seg('pics', 'Photos', PICS);
    }
    host.innerHTML = h;

    host.addEventListener('click', function (e) {
      var b = e.target.closest ? e.target.closest('.seg button') : null;
      if (!b) return;
      var patch = {};
      patch[b.getAttribute('data-key')] = b.getAttribute('data-val');
      update(patch);
    });
  }

  function seg(key, label, list) {
    var h = '<div class="seg" data-seg="' + key + '"><span class="seg-l">' + label + '</span>' +
            '<div class="seg-b" role="group" aria-label="' + label + '">';
    for (var i = 0; i < list.length; i++) {
      h += '<button type="button" data-key="' + key + '" data-val="' + list[i].id +
           '" aria-pressed="false">' + list[i].label + '</button>';
    }
    return h + '</div></div>';
  }

  /* ---------- side panel ---------- */

  function buildPanel() {
    var host = document.querySelector('[data-filterbar]');
    if (!host) return;

    var h = '<div class="filterbar-in">';
    h += '<button class="rail-close" type="button" data-rail-close aria-label="Hide the filters">' +
         '<span aria-hidden="true">&#8249;</span> Hide</button>';

    h += '<div class="filter-label">Kind of work</div><div class="chips" data-group="cat">';
    h += chip('cat', 'all', 'All work');
    for (var i = 0; i < CATS.length; i++) h += chip('cat', CATS[i].id, CATS[i].label);
    h += '</div>';

    h += '<div class="filter-label">Skill</div><div class="chips tight" data-group="skill">';
    for (var j = 0; j < SKILLS.length; j++) h += chip('skill', SKILLS[j].id, SKILLS[j].label);
    h += '</div>';

    h += '<div class="filter-note" data-note></div></div>';
    host.innerHTML = h;

    host.addEventListener('click', function (e) {
      var t = e.target;
      if (t.closest && t.closest('[data-rail-close]')) { setRail(false); return; }
      var btn = t.closest ? t.closest('.chip') : null;
      if (!btn) return;
      var g = btn.getAttribute('data-group'), v = btn.getAttribute('data-val');
      var patch = {};
      patch[g] = (state[g] === v) ? 'all' : v;
      update(patch);
    });
  }

  function chip(group, val, label) {
    return '<button class="chip" type="button" data-group="' + group + '" data-val="' + val +
           '" aria-pressed="false">' + label + '</button>';
  }

  /* ---------- rail open / closed ---------- */

  function setRail(open) {
    document.body.classList.toggle('rail-closed', !open);
    var t = document.querySelector('[data-rail-open]');
    if (t) t.setAttribute('aria-expanded', String(open));
    store('ab-rail', open ? 'open' : 'closed');
  }

  function buildRailToggle() {
    var b = document.createElement('button');
    b.className = 'rail-open';
    b.type = 'button';
    b.setAttribute('data-rail-open', '');
    b.setAttribute('aria-expanded', 'true');
    b.innerHTML = '<span aria-hidden="true">&#9776;</span><span>Filters</span>';
    b.addEventListener('click', function () {
      setRail(document.body.classList.contains('rail-closed'));
    });
    document.body.appendChild(b);
    var saved = store('ab-rail');
    var wide = window.matchMedia && window.matchMedia('(min-width:1100px)').matches;
    setRail(saved ? saved === 'open' : wide);
  }

  /* ---------- shared fragments ---------- */

  function tagRow(e) {
    var h = '<span class="tags"><span class="tag-cat">' + cat(e.cat).label + '</span>';
    for (var i = 0; i < e.skills.length; i++) h += '<span>' + skillLabel(e.skills[i]) + '</span>';
    return h + '</span>';
  }

  function figure(p, wideOk) {
    var cls = 'shot' + (p.wide && wideOk !== false ? ' wide' : '');
    var date = p.d ? '<span class="shot-date">' + esc(p.d) + '</span>' : '';
    return '<figure class="' + cls + '">' +
      '<a href="images/' + p.f + '" target="_blank" rel="noopener">' +
      '<img src="images/' + p.f + '" alt="' + attr(p.c) + '" loading="lazy"></a>' +
      '<figcaption>' + esc(p.c) + date + '</figcaption></figure>';
  }

  function bandFor(list, i, withStats) {
    var e = list[i], prev = i ? list[i - 1] : null;
    var out = '';
    if (state.sort === 'type') {
      if (!prev || prev.cat !== e.cat) {
        var c = cat(e.cat);
        out += '<div class="band"><h3>' + c.label + '</h3><p>' + esc(c.note) + '</p>' +
               (withStats ? statBlock(c) : '') + '</div>';
      }
      if (!prev || prev.cat !== e.cat || prev.from !== e.from) {
        out += '<div class="band year sub"><h3>' + e.from + '</h3></div>';
      }
      return out;
    }
    if (!prev || prev.from !== e.from) {
      out += '<div class="band year"><h3>' + e.from + '</h3></div>';
    }
    return out;
  }

  function statBlock(c) {
    if (!c.stats) return '';
    var h = '<div class="stats">';
    for (var i = 0; i < c.stats.length; i++) {
      h += '<div class="stat"><b>' + c.stats[i].n + '</b><span>' + esc(c.stats[i].s) + '</span></div>';
    }
    return h + '</div>';
  }

  function categoryIntro() {
    var host = document.querySelector('[data-catintro]');
    if (!host) return;
    /* in type order the bands already carry the category heading */
    if (state.cat === 'all' || state.sort === 'type') { host.innerHTML = ''; return; }
    var c = cat(state.cat);
    host.innerHTML = '<div class="band"><h3>' + c.label + '</h3><p>' + esc(c.note) + '</p>' +
                     statBlock(c) + '</div>';
  }

  /* ---------- experience page: one bordered card per project ---------- */

  function renderExperience() {
    var host = document.querySelector('[data-gallery]');
    if (!host) return 0;
    var list = selected().filter(function (e) { return e.photos && e.photos.length; });
    var h = '<div class="projgrid">', shots = 0;

    for (var i = 0; i < list.length; i++) {
      var e = list[i];
      h += bandFor(list, i, state.cat === 'all');
      h += '<article class="projcard' + (e.photos.length > 4 ? ' is-wide' : '') +
           '" id="' + e.id + '">' +
           '<div class="pc-head">' +
             '<div class="pc-id"><h4>' + esc(e.title) + '</h4>' +
             '<span class="pc-meta">' + esc(e.org) + ' &middot; ' + esc(e.when) + '</span></div>' +
             tagRow(e) +
           '</div>' +
           '<p class="pc-sum">' + esc(e.summary) + '</p>';
      if (e.link) {
        h += '<p class="grouplink"><a href="' + attr(e.link.href) + '" target="_blank" rel="noopener">' +
             esc(e.link.label) + '</a></p>';
      }
      h += '<div class="gallery">';
      for (var p = 0; p < e.photos.length; p++) { h += figure(e.photos[p]); shots++; }
      h += '</div></article>';
    }
    h += '</div>';

    host.innerHTML = list.length ? h : '<p class="empty">Nothing photographed under that combination yet. ' +
                          'The resume still lists the work.</p>';
    var c = document.querySelector('[data-count]');
    if (c) c.textContent = shots + ' photographs across ' + list.length + ' pieces of work';
    return list.length;
  }

  /* ---------- resume page ---------- */

  function renderResume() {
    var host = document.querySelector('[data-entries]');
    if (!host) return 0;
    var list = selected();
    var short = state.view === 'short';
    var showPics = state.pics === 'on';
    host.classList.toggle('is-summary', short);
    var h = '';

    for (var i = 0; i < list.length; i++) {
      var e = list[i];
      h += bandFor(list, i, state.cat === 'all');
      h += short ? summaryRow(e, showPics) : fullEntry(e, showPics);
    }
    host.innerHTML = h || '<p class="empty">No entries match that combination. Clear a filter to see more.</p>';

    bind(host, '[data-open]', function (btn) {
      var body = btn.parentNode.querySelector('[data-body]');
      var opening = body.hidden;
      body.hidden = !opening;
      btn.setAttribute('aria-expanded', String(opening));
      btn.parentNode.classList.toggle('open', opening);
    });
    bind(host, '[data-pics]', function (btn) {
      var g = btn.closest('.entry').querySelector('[data-entrypics]');
      var opening = g.hidden;
      g.hidden = !opening;
      btn.setAttribute('aria-expanded', String(opening));
      btn.textContent = opening ? 'Hide photos'
        : g.children.length + ' photo' + (g.children.length === 1 ? '' : 's');
    });
    return list.length;
  }

  function bulletList(e) {
    var h = '<ul>';
    for (var b = 0; b < e.bullets.length; b++) {
      var bu = e.bullets[b];
      var hit = state.skill !== 'all' && bu.s && bu.s.indexOf(state.skill) > -1;
      h += '<li' + (hit ? ' class="hit"' : '') + '>' + esc(bu.t) + '</li>';
    }
    return h + '</ul>';
  }

  function extras(e, showPics) {
    var h = '';
    var acts = '';
    if (e.photos && e.photos.length && !showPics) {
      acts += '<button class="pill" type="button" data-pics aria-expanded="false">' +
              e.photos.length + ' photo' + (e.photos.length === 1 ? '' : 's') + '</button>';
    }
    if (e.link) {
      acts += '<a class="pill link" href="' + attr(e.link.href) + '" target="_blank" rel="noopener">' +
              esc(e.link.label) + '</a>';
    }
    if (acts) h += '<div class="acts">' + acts + '</div>';
    if (e.photos && e.photos.length) {
      h += '<div class="gallery mini"' + (showPics ? '' : ' hidden') + ' data-entrypics>';
      for (var q = 0; q < e.photos.length; q++) h += figure(e.photos[q], false);
      h += '</div>';
    }
    return h;
  }

  function fullEntry(e, showPics) {
    return '<div class="entry' + (e.kind === 'role' ? ' is-role' : '') + '" id="r-' + e.id + '">' +
      '<div class="role"><strong>' + esc(e.title) + '</strong><span>' + esc(e.when) + '</span></div>' +
      '<div class="entry-org">' + esc(e.org) +
      '<em class="entry-kind">' + (e.kind === 'role' ? 'Role' : 'Project') + '</em></div>' +
      bulletList(e) + extras(e, showPics) + '</div>';
  }

  /* Summary: the title and nothing else, until you open it. */
  function summaryRow(e, showPics) {
    return '<div class="entry sum' + (e.kind === 'role' ? ' is-role' : '') + '" id="r-' + e.id + '">' +
      '<button class="sumrow" type="button" data-open aria-expanded="false">' +
        '<span class="sum-c" aria-hidden="true"></span>' +
        '<span class="sum-t">' + esc(e.title) + '</span>' +
        '<span class="sum-o">' + esc(e.org) + '</span>' +
        '<span class="sum-w">' + esc(e.when) + '</span>' +
      '</button>' +
      '<div class="sumbody" data-body hidden>' + bulletList(e) + extras(e, showPics) + '</div>' +
      '</div>';
  }

  function bind(root, sel, fn) {
    var els = root.querySelectorAll(sel);
    for (var i = 0; i < els.length; i++) {
      els[i].addEventListener('click', function () { fn(this); });
    }
  }

  /* ---------- landing page strip ---------- */

  function renderFeatured() {
    var host = document.querySelector('[data-featured]');
    if (!host) return;
    var byFile = {};
    for (var a = 0; a < ALL.length; a++) {
      for (var b = 0; b < ALL[a].photos.length; b++) byFile[ALL[a].photos[b].f] = ALL[a].photos[b];
    }
    var pics = [];
    if (state.cat === 'all' && state.skill === 'all') {
      var want = window.FEATURED || [];
      for (var w = 0; w < want.length; w++) if (byFile[want[w]]) pics.push(byFile[want[w]]);
    } else {
      var list = selected();
      for (var i = 0; i < list.length && pics.length < 8; i++) {
        if (list[i].photos.length) pics.push(list[i].photos[0]);
      }
    }
    var h = '';
    for (var p = 0; p < pics.length; p++) h += figure(pics[p], false);
    host.innerHTML = h;
  }

  /* ---------- static prose highlighting ---------- */

  function highlightProse() {
    var blocks = document.querySelectorAll('[data-skills]');
    var hits = 0;
    for (var i = 0; i < blocks.length; i++) {
      var tags = (blocks[i].getAttribute('data-skills') || '').split(/\s+/);
      var hit = state.skill !== 'all' && tags.indexOf(state.skill) > -1;
      blocks[i].classList.toggle('hit', hit);
      if (hit) hits++;
    }
    document.body.classList.toggle('filtering', state.skill !== 'all' && blocks.length > 0);
    return hits;
  }

  /* ---------- sync controls ---------- */

  function syncControls(count) {
    var chips = document.querySelectorAll('.chip');
    for (var i = 0; i < chips.length; i++) {
      var g = chips[i].getAttribute('data-group');
      chips[i].setAttribute('aria-pressed', String(chips[i].getAttribute('data-val') === state[g]));
    }
    var segs = document.querySelectorAll('.seg button');
    for (var s = 0; s < segs.length; s++) {
      segs[s].setAttribute('aria-pressed',
        String(segs[s].getAttribute('data-val') === state[segs[s].getAttribute('data-key')]));
    }

    var note = document.querySelector('[data-note]');
    if (!note) return;
    var bits = [];
    if (state.cat !== 'all')   bits.push('<b>' + cat(state.cat).label + '</b>');
    if (state.skill !== 'all') bits.push('<b>' + skillLabel(state.skill) + '</b>');

    if (!bits.length) { note.innerHTML = ''; return; }
    note.innerHTML = 'Filtered to ' + bits.join(' and ') + '. ' + count +
      ' item' + (count === 1 ? '' : 's') + '.' +
      '<button type="button" data-clear>Clear filters</button>';
    var clear = note.querySelector('[data-clear]');
    if (clear) clear.addEventListener('click', function () { update({ cat: 'all', skill: 'all' }); });
  }

  /* ---------- boot ---------- */

  function apply() {
    var count = 0;
    if (document.querySelector('[data-gallery]')) count = renderExperience();
    if (document.querySelector('[data-entries]')) count = renderResume();
    categoryIntro();
    renderFeatured();
    highlightProse();
    syncControls(count);
    propagate();
  }

  document.addEventListener('DOMContentLoaded', function () {
    state = readState();
    buildTopbar();
    buildPanel();
    buildRailToggle();

    var here = (window.location.pathname.split('/').pop() || 'index.html').toLowerCase();
    var links = document.querySelectorAll('.nav-links a');
    for (var i = 0; i < links.length; i++) {
      if (links[i].getAttribute('href').split('?')[0].toLowerCase() === here) {
        links[i].classList.add('current');
      }
    }
    apply();

    if (window.location.hash) {
      var el = document.getElementById(window.location.hash.slice(1));
      if (el) el.scrollIntoView();
    }
  });
})();
