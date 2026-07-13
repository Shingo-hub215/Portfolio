/* =========================================================
   中村槙吾 │ Game Programmer Portfolio - main.js
   ========================================================= */
(function () {
  "use strict";

  /* ===== 年号 ===== */
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ===== モバイルナビ開閉 ===== */
  const navToggle = document.getElementById("navToggle");
  const nav = document.getElementById("nav");
  if (navToggle && nav) {
    navToggle.addEventListener("click", function () {
      const open = nav.classList.toggle("is-open");
      navToggle.classList.toggle("is-open", open);
      navToggle.setAttribute("aria-expanded", String(open));
      navToggle.setAttribute("aria-label", open ? "メニューを閉じる" : "メニューを開く");
    });
    // リンク選択で閉じる
    nav.querySelectorAll(".nav__link").forEach(function (link) {
      link.addEventListener("click", function () {
        nav.classList.remove("is-open");
        navToggle.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ===== スクロール時のフェードイン（控えめ） ===== */
  const revealTargets = document.querySelectorAll(
    ".section__title, .section__note, .value, .timeline__item, .skills__group, .work-card, .contact__link, .about__intro, .hero__lead, .hero__actions"
  );
  revealTargets.forEach(function (el) { el.classList.add("reveal"); });

  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    revealTargets.forEach(function (el) { io.observe(el); });
  } else {
    revealTargets.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* ===== ナビのアクティブ表示 ===== */
  const sections = document.querySelectorAll("main section[id]");
  const navLinks = document.querySelectorAll(".nav__link");
  if ("IntersectionObserver" in window && sections.length) {
    const spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute("id");
          navLinks.forEach(function (link) {
            link.classList.toggle("is-active", link.getAttribute("href") === "#" + id);
          });
        }
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    sections.forEach(function (s) { spy.observe(s); });
  }

  /* ===== Works 詳細モーダル ===== */
  const modal = document.getElementById("workModal");
  const modalContents = modal ? modal.querySelectorAll("[data-work-detail]") : [];
  let lastFocused = null;

  /* YouTube iframe を動的に挿入（autoplay） */
  function embedYouTube(container) {
    var videoWrappers = container.querySelectorAll(".modal__video[data-youtube-id]");
    videoWrappers.forEach(function (wrap) {
      var vid = wrap.getAttribute("data-youtube-id");
      if (!vid || vid.indexOf("YOUR_VIDEO_ID") === 0) return;
      var iframe = document.createElement("iframe");
      iframe.src = "https://www.youtube.com/embed/" + vid + "?autoplay=1&rel=0";
      iframe.allow = "autoplay; encrypted-media";
      iframe.setAttribute("allowfullscreen", "");
      iframe.setAttribute("loading", "lazy");
      wrap.appendChild(iframe);
      var ph = wrap.querySelector(".modal__video-placeholder");
      if (ph) ph.hidden = true;
    });
  }
  function removeYouTube() {
    if (!modal) return;
    modal.querySelectorAll(".modal__video iframe").forEach(function (f) { f.remove(); });
    modal.querySelectorAll(".modal__video-placeholder").forEach(function (ph) { ph.hidden = false; });
  }

  function openModal(workId) {
    if (!modal) return;
    modalContents.forEach(function (c) {
      c.hidden = c.getAttribute("data-work-detail") !== workId;
    });
    lastFocused = document.activeElement;
    modal.hidden = false;
    document.body.style.overflow = "hidden";
    var activeContent = modal.querySelector("[data-work-detail='" + workId + "']");
    if (activeContent) embedYouTube(activeContent);
    const closeBtn = modal.querySelector(".modal__close");
    if (closeBtn) closeBtn.focus();
  }
  function closeModal() {
    if (!modal) return;
    removeYouTube();
    modal.hidden = true;
    document.body.style.overflow = "";
    if (lastFocused) lastFocused.focus();
  }

  document.querySelectorAll(".work-card__more").forEach(function (btn) {
    btn.addEventListener("click", function () { openModal(btn.getAttribute("data-work")); });
  });
  if (modal) {
    modal.querySelectorAll("[data-close]").forEach(function (el) {
      el.addEventListener("click", closeModal);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && !modal.hidden) closeModal();
    });
  }
})();
