(function () {
  const esc = (value) =>
    String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");

  const icon = (name) => `<i data-lucide="${name}" aria-hidden="true"></i>`;

  const routeClass = (state, route) => (state.route === route ? "active" : "");

  const techIconMap = {
    aws: "amazonaws",
    "china-flag": "china-flag",
    docker: "docker",
    elasticsearch: "elasticsearch",
    fastapi: "fastapi",
    git: "git",
    github: "github",
    gin: "go",
    go: "go",
    kafka: "apachekafka",
    langchain: "langchain",
    langgraph: "langchain",
    java: "java",
    "java 17": "java",
    kubernetes: "kubernetes",
    linux: "linux",
    mysql: "mysql",
    neo4j: "neo4j",
    "next.js": "nextdotjs",
    "node.js": "nodedotjs",
    postgresql: "postgresql",
    python: "python",
    rabbitmq: "rabbitmq",
    react: "react",
    vue: "vue",
    redis: "redis",
    solidity: "solidity",
    "spring ai": "spring",
    "spring ai alibaba": "spring",
    "spring boot": "spring",
    "spring boot 3": "spring",
    "spring cloud": "spring",
    "spring cloud alibaba": "spring",
    typescript: "typescript",
    nginx: "nginx",
    telegram: "telegram",
    linkedin: "linkedin",
    "tailwind css": "tailwindcss",
    wechat: "wechat",
    rust: "rust",
    "claude code": "anthropic",
    codex: "openai",
    mcp: "modelcontextprotocol",
    "docker compose": "docker",
    "next.js 16": "nextdotjs",
    "github actions": "githubactions",
    "github app": "github",
    octokit: "github",
    playwright: "playwright",
    vitest: "vitest",
    sqlite: "sqlite",
    zod: "zod",
    celery: "celery",
    minio: "minio",
    sqlalchemy: "sqlalchemy",
    blender: "blender",
    "cocos creator": "cocos",
    jwt: "jsonwebtokens",
    hive: "apachehive",
  };

  function brandIcon(name) {
    const key = String(name).trim().toLowerCase();
    const file = techIconMap[key];
    return file
      ? `<img class="brand-icon" src="assets/icons/${file}.svg" alt="" aria-hidden="true" />`
      : "";
  }

  function stackTag(name) {
    return `<span class="tag tech-tag">${brandIcon(name)}${esc(name)}</span>`;
  }

  function stripProtocol(url) {
    return String(url || "")
      .replace("https://", "")
      .replace("http://", "");
  }

  function imageSource(item) {
    if (!item) return "";
    if (typeof item === "string") return item;
    if (
      item.type &&
      !["image", "photo", "portrait", "avatar"].includes(
        String(item.type).toLowerCase(),
      )
    ) {
      return "";
    }
    return item.src || item.url || "";
  }

  function identityImages(identity) {
    const candidates = [identity.media, identity.avatars, identity.avatar]
      .flatMap((item) => (Array.isArray(item) ? item : [item]))
      .map(imageSource)
      .filter(Boolean);

    return [...new Set(candidates)];
  }

  function portraitFrame(identity) {
    const images = identityImages(identity);
    const activeImages = images.length > 0 ? images : ["assets/avatar.png"];
    const duration = Math.max(activeImages.length * 4, 4);

    return `
      <figure class="portrait-frame ${activeImages.length > 1 ? "is-carousel" : ""}" style="--portrait-count: ${activeImages.length}; --portrait-duration: ${duration}s;">
        ${activeImages
          .map(
            (src, index) => `
              <img
                class="portrait"
                src="${esc(src)}"
                alt="${index === 0 ? esc(identity.name) : ""}"
                ${index > 0 ? 'aria-hidden="true"' : ""}
                style="--portrait-index: ${index};"
              />
            `,
          )
          .join("")}
      </figure>
    `;
  }

  function langToggle(current) {
    return `
      <button class="language-toggle" type="button" data-action="switch-language" aria-label="Switch language">
        <span class="${current === "zh" ? "is-current" : ""}">中文</span>
        <span class="lang-divider">/</span>
        <span class="${current === "en" ? "is-current" : ""}">EN</span>
      </button>
    `;
  }

  function mobileMenu({ state, t }) {
    const items = [
      ["home", t.home, "home"],
      ["cv", t.cv, "file-text"],
      ["ai", t.talkWithAi, "bot"],
    ];

    return `
      <details class="mobile-menu">
        <summary class="mobile-menu-trigger" aria-label="${esc(t.home)} / ${esc(t.cv)} / ${esc(t.talkWithAi)}">
          ${icon("menu")}
        </summary>
        <div class="mobile-menu-panel">
          ${items
            .map(
              ([route, label, iconName]) => `
                <a class="${routeClass(state, route)}" href="#${esc(route)}" data-route="${esc(route)}">
                  ${icon(iconName)}
                  <span>${esc(label)}</span>
                </a>
              `,
            )
            .join("")}
          <button type="button" data-action="export-pdf">
            ${icon("download")}
            <span>${esc(t.downloadPdf)}</span>
          </button>
        </div>
      </details>
    `;
  }

  function topbar({ state, data, t, variant = "home" }) {
    if (variant === "cv") {
      return `
        <header class="topbar cv-topbar">
          <a class="wordmark" href="#home" data-route="home">${esc(data.identity.preferredName)}</a>
          <div class="cv-actions">
            ${langToggle(state.locale)}
            <button class="button primary small" type="button" data-action="export-pdf">
              ${icon("download")}
              <span>${esc(t.downloadPdf)}</span>
            </button>
            ${mobileMenu({ state, t })}
          </div>
        </header>
      `;
    }

    return `
      <header class="topbar">
        <a class="wordmark" href="#home" data-route="home">${esc(data.identity.preferredName)}</a>
        <nav class="desktop-nav" aria-label="Primary navigation">
          <a class="${routeClass(state, "home")}" href="#home" data-route="home">${esc(t.home)}</a>
          <a class="${routeClass(state, "cv")}" href="#cv" data-route="cv">${esc(t.cv)}</a>
          <a class="${routeClass(state, "ai")}" href="#ai" data-route="ai">${esc(t.talkWithAi)}</a>
          <button type="button" data-action="export-pdf">${esc(t.download)}</button>
        </nav>
        <div class="topbar-actions">
          ${langToggle(state.locale)}
          ${mobileMenu({ state, t })}
        </div>
      </header>
    `;
  }

  function contactMeta({ data, t }) {
    const github = data.identity.links.find((link) => String(link.label).toLowerCase() === "github");
    const telegram = data.identity.links.find((link) => String(link.label).toLowerCase() === "telegram");

    return `
      <ul class="hero-meta" aria-label="Contact summary">
        <li>${icon("map-pin")}<span>${esc(data.identity.location)}</span></li>
        ${data.identity.nationality ? `<li>${brandIcon("china-flag")}<span>${esc(t.nationality)} · ${esc(data.identity.nationality)}</span></li>` : ""}
        <li>${icon("mail")}<a href="mailto:${esc(data.identity.email)}">${esc(data.identity.email)}</a></li>
        ${
          github
            ? `<li>${brandIcon("github") || icon("github")}<a href="${esc(github.url)}" target="_blank" rel="noreferrer">${esc(stripProtocol(github.url))}</a></li>`
            : ""
        }
        ${
          telegram
            ? `<li>${icon("send")}<a href="${esc(telegram.url)}" target="_blank" rel="noreferrer">${esc(stripProtocol(telegram.url))}</a></li>`
            : ""
        }
      </ul>
    `;
  }

  function hero({ data, t }) {
    const showAltName =
      data.identity.preferredName &&
      data.identity.preferredName !== data.identity.name;
    return `
      <section class="home-hero">
        ${portraitFrame(data.identity)}
        <div class="hero-content">
          <h1>
            <span>${esc(data.identity.name)}</span>
            ${
              showAltName
                ? `<span class="title-slash">/</span><span>${esc(data.identity.preferredName)}</span>`
                : ""
            }
          </h1>
          <p class="role-line">${esc(data.identity.headline)}</p>
          ${contactMeta({ data, t })}
          <p class="hero-intro">${esc(data.home.intro)}</p>
          <div class="hero-actions">
            <a class="button primary" href="#cv" data-route="cv">
              <span>${esc(t.viewCv)}</span>
              ${icon("arrow-right")}
            </a>
            <button class="button outline" type="button" data-action="export-pdf">
              ${icon("download")}
              <span>${esc(t.downloadPdf)}</span>
            </button>
            <a class="button outline" href="#ai" data-route="ai">
              ${icon("sparkles")}
              <span>${esc(t.talkWithAi)}</span>
            </a>
          </div>
        </div>
      </section>
    `;
  }

  function aboutSection({ data, t }) {
    return `
      <section class="home-section about-section">
        <div class="section-heading">
          <span class="section-icon">${icon("user-round")}</span>
          <h2>${esc(t.about)}</h2>
        </div>
        <div class="about-grid">
          <div class="paragraph-stack">
            ${data.summary.map((item) => `<p>${esc(item)}</p>`).join("")}
          </div>
          <div class="blueprint-illustration" aria-hidden="true">
            <div class="screen">
              <span></span><span></span><span></span>
              <i></i><i></i><i></i>
            </div>
            <div class="chart">
              <b></b><b></b><b></b><b></b>
            </div>
            <div class="code-badge">&lt;/&gt;</div>
          </div>
        </div>
      </section>
    `;
  }

  function skillRows({ data, t }) {
    const groups = (data.toolbox || []).map(
      (group) => `
        <article class="skill-row">
          <strong>${esc(group.label)}</strong>
          <div>
            ${group.items.map((item) => stackTag(item)).join("")}
          </div>
        </article>
      `,
    );

    return `
      <section class="home-section skills-section">
        <div class="section-heading">
          <span class="section-icon">${icon("code-2")}</span>
          <h2>${esc(t.skills)}</h2>
        </div>
        <div class="skill-rows">${groups.join("")}</div>
      </section>
    `;
  }

  function featuredProjects({ data, t }) {
    const homeProjects = data.projects.filter((project) => project.is_show_home);
    const displayProjects = homeProjects.length > 0 ? homeProjects : data.projects.slice(0, 3);
    const projectCards = displayProjects
      .map(
        (project) => `
          <article class="featured-card">
            <span class="project-icon">${icon("scan-line")}</span>
            <h3>${esc(project.name)}</h3>
            <p>${esc(project.description)}</p>
            <div class="mini-tags">
              ${project.stack
                .slice(0, 3)
                .map((item) => `<span>${esc(item)}</span>`)
                .join("")}
            </div>
          </article>
        `,
      )
      .join("");
    const shouldScroll = displayProjects.length > 1;

    return `
      <section class="home-section featured-section">
        <div class="section-heading spread">
          <div>
            <span class="section-icon">${icon("folder")}</span>
            <h2>${esc(t.featuredProjects)}</h2>
          </div>
          <button class="text-link" type="button" data-route="cv">
            <span>${esc(t.viewAllProjects)}</span>
            ${icon("arrow-right")}
          </button>
        </div>
        <div class="featured-grid ${shouldScroll ? "is-scrollable" : ""}">
          <div class="featured-track">
            ${projectCards}
            ${shouldScroll ? projectCards : ""}
          </div>
        </div>
      </section>
    `;
  }

  function footer({ data }) {
    return `
      <footer class="card-footer">
        <span>© ${new Date().getFullYear()} ${esc(data.identity.preferredName)}. All rights reserved.</span>
      </footer>
    `;
  }

  function home(ctx) {
    return `
      <section class="view">
        <div class="site-card home-card">
          ${topbar(ctx)}
          ${hero(ctx)}
          ${aboutSection(ctx)}
          ${skillRows(ctx)}
          ${featuredProjects(ctx)}
          ${footer(ctx)}
        </div>
      </section>
    `;
  }

  function sidebar({ data, t }) {
    const sidebarAvatar =
      identityImages(data.identity)[0] || "assets/avatar.png";
    const preferredName =
      data.identity.preferredName &&
      data.identity.preferredName !== data.identity.name
        ? data.identity.preferredName
        : "";
    const contacts = [
      ["map-pin", data.identity.location],
      ["china-flag", data.identity.nationality ? `${t.nationality} · ${data.identity.nationality}` : ""],
      ["mail", data.identity.email],
      ["phone", data.identity.phone],
      ["wechat", data.identity.wechat],
    ];
    const sidebarSkills =
      data.sidebarSkills ||
      (data.toolbox || []).flatMap((group) => group.items).slice(0, 12);

    return `
      <aside class="cv-sidebar">
        <img class="sidebar-avatar" src="${esc(sidebarAvatar)}" alt="${esc(data.identity.name)}" />
        <h1>${esc(data.identity.name)}</h1>
        ${preferredName ? `<p class="preferred-name">${esc(preferredName)}</p>` : ""}
        <p class="sidebar-role">${esc(data.identity.headline)}</p>
        <div class="contact-list">
          ${contacts
            .filter(([, value]) => value)
            .map(
              ([name, value]) => `
                <div class="contact-item">
                  ${brandIcon(name) || icon(name)}
                  <span>${esc(value)}</span>
                </div>
              `,
            )
            .join("")}
          ${data.identity.links
            .map(
              (link) => `
                <a class="contact-item" href="${esc(link.url)}" target="_blank" rel="noreferrer">
                  ${brandIcon(link.label) || icon(String(link.label).toLowerCase() === "linkedin" ? "linkedin" : "link")}
                  <span>${esc(stripProtocol(link.url))}</span>
                </a>
              `,
            )
            .join("")}
        </div>
        <section class="sidebar-skills">
          <h2>${esc(t.skills)}</h2>
          <div class="tag-cloud">
            ${sidebarSkills.map((item) => stackTag(item)).join("")}
          </div>
        </section>
        <section class="sidebar-block">
          <h2>${esc(t.education)}</h2>
          <div class="plain-list compact-list">
            ${data.education
              .map(
                (item) => `
                  <div class="plain-item">
                    <strong>${esc(item.school)}</strong>
                    <span>${esc(item.degree)} · ${esc(item.major)}</span>
                    <em>${esc(item.period)}</em>
                  </div>
                `,
              )
              .join("")}
          </div>
        </section>
        <section class="sidebar-block">
          <h2>${esc(t.certifications)}</h2>
          <div class="tag-cloud">
            ${data.certifications.map((item) => `<span class="tag">${esc(item)}</span>`).join("")}
          </div>
        </section>
      </aside>
    `;
  }

  function cvSkills({ data, t }) {
    return `
      <section class="cv-section cv-skills-section">
        <h2>${esc(t.coreSkills)}</h2>
        <div class="cv-skill-grid">
          ${(data.skills || [])
            .map(
              (group) => `
                <article class="cv-skill-card">
                  <h3>${esc(group.title)}</h3>
                  <ul>
                    ${group.items.map((item) => `<li>${esc(item)}</li>`).join("")}
                  </ul>
                </article>
              `,
            )
            .join("")}
        </div>
      </section>
    `;
  }

  function projectMedia(project) {
    if (!project.media || project.media.length === 0) return "";
    return `
      <div class="project-media">
        ${project.media
          .map((media) => {
            if (media.type === "video") {
              return `
                <figure class="media-item">
                  <video src="${esc(media.src)}" controls preload="metadata"></video>
                  ${media.caption ? `<figcaption>${esc(media.caption)}</figcaption>` : ""}
                </figure>
              `;
            }
            return `
              <figure class="media-item">
                <img src="${esc(media.src)}" alt="${esc(media.alt || media.caption || project.name)}" loading="lazy" />
                ${media.caption ? `<figcaption>${esc(media.caption)}</figcaption>` : ""}
              </figure>
            `;
          })
          .join("")}
      </div>
    `;
  }

  function cvExperienceList(items) {
    return `
      <div class="experience-list">
        ${items
          .map(
            (item) => `
              <article class="experience-item">
                <div class="experience-header">
                  <h3>${esc(item.company)}</h3>
                  <span>${esc(item.period)}</span>
                </div>
                <p class="experience-role">${esc(item.role)}</p>
                <ul>
                  ${item.items
                    .slice(0, 2)
                    .map((point) => `<li>${esc(point)}</li>`)
                    .join("")}
                </ul>
                ${
                  item.stack
                    ? `<div class="stack-line">${item.stack.map((s) => stackTag(s)).join("")}</div>`
                    : ""
                }
              </article>
            `,
          )
          .join("")}
      </div>
    `;
  }

  function cvTimeline(items, type = "experience") {
    return `
      <div class="timeline ${type === "project" ? "project-timeline" : ""}">
        ${items
          .map(
            (item) => `
              <article class="timeline-item">
                <div class="timeline-date">${esc(item.period)}</div>
                <div class="timeline-dot"></div>
                <div class="timeline-body">
                  ${
                    type === "project"
                      ? `<h3 class="project-heading"><span>${esc(item.name)}</span><span class="category-pill ${esc(item.category || "enterprise")}">${esc(item.type)}</span></h3>`
                      : `<h3>${esc(item.company)}</h3><p class="timeline-subtitle">${esc(item.role)}</p>`
                  }
                  ${
                    type === "project" && item.stack
                      ? `<div class="stack-line stack-line-under-category">${item.stack.map((s) => stackTag(s)).join("")}</div>`
                      : ""
                  }
                  ${type === "project" ? `<p>${esc(item.description)}</p>` : ""}
                  <ul>
                    ${item.items
                      .slice(0, type === "project" ? item.items.length : 2)
                      .map((point) => `<li>${esc(point)}</li>`)
                      .join("")}
                  </ul>
                  ${
                    type !== "project" && item.stack
                      ? `<div class="stack-line">${item.stack.map((s) => stackTag(s)).join("")}</div>`
                      : ""
                  }
                  ${type === "project" ? projectMedia(item) : ""}
                </div>
              </article>
            `,
          )
          .join("")}
      </div>
    `;
  }

  function cv(ctx) {
    const { data, t } = ctx;
    return `
      <section class="view">
        <div class="site-card cv-card">
          ${topbar({ ...ctx, variant: "cv" })}
          <div class="cv-grid">
            ${sidebar(ctx)}
            <article class="cv-document">
              <section class="cv-section">
                <h2>${esc(t.overview)}</h2>
                <div class="paragraph-stack">
                  ${data.summary.map((item) => `<p>${esc(item)}</p>`).join("")}
                </div>
              </section>

              ${cvSkills(ctx)}

              <section class="cv-section">
                <h2>${esc(t.experience)}</h2>
                ${cvExperienceList(data.experience)}
              </section>
            </article>
            <section class="cv-section cv-projects-section">
              <h2>${esc(t.projects)}</h2>
              ${cvTimeline(data.projects, "project")}
            </section>
          </div>
        </div>
      </section>
    `;
  }

  function preview({ state, t }) {
    if (state.unlocked) {
      return `
        <section class="view preview-view">
          <div class="preview-content">
            <button class="text-link" type="button" data-route="cv">${esc(t.backToCv)}</button>
            <h2>${esc(t.maintenancePreview)}</h2>
            <div class="preview-grid">
              <section class="section-block"><h3>${esc(t.contentFiles)}</h3><p>${esc(t.contentHelp)}</p></section>
              <section class="section-block"><h3>${esc(t.pdfExport)}</h3><p>${esc(t.pdfHelp)}</p></section>
              <section class="section-block"><h3>${esc(t.templateSystem)}</h3><p>${esc(t.templateHelp)}</p></section>
            </div>
          </div>
        </section>
      `;
    }

    return `
      <section class="view preview-view">
        <div class="private-card">
          <div class="lock-orb">${icon("lock-keyhole")}</div>
          <h1>${esc(t.privatePreview)}</h1>
          <p>${esc(t.privateHint)}</p>
          <form class="password-form" data-password-form>
            <label class="sr-only" for="passwordInput">${esc(t.privatePreview)}</label>
            <div class="password-row">
              <input id="passwordInput" name="password" type="password" placeholder="${esc(t.passwordPlaceholder)}" autocomplete="current-password" />
              ${icon("eye-off")}
            </div>
            <button class="button primary full" type="submit">
              ${icon("lock")}
              <span>${esc(t.enter)}</span>
            </button>
            <p class="form-error" data-password-error role="status"></p>
          </form>
          <p class="secure-note">${icon("shield-check")} ${esc(t.secureNote)}</p>
        </div>
      </section>
    `;
  }

  function aiAssistant(ctx) {
    const { data, t } = ctx;
    const platforms = [
      ["ChatGPT", "https://chatgpt.com/", "openai"],
      ["Claude", "https://claude.ai/", "anthropic"],
      ["DeepSeek", "https://chat.deepseek.com/", "deepseek"],
    ];

    return `
      <section class="view">
        <div class="site-card ai-card">
          ${topbar(ctx)}
          <section class="ai-panel">
            <div class="ai-panel-copy">
              <span class="section-icon">${icon("bot")}</span>
              <h1>${esc(t.aiTitle)}</h1>
            </div>
            <div class="ai-copy-grid">
              <button class="button primary" type="button" data-action="copy-ai-context" data-context-preset="full">
                ${icon("copy")}
                <span>${esc(t.aiCopyFull)}</span>
              </button>
            </div>
            <p class="ai-copy-status" data-ai-copy-status role="status">${esc(t.aiPasteHint)}</p>
            <section class="ai-platforms" aria-label="${esc(t.aiPlatforms)}">
              <h2>${esc(t.aiPlatforms)}</h2>
              <div>
                ${platforms
                  .map(
                    ([label, url, iconName]) => `
                      <a class="ai-platform-link" href="${esc(url)}" target="_blank" rel="noreferrer">
                        <img class="ai-platform-icon" src="assets/icons/${esc(iconName)}.svg" alt="" aria-hidden="true" />
                        <span>${esc(label)}</span>
                      </a>
                    `,
                  )
                  .join("")}
              </div>
            </section>
          </section>
          ${footer({ data })}
        </div>
      </section>
    `;
  }

  function render(ctx) {
    return ctx.state.route === "cv"
      ? cv(ctx)
      : ctx.state.route === "preview"
        ? preview(ctx)
        : ctx.state.route === "ai"
          ? aiAssistant(ctx)
          : home(ctx);
  }

  try {
    window.CV_APP.registerTemplate("reference", render);
    window.CV_APP.boot();
  } catch (error) {
    const root = document.querySelector("#app");
    if (root) {
      root.innerHTML = `
        <section class="view">
          <div class="site-card" style="max-width: 760px; padding: 32px;">
            <h1 style="margin-top: 0;">Resume startup failed</h1>
            <p>${esc(error.message || error)}</p>
          </div>
        </section>
      `;
    }
    console.error(error);
  }
})();
