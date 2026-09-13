/* ═══════════════════════════════════════════════════════════
   ADS.JS — ad engine for ytdownloader
   Google AdSense-ready. Owner pastes their approved AdSense
   publisher ID (ca-pub-...) in Settings → ads activate
   everywhere automatically (top banner, in-feed, sticky bottom).
   Until then, styled placeholders are shown so the layout keeps
   its shape. 100% free for users: watch ads = support the build.
   ═══════════════════════════════════════════════════════════ */
'use strict';

const YTADS = (function () {
  const KEY = 'ytdl_adsense_pub';
  let pubId = '';
  let adsLoaded = false;

  function loadPubId() {
    try { pubId = localStorage.getItem(KEY) || ''; }
    catch (e) { pubId = ''; }
    return pubId;
  }

  function setPubId(id) {
    id = (id || '').trim();
    try { localStorage.setItem(KEY, id); } catch (e) {}
    pubId = id;
    // re-init ads with new id
    if (id && !adsLoaded) initAdsense(id);
    refreshPlaceholders();
    return true;
  }

  function isValid(id) {
    return /^ca-pub-[0-9]{16}$/.test(id || '');
  }

  /* ── Google AdSense auto ads ── */
  function initAdsense(id) {
    if (adsLoaded) return;
    adsLoaded = true;
    // standard AdSense loader (auto ads)
    (window.adsbygoogle = window.adsbygoogle || []).push({ google_ad_client: id, enable_page_level_ads: true });
    const s = document.createElement('script');
    s.async = true;
    s.crossOrigin = 'anonymous';
    s.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=' + id;
    document.head.appendChild(s);
    console.log('[ytdownloader] AdSense activated: ' + id);
  }

  /* ── render placeholder visuals on ad slots ── */
  function refreshPlaceholders() {
    document.querySelectorAll('[data-ad-slot]').forEach(slot => {
      const existing = slot.querySelector('.ad-placeholder');
      const live = slot.querySelector('.ad-live');
      if (!pubId) {
        if (live) live.remove();
        if (!existing) {
          const p = document.createElement('div');
          p.className = 'ad-placeholder';
          p.textContent = '// AD SLOT [' + slot.dataset.adSlot.toUpperCase() + '] — GOOGLE ADSENSE //';
          slot.appendChild(p);
        }
      }
    });
  }

  /* ── init from stored id on load ── */
  function init() {
    loadPubId();
    if (pubId && isValid(pubId)) initAdsense(pubId);
    refreshPlaceholders();
  }

  return { init, setPubId, getPubId: () => pubId, isValid, loadPubId };
})();

window.addEventListener('DOMContentLoaded', () => YTADS.init());