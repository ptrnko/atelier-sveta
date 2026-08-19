/* Atelier Sveta — простий i18n-шар (FR головна, UK друга).
   Текст: <el data-i18n-fr="..." data-i18n-uk="...">  (innerHTML, дозволені <br>)
   Атрибути: data-i18n-<attr>-fr / -uk  (attr: alt, placeholder, title, aria-label)
   Динаміка (JS-рендери) слухають подію 'as:langchange'. */
(function () {
  var LANGS = ['fr', 'uk'];
  var DEFAULT_LANG = 'fr';
  var STORE_KEY = 'as-lang';
  var ATTRS = ['alt', 'placeholder', 'title', 'aria-label'];

  function stored() {
    try { var l = localStorage.getItem(STORE_KEY); return LANGS.indexOf(l) > -1 ? l : null; }
    catch (e) { return null; }
  }
  function current() { return stored() || DEFAULT_LANG; }

  function apply(lang) {
    if (LANGS.indexOf(lang) < 0) lang = DEFAULT_LANG;
    document.documentElement.lang = lang;
    document.querySelectorAll('[data-i18n-fr]').forEach(function (el) {
      var val = el.getAttribute('data-i18n-' + lang);
      if (val != null) el.innerHTML = val;
    });
    ATTRS.forEach(function (attr) {
      document.querySelectorAll('[data-i18n-' + attr + '-fr]').forEach(function (el) {
        var val = el.getAttribute('data-i18n-' + attr + '-' + lang);
        if (val != null) el.setAttribute(attr, val);
      });
    });
    document.querySelectorAll('.langtoggle').forEach(function (t) {
      t.classList.toggle('is-fr', lang === 'fr');
      t.classList.toggle('is-uk', lang === 'uk');
    });
    window.__asLang = lang;
    document.dispatchEvent(new CustomEvent('as:langchange', { detail: { lang: lang } }));
  }

  function set(lang) {
    if (LANGS.indexOf(lang) < 0) return;
    try { localStorage.setItem(STORE_KEY, lang); } catch (e) {}
    apply(lang);
  }

  // Делегований клік по перемикачу (працює і для динамічно відрендерених тоглів).
  document.addEventListener('click', function (e) {
    var btn = e.target.closest ? e.target.closest('.langtoggle .langbtn') : null;
    if (!btn) return;
    var toggle = btn.closest('.langtoggle');
    var btns = toggle.querySelectorAll('.langbtn');
    set(btn === btns[0] ? 'fr' : 'uk');
  });

  window.AS_I18N = { set: set, apply: function (l) { return apply(l); }, get: current };

  // Re-apply after dynamic re-renders (e.g. x-dc setState). Guarded against
  // the observer reacting to apply()'s own mutations.
  var applying = false, scheduled = false;
  var _apply = apply;
  apply = function (lang) { applying = true; _apply(lang); setTimeout(function () { applying = false; }, 0); };
  if (window.MutationObserver) {
    new MutationObserver(function () {
      if (applying || scheduled) return;
      scheduled = true;
      requestAnimationFrame(function () { scheduled = false; apply(current()); });
    }).observe(document.documentElement, { childList: true, subtree: true });
  }

  function init() { apply(current()); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
