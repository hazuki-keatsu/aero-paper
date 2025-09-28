const primaryColorScheme = ""; // "light" | "dark"

// Get theme data from local storage
const currentTheme = localStorage.getItem("theme");

function getPreferTheme() {
  // return theme value in local storage if it is set
  if (currentTheme) return currentTheme;

  // return primary color scheme if it is set
  if (primaryColorScheme) return primaryColorScheme;

  // return user device's prefer color scheme
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

let themeValue = getPreferTheme();

function setPreference() {
  localStorage.setItem("theme", themeValue);
  reflectPreference();
}

function reflectPreference() {
  document.firstElementChild.setAttribute("data-theme", themeValue);

  document.documentElement.setAttribute('data-ec-theme', themeValue === "dark" ? "min-dark" : "min-light");

  document.querySelector("#theme-btn")?.setAttribute("aria-label", themeValue);

  // Get a reference to the body element
  const body = document.body;

  // Check if the body element exists before using getComputedStyle
  if (body) {
    // Get the computed styles for the body element
    const computedStyles = window.getComputedStyle(body);

    // Get the background color property
    const bgColor = computedStyles.backgroundColor;

    // Set the background color in <meta theme-color ... />
    document
      .querySelector("meta[name='theme-color']")
      ?.setAttribute("content", bgColor);
  }
}

// set early so no page flashes / CSS is made aware
reflectPreference();

window.onload = () => {
  function setThemeFeature() {
    // set on load so screen readers can get the latest value on the button
    reflectPreference();
    // 确保初始或页面切换后立即匹配当前主题
    updateMermaidMedia(themeValue);

    // now this script can find and listen for clicks on the control
    document.querySelector("#theme-btn")?.addEventListener("click", () => {
      themeValue = themeValue === "light" ? "dark" : "light";
      updateMermaidMedia(themeValue === "light" ? "light" : "dark");
      setPreference();
    });
  }

  setThemeFeature();

  // Runs on view transitions navigation
  document.addEventListener("astro:after-swap", setThemeFeature);
};

// Set theme-color value before page transition
// to avoid navigation bar color flickering in Android dark mode
document.addEventListener("astro:before-swap", event => {
  const bgColor = document
    .querySelector("meta[name='theme-color']")
    ?.getAttribute("content");

  event.newDocument
    .querySelector("meta[name='theme-color']")
    ?.setAttribute("content", bgColor);

  // 预先把当前 theme 属性复制到将要进入的文档，减少过渡时闪烁
  const currentThemeAttr = document.documentElement.getAttribute('data-theme');
  if (currentThemeAttr) {
    event.newDocument.documentElement.setAttribute('data-theme', currentThemeAttr);
    event.newDocument.documentElement.setAttribute('data-ec-theme', currentThemeAttr === 'dark' ? 'min-dark' : 'min-light');
  }
});

// sync with system changes
window
  .matchMedia("(prefers-color-scheme: dark)")
  .addEventListener("change", ({ matches: isDark }) => {
    themeValue = isDark ? "dark" : "light";
    setPreference();
  });

// 更新 Mermaid 图表主题
function updateMermaidMedia(theme) {
  const isDark = theme === 'dark';
  // 双版本：mermaid-dark* 与 mermaid-light*
  document.querySelectorAll('[id^="mermaid-dark"]').forEach(el => {
    el.setAttribute('media', isDark ? 'all' : 'none');
  });
  document.querySelectorAll('[id^="mermaid-light"]').forEach(el => {
    el.setAttribute('media', isDark ? 'none' : 'all');
  });

  // 如果只存在单版本 (例如只有原始 .mermaid 渲染出的 svg)，可在此根据需要添加 class
  document.querySelectorAll('.mermaid').forEach(el => {
    el.classList.toggle('mermaid-dark-theme', isDark);
    el.classList.toggle('mermaid-light-theme', !isDark);
  });
}

// 观察后续（例如 astro:after-swap 或异步加载）插入的新 mermaid 节点，立即赋予正确媒体
const mermaidObserver = new MutationObserver(mutations => {
  let needUpdate = false;
  for (const m of mutations) {
    if ([...m.addedNodes].some(n => n.nodeType === 1 && (
      (n instanceof HTMLElement && (n.matches('[id^="mermaid-dark"], [id^="mermaid-light"], .mermaid')) || n.querySelector?.('[id^="mermaid-dark"], [id^="mermaid-light"], .mermaid') )
    ))) {
      needUpdate = true; break;
    }
  }
  if (needUpdate) updateMermaidMedia(themeValue);
});
try { mermaidObserver.observe(document.documentElement, { childList: true, subtree: true }); } catch(_) {}