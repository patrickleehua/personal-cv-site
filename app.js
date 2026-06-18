const LOCALE_STORAGE_KEY = "cv-site-locale";

// 检测浏览器语言：默认中文，识别到其他国家/语言时回落英文。
// 优先级：用户手动选择（localStorage） > 浏览器语言 > 中文默认。
function detectLocale() {
  try {
    const saved = window.localStorage.getItem(LOCALE_STORAGE_KEY);
    if (saved === "zh" || saved === "en") {
      return saved;
    }
  } catch (error) {
    // localStorage 不可用（隐私模式等），忽略后回落到浏览器语言判断。
  }

  const languages =
    Array.isArray(navigator.languages) && navigator.languages.length
      ? navigator.languages
      : [navigator.language || navigator.userLanguage || ""];

  const prefersChinese = languages.some((lang) =>
    String(lang).toLowerCase().startsWith("zh"),
  );

  return prefersChinese ? "zh" : "en";
}

const AppState = {
  locale: detectLocale(),
  route: "home",
  template: "reference",
  unlocked: false,
};

const LocaleText = {
  zh: {
    home: "首页",
    cv: "简历",
    download: "下载",
    downloadPdf: "下载 PDF",
    talkWithAi: "与AI交谈",
    viewCv: "查看在线简历",
    about: "个人简介",
    nationality: "国籍",
    skills: "技能",
    featuredProjects: "近期项目",
    viewAllProjects: "查看全部项目",
    overview: "个人概述",
    experience: "工作经历",
    projects: "项目经历",
    education: "教育背景",
    certifications: "证书",
    coreSkills: "核心技能",
    privatePreview: "Private Preview",
    privateHint: "此内容为私人预览，请输入访问密码",
    passwordPlaceholder: "输入访问密码",
    enter: "Enter",
    secureNote: "访问受保护 · 请妥善保管密码",
    wrongPassword: "密码不正确。",
    emptyPassword: "请输入访问密码。",
    backToCv: "返回简历",
    maintenancePreview: "维护预览",
    contentFiles: "内容文件",
    pdfExport: "PDF 导出",
    templateSystem: "模板系统",
    contentHelp:
      "只维护 `content/resume-data.js` 这一份数据，页面、CV 和 PDF 导出都从它渲染。",
    pdfHelp:
      "点击下载 PDF 会切到同一份 CV 渲染结果并调用浏览器打印/保存 PDF，不再维护单独 PDF 内容。",
    templateHelp:
      "视觉模板放在 `templates/`，后续新增模板只需要注册一个 renderer。",
    aiTitle: "使用AI 分析我能做什么",
    aiCopyFull: "复制简历",
    aiCopied: "已复制，可以粘贴给 AI 了。",
    aiCopyFailed: "复制失败，请重新点击或使用支持剪贴板的浏览器。",
    aiPasteHint: "复制后打开你常用的 AI 工具，把内容粘贴到新对话的第一条消息。",
    aiPlatforms: "推荐粘贴到",
  },
  en: {
    home: "Home",
    cv: "CV",
    download: "Download",
    downloadPdf: "Download PDF",
    talkWithAi: "Talk with AI",
    viewCv: "View CV",
    about: "About",
    nationality: "Nationality",
    skills: "Skills",
    featuredProjects: "Recent Projects",
    viewAllProjects: "View all projects",
    overview: "Profile",
    experience: "Experience",
    projects: "Projects",
    education: "Education",
    certifications: "Certifications",
    coreSkills: "Core Skills",
    privatePreview: "Private Preview",
    privateHint: "This content is private. Enter the access password.",
    passwordPlaceholder: "Enter access password",
    enter: "Enter",
    secureNote: "Protected access · keep the password safe",
    wrongPassword: "Incorrect password.",
    emptyPassword: "Enter the access password.",
    backToCv: "Back to CV",
    maintenancePreview: "Maintenance Preview",
    contentFiles: "Content Files",
    pdfExport: "PDF Export",
    templateSystem: "Template System",
    contentHelp:
      "Maintain only `content/resume-data.js`; homepage, CV, and PDF export all render from it.",
    pdfHelp:
      "Download PDF switches to the same CV render and opens browser print/save, so PDF content is not maintained separately.",
    templateHelp:
      "Visual templates live in `templates/`; future templates only need to register another renderer.",
    aiTitle: "Using AI to analyze what I can do",
    aiCopyFull: "COPY CV",
    aiCopied: "Copied. Paste it into your AI chat.",
    aiCopyFailed: "Copy failed. Try again in a browser with clipboard support.",
    aiPasteHint:
      "After copying, open your preferred AI assistant and paste it as the first message in a new chat.",
    aiPlatforms: "Paste into",
  },
};

const TemplateRegistry = {};

function registerTemplate(name, renderer) {
  TemplateRegistry[name] = renderer;
}

function text() {
  return LocaleText[AppState.locale];
}

function resume() {
  return window.RESUME_DATA[AppState.locale];
}

function allResumeData() {
  return window.RESUME_DATA;
}

function activeRoutes() {
  return ["home", "cv", "preview", "ai"];
}

function setRoute(route) {
  AppState.route = activeRoutes().includes(route) ? route : "home";
  history.replaceState(null, "", `#${AppState.route}`);
  renderApp();
}

function switchLanguage() {
  AppState.locale = AppState.locale === "zh" ? "en" : "zh";
  try {
    window.localStorage.setItem(LOCALE_STORAGE_KEY, AppState.locale);
  } catch (error) {
    // localStorage 不可用时仅在当前会话生效，不阻断切换。
  }
  renderApp();
}

function exportPdf() {
  AppState.route = "cv";
  history.replaceState(null, "", "#cv");
  renderApp();
  document.body.classList.add("is-exporting-pdf");
  requestAnimationFrame(() => {
    requestAnimationFrame(() => window.print());
  });
}

function updateBackToTopButton() {
  const button = document.querySelector("[data-action='back-to-top']");
  if (!button) return;
  const isVisible = window.scrollY > 320;
  button.hidden = false;
  button.classList.toggle("is-visible", isVisible);
  button.setAttribute("aria-hidden", String(!isVisible));
  button.tabIndex = isVisible ? 0 : -1;
}

function bindBackToTopButton() {
  const button = document.querySelector("[data-action='back-to-top']");
  if (!button) return;
  button.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
  window.addEventListener("scroll", updateBackToTopButton, { passive: true });
  updateBackToTopButton();
}

function unlockPreview(password) {
  if (!password.trim()) {
    return { ok: false, message: text().emptyPassword };
  }
  if (password.trim() !== "patrick-preview") {
    return { ok: false, message: text().wrongPassword };
  }
  AppState.unlocked = true;
  renderApp();
  return { ok: true, message: "" };
}

function markdownList(items) {
  return items.map((item) => `- ${String(item ?? "")}`).join("\n");
}

function aiContextSections(preset) {
  const data = resume();
  const identity = data.identity;
  const aiContext = data.aiContext || {};
  const sections = [
    (aiContext.systemPrompt || []).join("\n"),
    `# ${identity.name} - AI Context`,
    aiContext.cvInstruction || "",
    [
      "## 个人简介",
      `- Name: ${identity.name}`,
      `- Preferred name: ${identity.preferredName}`,
      `- Headline: ${identity.headline}`,
      `- Location: ${identity.location}`,
      `- Experience: ${identity.years}`,
      `- Education: ${identity.educationLevel}`,
      `- Email: ${identity.email}`,
      `- Links: ${identity.links.map((link) => `${link.label} ${link.url}`).join("; ")}`,
    ].join("\n"),
  ];

  if (preset === "full" || preset === "skills") {
    sections.push(
      [
        "## 技能能力",
        ...data.skills.map(
          (group) => `### ${group.title}\n${markdownList(group.items)}`,
        ),
        "## 技术栈",
        ...data.toolbox.map(
          (group) => `- ${group.label}: ${group.items.join(", ")}`,
        ),
      ].join("\n\n"),
    );
  }

  if (preset === "full" || preset === "projects") {
    sections.push(
      [
        "## 项目经历",
        ...data.projects.map((project) =>
          [
            `### ${project.name}`,
            `- Period: ${project.period}`,
            `- Type: ${project.type}`,
            `- Description: ${project.description}`,
            `- Stack: ${project.stack.join(", ")}`,
            "- Responsibilities:",
            markdownList(project.items),
          ].join("\n"),
        ),
      ].join("\n\n"),
    );
  }

  if (preset === "full") {
    sections.push(
      [
        "## 概述",
        markdownList(data.summary),
        "## 工作经历",
        ...data.experience.map(
          (item) =>
            `### ${item.company} | ${item.role}\n- Period: ${item.period}\n${markdownList(item.items)}`,
        ),
        "## 教育与证书",
        ...data.education.map(
          (item) =>
            `- ${item.school} / ${item.major} / ${item.degree} / ${item.period}`,
        ),
        markdownList(data.certifications),
      ].join("\n\n"),
    );
  }

  return sections.join("\n\n");
}

async function copyAiContext(preset) {
  const content = aiContextSections(preset || "full");
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(content);
    } else {
      const input = document.createElement("textarea");
      input.value = content;
      input.setAttribute("readonly", "");
      input.style.position = "fixed";
      input.style.top = "-1000px";
      input.style.opacity = "0";
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      input.remove();
    }
    return { ok: true, message: text().aiCopied };
  } catch (error) {
    return { ok: false, message: text().aiCopyFailed };
  }
}

function bindGlobalEvents(root) {
  root.querySelectorAll("[data-route]").forEach((node) => {
    node.addEventListener("click", (event) => {
      event.preventDefault();
      setRoute(node.dataset.route);
    });
  });

  root.querySelectorAll("[data-action='switch-language']").forEach((node) => {
    node.addEventListener("click", switchLanguage);
  });

  root.querySelectorAll("[data-action='export-pdf']").forEach((node) => {
    node.addEventListener("click", (event) => {
      event.preventDefault();
      exportPdf();
    });
  });

  root.querySelectorAll("[data-action='copy-ai-context']").forEach((node) => {
    node.addEventListener("click", async (event) => {
      event.preventDefault();
      const result = await copyAiContext(node.dataset.contextPreset);
      const status = root.querySelector("[data-ai-copy-status]");
      if (status) status.textContent = result.message;
    });
  });

  const passwordForm = root.querySelector("[data-password-form]");
  if (passwordForm) {
    passwordForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const input = passwordForm.querySelector("input");
      const result = unlockPreview(input.value);
      const error = passwordForm.querySelector("[data-password-error]");
      if (error) error.textContent = result.message;
    });
  }
}

function renderApp() {
  const root = document.querySelector("#app");
  try {
    const renderer = TemplateRegistry[AppState.template];
    if (!renderer) {
      throw new Error(`Template not registered: ${AppState.template}`);
    }

    if (!window.RESUME_DATA || !window.RESUME_DATA[AppState.locale]) {
      throw new Error("Resume data failed to load.");
    }

    document.documentElement.lang = AppState.locale === "zh" ? "zh-CN" : "en";
    document.title = resume().meta.siteTitle;
    const meta = document.querySelector("meta[name='description']");
    if (meta) meta.setAttribute("content", resume().meta.description);

    root.innerHTML = renderer({
      state: AppState,
      data: resume(),
      allData: allResumeData(),
      t: text(),
    });

    bindGlobalEvents(root);

    if (window.lucide) {
      window.lucide.createIcons({
        attrs: {
          "stroke-width": 1.8,
        },
      });
    }
  } catch (error) {
    root.innerHTML = `
      <section class="view">
        <div class="site-card" style="max-width: 760px; padding: 32px;">
          <h1 style="margin-top: 0;">Resume render failed</h1>
          <p>${String(error.message || error)}</p>
          <p>Open the browser console for the full error details.</p>
        </div>
      </section>
    `;
    console.error(error);
  }
}

function boot() {
  const route = location.hash.replace("#", "") || "home";
  AppState.route = activeRoutes().includes(route) ? route : "home";
  renderApp();
  bindBackToTopButton();

  window.addEventListener("hashchange", () => {
    const nextRoute = location.hash.replace("#", "") || "home";
    AppState.route = activeRoutes().includes(nextRoute) ? nextRoute : "home";
    renderApp();
    updateBackToTopButton();
  });
}

window.addEventListener("afterprint", () => {
  document.body.classList.remove("is-exporting-pdf");
});

window.CV_APP = {
  boot,
  registerTemplate,
};
