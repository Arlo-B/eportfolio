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
    { id: 'org', label: 'By organisation' },
    { id: 'new', label: 'Newest' },
    { id: 'old', label: 'Oldest' }
  ];
  var VIEWS = [
    { id: 'lead',  label: 'Roles' },
    { id: 'long',  label: 'Full' },
    { id: 'short', label: 'Summary' }
  ];

  /* Organisation grouping. Roles and projects for one team are spread across a
     few spellings of org, so the key is normalised; subjects stay on the
     project as a label rather than becoming a group of one. */
  function orgKey(e) {
    if (e.cat === 'uni') return 'uts';
    if (e.cat === 'personal') return 'personal';
    return e.org.replace(/\s*\(Formula SAE\)/, '').replace(/^UTS and /, '')
            .toLowerCase().replace(/[^a-z0-9]+/g, '-');
  }
  function orgName(e) {
    if (e.cat === 'uni') return 'University of Technology Sydney';
    if (e.cat === 'personal') return 'Personal projects';
    if (orgKey(e) === 'uts-motorsports') return 'UTS Motorsports, Formula SAE';
    return e.org;
  }
  /* the line under a project: its subject, or who it was built with */
  function subLabel(e) {
    if (e.cat === 'uni' || e.cat === 'personal') return e.org.replace(/,\s*UTS$/, '');
    return '';
  }
  function yearOf(e) { return e.to === 9999 ? e.from : e.to; }
  function spanLabel(list) {
    var f = 9999, t = 0;
    for (var i = 0; i < list.length; i++) {
      if (list[i].from < f) f = list[i].from;
      if (list[i].to > t) t = list[i].to;
    }
    return f + (t === 9999 ? ' to present' : (t === f ? '' : ' to ' + t));
  }
  var PICS = [
    { id: 'off', label: 'Hide' },
    { id: 'on',  label: 'Show' }
  ];

  var state = { skill: 'all', cat: 'all', sort: 'org', view: 'lead', pics: 'off' };

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
    var s = { skill: 'all', cat: 'all', sort: 'org', view: 'lead', pics: 'off' };
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
    if (s.sort !== 'org')  p.push('sort=' + s.sort);
    if (s.view !== 'lead') p.push('view=' + s.view);
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

  function tagRow(e, noCat) {
    /* inside an organisation group the category chip only repeats the heading */
    var h = '<span class="tags">' +
            (noCat ? '' : '<span class="tag-cat">' + cat(e.cat).label + '</span>');
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

  function bandFor(list, i) {
    var e = list[i], prev = i ? list[i - 1] : null;
    var out = '';
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
    /* every group carries its own heading, note and stats */
    if (state.cat === 'all' || state.sort === 'org') { host.innerHTML = ''; return; }
    var c = cat(state.cat);
    host.innerHTML = '<div class="band"><h3>' + c.label + '</h3><p>' + esc(c.note) + '</p>' +
                     statBlock(c) + '</div>';
  }

  /* ---------- experience page: one bordered card per project ---------- */

  function projCard(e, opts) {
    opts = opts || {};
    var meta = opts.tree ? (subLabel(e) ? subLabel(e) + ' &middot; ' + esc(e.when) : esc(e.when))
                         : esc(e.org) + ' &middot; ' + esc(e.when);
    var h = '<article class="projcard' + (e.photos.length > 4 ? ' is-wide' : '') +
      (opts.cls ? ' ' + opts.cls : '') + '" id="' + e.id + '">' +
      '<div class="pc-head">' +
        '<div class="pc-id"><h4>' + esc(e.title) + '</h4>' +
        '<span class="pc-meta">' + meta + '</span></div>' +
        tagRow(e, !!opts.tree) +
      '</div>' +
      '<p class="pc-sum">' + esc(e.summary) + '</p>';
    if (e.link) {
      h += '<p class="grouplink"><a href="' + attr(e.link.href) + '" target="_blank" rel="noopener">' +
           esc(e.link.label) + '</a></p>';
    }
    h += '<div class="gallery">';
    for (var p = 0; p < e.photos.length; p++) h += figure(e.photos[p]);
    return h + '</div></article>';
  }

  function cardGrid(list, byYear) {
    if (!list.length) return '';
    var h = '<div class="og-kids"><div class="projgrid">', prev = null;
    for (var i = 0; i < list.length; i++) {
      if (byYear && yearOf(list[i]) !== prev) {
        prev = yearOf(list[i]);
        h += '<div class="band year sub"><h3>' + prev + '</h3></div>';
      }
      h += projCard(list[i], { tree: true });
    }
    return h + '</div></div>';
  }

  /* the gallery grouped the same way as the resume: the organisation, the role
     that ran the period, then the photographed projects under it */
  function renderGalleryTree(list) {
    var groups = groupByOrg(list), h = '';
    for (var g = 0; g < groups.length; g++) {
      var grp = groups[g];
      h += '<section class="og">' +
           '<div class="og-head"><h3>' + esc(grp.name) + '</h3>' +
           '<span class="og-when">' + esc(grp.when) + '</span></div>' +
           (grp.note ? '<p class="og-note">' + esc(grp.note) + '</p>' : '') +
           statBlock(cat(grp.cat));
      for (var r = 0; r < grp.roles.length; r++) {
        h += '<div class="og-role">' + projCard(grp.roles[r], { tree: true, cls: 'is-role' }) +
             cardGrid(grp.roles[r].kids, false) + '</div>';
      }
      h += cardGrid(grp.loose, true) + '</section>';
    }
    return h;
  }

  function renderExperience() {
    var host = document.querySelector('[data-gallery]');
    if (!host) return 0;
    var list = selected().filter(function (e) { return e.photos && e.photos.length; });
    var shots = 0;
    for (var s = 0; s < list.length; s++) shots += list[s].photos.length;

    var h;
    if (state.sort === 'org') {
      h = renderGalleryTree(list);
    } else {
      h = '<div class="projgrid">';
      for (var i = 0; i < list.length; i++) h += bandFor(list, i) + projCard(list[i]);
      h += '</div>';
    }

    host.innerHTML = list.length ? h : '<p class="empty">Nothing photographed under that combination yet. ' +
                          'The resume still lists the work.</p>';
    var c = document.querySelector('[data-count]');
    if (c) c.textContent = shots + ' photographs across ' + list.length + ' pieces of work';
    return list.length;
  }

  /* ---------- resume page ---------- */

  /* ---------- resume, grouped by organisation ----------
     org > role > the projects done during that role > bullets.
     A project is owned by the latest role that had started by the project's
     last year; anything with no role over it falls into a year list at the
     bottom of the organisation, which is where university and personal work
     sits since it has no roles. */

  function groupByOrg(list) {
    var order = [], map = {};
    for (var i = 0; i < list.length; i++) {
      var e = list[i], k = e.cat + '/' + orgKey(e);
      if (!map[k]) { map[k] = { key: k, cat: e.cat, name: orgName(e), all: [] }; order.push(map[k]); }
      map[k].all.push(e);
    }
    order.sort(function (a, b) { return catIndex(a.cat) - catIndex(b.cat); });

    for (var g = 0; g < order.length; g++) {
      var grp = order[g];
      grp.when = spanLabel(grp.all);
      grp.note = cat(grp.cat).note;
      grp.roles = grp.all.filter(function (e) { return e.kind === 'role'; })
                    .sort(function (a, b) { return b.from - a.from || b.to - a.to; });
      var projects = grp.all.filter(function (e) { return e.kind !== 'role'; })
                    .sort(function (a, b) { return yearOf(b) - yearOf(a) || b.from - a.from; });
      for (var r = 0; r < grp.roles.length; r++) grp.roles[r].kids = [];
      grp.loose = [];
      for (var p = 0; p < projects.length; p++) {
        var owner = null, y = yearOf(projects[p]);
        for (var q = 0; q < grp.roles.length; q++) {
          if (grp.roles[q].from <= y) { owner = grp.roles[q]; break; }
        }
        if (owner) owner.kids.push(projects[p]); else grp.loose.push(projects[p]);
      }
    }
    return order;
  }

  function projectRow(e, mode, showPics) {
    var meta = subLabel(e);
    if (mode === 'long') {
      return '<div class="entry proj" id="r-' + e.id + '">' +
        '<div class="role"><strong>' + esc(e.title) + '</strong><span>' + esc(e.when) + '</span></div>' +
        (meta ? '<div class="entry-org">' + esc(meta) + '</div>' : '') +
        bulletList(e) + extras(e, showPics) + '</div>';
    }
    return '<div class="entry sum proj" id="r-' + e.id + '">' +
      '<button class="sumrow" type="button" data-open aria-expanded="false">' +
        '<span class="sum-c" aria-hidden="true"></span>' +
        '<span class="sum-t">' + esc(e.title) + '</span>' +
        '<span class="sum-o">' + esc(meta) + '</span>' +
        '<span class="sum-w">' + esc(e.when) + '</span>' +
      '</button>' +
      '<div class="sumbody" data-body hidden>' + bulletList(e) + extras(e, showPics) + '</div>' +
      '</div>';
  }

  function kidBlock(kids, mode, showPics, byYear) {
    if (!kids.length) return '';
    var h = '<div class="og-kids">', prev = null;
    for (var i = 0; i < kids.length; i++) {
      if (byYear && yearOf(kids[i]) !== prev) {
        prev = yearOf(kids[i]);
        h += '<div class="band year sub"><h3>' + prev + '</h3></div>';
      }
      h += projectRow(kids[i], mode, showPics);
    }
    return h + '</div>';
  }

  function renderTree(list, showPics) {
    var groups = groupByOrg(list);
    var mode = state.view === 'long' ? 'long' : 'short';
    var rolesOpen = state.view !== 'short';
    var h = '';

    for (var g = 0; g < groups.length; g++) {
      var grp = groups[g];
      h += '<section class="og">' +
           '<div class="og-head"><h3>' + esc(grp.name) + '</h3>' +
           '<span class="og-when">' + esc(grp.when) + '</span></div>' +
           (grp.note ? '<p class="og-note">' + esc(grp.note) + '</p>' : '');

      for (var r = 0; r < grp.roles.length; r++) {
        var role = grp.roles[r];
        h += '<div class="og-role">';
        if (rolesOpen) {
          h += '<div class="entry is-role" id="r-' + role.id + '">' +
               '<div class="role"><strong>' + esc(role.title) + '</strong>' +
               '<span>' + esc(role.when) + '</span></div>' +
               bulletList(role) + extras(role, showPics) + '</div>';
        } else {
          h += summaryRow(role, showPics);
        }
        h += kidBlock(role.kids, mode, showPics, false) + '</div>';
      }
      h += kidBlock(grp.loose, mode, showPics, true);
      h += '</section>';
    }
    return h;
  }

  function renderResume() {
    var host = document.querySelector('[data-entries]');
    if (!host) return 0;
    var list = selected();
    var short = state.view === 'short';
    var showPics = state.pics === 'on';
    host.classList.toggle('is-summary', short && state.sort !== 'org');
    host.classList.toggle('is-tree', state.sort === 'org');

    if (state.sort === 'org') {
      host.innerHTML = list.length ? renderTree(list, showPics)
        : '<p class="empty">No entries match that combination. Clear a filter to see more.</p>';
      wireResume(host);
      return list.length;
    }

    var h = '', open = false;

    /* entries sit in a .entrygroup per band so they flow in balanced columns
       instead of grid rows, which is what used to leave the large gaps */
    for (var i = 0; i < list.length; i++) {
      var e = list[i];
      var band = bandFor(list, i);
      if (band) {
        if (open) { h += '</div>'; open = false; }
        h += band;
      }
      if (!open) { h += '<div class="entrygroup">'; open = true; }
      h += short ? summaryRow(e, showPics) : fullEntry(e, showPics);
    }
    if (open) h += '</div>';
    host.innerHTML = h || '<p class="empty">No entries match that combination. Clear a filter to see more.</p>';
    wireResume(host);
    return list.length;
  }

  function wireResume(host) {
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
