// Scroll Observer
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add("is-visible");
    });
  },
  { threshold: 0.1 }
);
document
  .querySelectorAll(".reveal-on-scroll")
  .forEach((el) => observer.observe(el));


// Hide/reveal top navigation on scroll direction
const topNav = document.querySelector(".top-nav");

if (topNav) {
  let lastScrollY = window.scrollY;
  const minDelta = 6;

  const toggleNavOnScroll = () => {
    const currentScrollY = window.scrollY;
    const scrollDelta = currentScrollY - lastScrollY;

    if (currentScrollY <= 20) {
      topNav.classList.remove("nav-hidden");
      lastScrollY = currentScrollY;
      return;
    }

    if (Math.abs(scrollDelta) < minDelta) return;

    if (scrollDelta > 0) {
      topNav.classList.add("nav-hidden");
    } else {
      topNav.classList.remove("nav-hidden");
    }

    lastScrollY = currentScrollY;
  };

  window.addEventListener("scroll", toggleNavOnScroll, { passive: true });
}

// Glass Nav Mouse Glow
const glassNav = document.getElementById("glass-nav");

if (glassNav && window.matchMedia("(pointer: fine)").matches) {
  let rect = null;
  let rafId = null;
  let targetX = 0;
  let targetY = 0;

  const updateRect = () => {
    rect = glassNav.getBoundingClientRect();
  };

  const renderGlow = () => {
    glassNav.style.setProperty("--glow-x", `${targetX}px`);
    glassNav.style.setProperty("--glow-y", `${targetY}px`);
    rafId = null;
  };

  const queueRender = () => {
    if (rafId !== null) return;
    rafId = requestAnimationFrame(renderGlow);
  };

  glassNav.addEventListener("pointerenter", (event) => {
    updateRect();
    glassNav.classList.add("is-glow-active");
    targetX = event.clientX - rect.left;
    targetY = event.clientY - rect.top;
    queueRender();
  });

  glassNav.addEventListener("pointermove", (event) => {
    if (!rect) updateRect();
    targetX = event.clientX - rect.left;
    targetY = event.clientY - rect.top;
    queueRender();
  });

  glassNav.addEventListener("pointerleave", () => {
    glassNav.classList.remove("is-glow-active");
  });

  window.addEventListener("resize", updateRect);
  window.addEventListener("scroll", updateRect, { passive: true });
}

// Logic Tab Switcher
function switchTab(tab) {
  document.querySelectorAll(".tab-content").forEach((el) => el.classList.add("hidden"));
  document.getElementById("content-" + tab).classList.remove("hidden");

  const btn1 = document.getElementById("tab-collab");
  const btn2 = document.getElementById("tab-audit");

  if (tab === "collab") {
    btn1.classList.add("bg-white/10", "text-white", "shadow-sm");
    btn1.classList.remove("text-zinc-400");
    btn2.classList.remove("bg-white/10", "text-white", "shadow-sm");
    btn2.classList.add("text-zinc-400");
  } else {
    btn2.classList.add("bg-white/10", "text-white", "shadow-sm");
    btn2.classList.remove("text-zinc-400");
    btn1.classList.remove("bg-white/10", "text-white", "shadow-sm");
    btn1.classList.add("text-zinc-400");
  }
}

// Pricing Logic
let currentPlan = "business";
let currentBilling = "monthly";

const plans = {
  business: {
    monthly: 249,
    yearly: 2490,
    desc: "GREAT FOR TEAMS LAUNCHING WORKFLOWS.",
    features: ["Up to 10 Users", "Basic Reporting", "30-Day Audit Log"],
  },
  enterprise: {
    monthly: 999,
    yearly: 9990,
    desc: "GLOBAL COMPLIANCE & PRODUCTION SCALE.",
    features: ["Unlimited Users", "Advanced AI Analytics", "SSO & Compliance", "Priority Support"],
  },
};

function setBilling(period) {
  currentBilling = period;
  document.getElementById("btn-monthly").className =
    period === "monthly"
      ? "px-3 py-1 text-xs font-medium rounded bg-white/10 text-white shadow"
      : "px-3 py-1 text-xs font-medium rounded text-zinc-400 hover:text-white";
  document.getElementById("btn-yearly").className =
    period === "yearly"
      ? "px-3 py-1 text-xs font-medium rounded bg-white/10 text-white shadow"
      : "px-3 py-1 text-xs font-medium rounded text-zinc-400 hover:text-white";
  updatePricingUI();
}

function selectPlan(plan) {
  currentPlan = plan;

  const b = document.getElementById("card-business");
  const e = document.getElementById("card-enterprise");

  const activeClass = "border-white/20 bg-white/5";
  const inactiveClass = "border-white/5";

  if (plan === "business") {
    b.className = `p-4 rounded-xl cursor-pointer hover:bg-white/10 transition-colors ${activeClass}`;
    e.className = `p-4 rounded-xl cursor-pointer hover:bg-white/10 transition-colors ${inactiveClass}`;
    b.querySelector("iconify-icon").setAttribute("icon", "solar:check-circle-bold");
    b.querySelector("iconify-icon").classList.add("text-white");
    b.querySelector("iconify-icon").classList.remove("text-zinc-500");
    e.querySelector("iconify-icon").setAttribute("icon", "solar:circle-linear");
    e.querySelector("iconify-icon").classList.add("text-zinc-500");
    e.querySelector("iconify-icon").classList.remove("text-white");
  } else {
    e.className = `p-4 rounded-xl cursor-pointer hover:bg-white/10 transition-colors ${activeClass}`;
    b.className = `p-4 rounded-xl cursor-pointer hover:bg-white/10 transition-colors ${inactiveClass}`;
    e.querySelector("iconify-icon").setAttribute("icon", "solar:check-circle-bold");
    e.querySelector("iconify-icon").classList.add("text-white");
    e.querySelector("iconify-icon").classList.remove("text-zinc-500");
    b.querySelector("iconify-icon").setAttribute("icon", "solar:circle-linear");
    b.querySelector("iconify-icon").classList.add("text-zinc-500");
    b.querySelector("iconify-icon").classList.remove("text-white");
  }

  updatePricingUI();
}

function updatePricingUI() {
  const data = plans[currentPlan];
  const price = currentBilling === "monthly" ? data.monthly : data.yearly;
  const suffix = currentBilling === "monthly" ? "/month" : "/year";

  document.getElementById("price-display").innerText = "$" + price;
  document.getElementById("period-display").innerText = suffix;
  document.getElementById("desc-display").innerText = data.desc;

  const list = document.getElementById("feature-list");
  list.innerHTML = "";
  data.features.forEach((f) => {
    list.innerHTML += `<li class="flex items-center gap-3 text-sm animate-enter"><iconify-icon icon="solar:check-read-linear" class="text-blue-400"></iconify-icon> ${f}</li>`;
  });
}

// Expose for inline onclick handlers
window.switchTab = switchTab;
window.setBilling = setBilling;
window.selectPlan = selectPlan;
