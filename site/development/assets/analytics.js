/* Atelier Sveta — Google Analytics 4 + bannière de consentement (RGPD / CNIL).
   GA ne se charge QU'APRÈS un clic sur « Accepter ». « Refuser » ne pose aucun cookie.
   Le choix est mémorisé (localStorage) ; un lien « Cookies » dans le pied de page
   permet de revenir sur sa décision. Textes bilingues via data-i18n-fr/uk (i18n.js). */
(function () {
  var MEASUREMENT_ID = 'G-BMKP6T6MBJ';
  var STORE_KEY = 'as-cookie-consent'; // 'granted' | 'denied'

  function readConsent() {
    try { return localStorage.getItem(STORE_KEY); } catch (e) { return null; }
  }
  function writeConsent(v) {
    try { localStorage.setItem(STORE_KEY, v); } catch (e) {}
  }

  /* --- Chargement de Google Analytics (uniquement sur consentement) --- */
  function loadGA() {
    if (window.__asGaLoaded) return;
    window.__asGaLoaded = true;
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + MEASUREMENT_ID;
    document.head.appendChild(s);
    window.dataLayer = window.dataLayer || [];
    function gtag() { dataLayer.push(arguments); }
    window.gtag = gtag;
    gtag('js', new Date());
    gtag('consent', 'default', {
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied',
      analytics_storage: 'denied'
    });
    gtag('consent', 'update', { analytics_storage: 'granted' });
    gtag('config', MEASUREMENT_ID, { anonymize_ip: true });
  }

  /* --- Styles de la bannière (injectés une fois) --- */
  function injectStyles() {
    if (document.getElementById('as-cookie-style')) return;
    var css = [
      '.cookie-banner{position:fixed;left:16px;right:16px;bottom:16px;z-index:9999;',
      '  max-width:620px;margin:0 auto;background:#141310;color:#edebe3;',
      '  border-radius:14px;box-shadow:0 10px 40px rgba(0,0,0,.28);',
      '  padding:18px 20px;display:flex;flex-direction:column;gap:14px;',
      "  font-family:'Archivo',system-ui,sans-serif;",
      '  transform:translateY(12px);opacity:0;transition:opacity .35s ease,transform .35s ease;}',
      '.cookie-banner.is-in{transform:none;opacity:1;}',
      '.cookie-text{margin:0;font-size:13px;line-height:1.5;color:#e7e4db;}',
      '.cookie-text a{color:#FAAB06;text-decoration:underline;}',
      '.cookie-actions{display:flex;gap:10px;flex-wrap:wrap;}',
      '.cookie-btn{flex:1 1 auto;min-width:120px;cursor:pointer;border-radius:40px;',
      '  padding:12px 20px;font-family:inherit;font-weight:700;font-size:14px;',
      '  border:1px solid transparent;transition:background .2s ease,color .2s ease,border-color .2s ease;}',
      '.cookie-accept{background:#FAAB06;color:#141310;}',
      '.cookie-accept:hover{background:#ffbf3a;}',
      '.cookie-refuse{background:transparent;color:#edebe3;border-color:rgba(237,235,227,.5);}',
      '.cookie-refuse:hover{border-color:#edebe3;background:rgba(237,235,227,.08);}',
      '.site-footer-cookies{background:none;border:0;padding:0;cursor:pointer;font:inherit;',
      '  color:#6b6459;white-space:nowrap;text-decoration:none;}',
      '@media (min-width:560px){.cookie-banner{flex-direction:row;align-items:center;}',
      '  .cookie-text{flex:1;} .cookie-actions{flex:none;} .cookie-btn{flex:0 0 auto;min-width:0;}}'
    ].join('');
    var st = document.createElement('style');
    st.id = 'as-cookie-style';
    st.textContent = css;
    document.head.appendChild(st);
  }

  /* --- Bannière --- */
  function showBanner() {
    if (document.getElementById('cookie-banner')) return;
    injectStyles();
    var b = document.createElement('div');
    b.className = 'cookie-banner';
    b.id = 'cookie-banner';
    b.setAttribute('role', 'dialog');
    b.setAttribute('aria-live', 'polite');
    b.setAttribute('aria-label', 'Consentement aux cookies');
    b.setAttribute('data-i18n-aria-label-fr', 'Consentement aux cookies');
    b.setAttribute('data-i18n-aria-label-uk', 'Згода на cookies');
    b.innerHTML =
      '<p class="cookie-text" data-i18n-fr="Nous utilisons des cookies de mesure d’audience (Google Analytics) pour comprendre la fréquentation du site. Vous pouvez accepter ou refuser." data-i18n-uk="Ми використовуємо аналітичні cookies (Google Analytics), щоб розуміти відвідуваність сайту. Ви можете прийняти або відхилити.">' +
        'Nous utilisons des cookies de mesure d’audience (Google Analytics) pour comprendre la fréquentation du site. Vous pouvez accepter ou refuser.</p>' +
      '<div class="cookie-actions">' +
        '<button type="button" class="cookie-btn cookie-refuse" data-i18n-fr="Refuser" data-i18n-uk="Відхилити">Refuser</button>' +
        '<button type="button" class="cookie-btn cookie-accept" data-i18n-fr="Accepter" data-i18n-uk="Прийняти">Accepter</button>' +
      '</div>';
    document.body.appendChild(b);
    // ré-applique la langue courante sur les nœuds fraîchement injectés
    try { if (window.AS_I18N) window.AS_I18N.apply(window.AS_I18N.get()); } catch (e) {}
    requestAnimationFrame(function () { b.classList.add('is-in'); });
    b.querySelector('.cookie-accept').addEventListener('click', function () {
      writeConsent('granted'); hideBanner(b); loadGA();
    });
    b.querySelector('.cookie-refuse').addEventListener('click', function () {
      writeConsent('denied'); hideBanner(b);
    });
  }
  function hideBanner(b) {
    b = b || document.getElementById('cookie-banner');
    if (!b) return;
    b.classList.remove('is-in');
    setTimeout(function () { if (b && b.parentNode) b.parentNode.removeChild(b); }, 350);
  }

  /* --- Lien « Cookies » du pied de page (présent dans le gabarit de chaque page).
         Délégation sur document : robuste face aux re-rendus x-dc. --- */
  document.addEventListener('click', function (e) {
    var t = e.target.closest ? e.target.closest('.site-footer-cookies') : null;
    if (!t) return;
    e.preventDefault();
    showBanner();
  });

  window.asOpenCookieSettings = showBanner;

  function init() {
    var consent = readConsent();
    if (consent === 'granted') loadGA();
    else if (consent !== 'denied') showBanner();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
