(function () {
  "use strict";

  const LOCALE_CONFIG = {
    zh: {
      siteTitle: "李炳桦 | 个人主页与简历",
      description: "AI 应用开发、AI Agent、RAG 与企业级后端工程简历。",
      nav: { home: "主页", cv: "简历", download: "下载 PDF", language: "EN" },
      home: {
        eyebrow: "个人主页 / 在线简历",
        primaryAction: "查看在线简历",
        secondaryAction: "下载 PDF",
      },
      labels: {
        identity: ["个人身份", "基本信息", "Identity"],
        profile: ["个人定位", "Profile"],
        summary: ["个人简介", "简介", "Summary"],
        stats: ["关键数据", "Key Metrics"],
        skills: ["核心能力", "Core Capabilities"],
        toolbox: ["技术栈", "Tech Stack"],
        sidebarSkills: ["侧栏技能", "Sidebar Skills"],
        experience: ["工作经历", "Experience"],
        projects: ["项目经历", "Projects"],
        education: ["教育背景", "Education"],
        certifications: ["证书", "Certifications"],
        responsibilities: ["主要职责", "Responsibilities"],
        materials: ["项目资料", "Project Materials"],
      },
      fieldAliases: {
        name: ["姓名", "Name"],
        preferredName: ["常用名", "Preferred name"],
        headline: ["职位", "Headline"],
        location: ["所在地", "Location"],
        nationality: ["国籍", "Nationality"],
        years: ["经验", "Experience"],
        educationLevel: ["学历", "Education"],
        email: ["邮箱", "Email"],
        phone: ["电话", "Phone"],
        wechat: ["微信", "WeChat"],
        period: ["时间", "Period"],
        type: ["类型", "Type"],
        category: ["分类", "Category"],
        stack: ["技术栈", "Stack"],
        showOnHome: ["首页展示", "Show on home"],
      },
      aiContext: {
        systemPrompt: [
          "# System Prompt",
          "你将收到一份候选人的 CV 内容。请把这份 CV 作为唯一可信的候选人背景材料，用它来回答用户后续关于候选人能力、项目经验、岗位匹配度、面试准备、简历优化、求职沟通、技术方案表达等问题。",
          "回答时请遵守以下规则：",
          "- 优先依据 CV 中的事实回答，不要编造 CV 没有出现的公司、项目、成果、学历、证书或技术经历。",
          "- 如果用户的问题超出 CV 信息范围，请明确说明 CV 中没有相关信息，并基于已有背景给出谨慎建议。",
          "- 当用户需要面向 HR、招聘方、面试官或业务方的表达时，请把回答整理得专业、清晰、可信，突出候选人的 AI 应用开发、AI Agent、RAG、后端工程化和全栈交付能力。",
          "- 如果用户要求你改写、总结或生成文案，请直接产出可使用的版本，不要只复述 CV。",
          "",
          "以下是候选人的 CV 内容：",
        ],
        cvInstruction:
          "以下是我的个人能力、技能栈、项目经历和求职定位。请把它作为理解我的背景与可交付能力的上下文，在后续回答中结合这些信息给出更贴近我的建议、方案或文案。",
      },
    },
    en: {
      siteTitle: "Patrick Lee | Personal Site and CV",
      description: "AI application development, AI Agent, RAG, and backend engineering CV.",
      nav: { home: "Home", cv: "CV", download: "Download PDF", language: "中文" },
      home: {
        eyebrow: "Personal site / Online CV",
        primaryAction: "View online CV",
        secondaryAction: "Download PDF",
      },
      labels: {
        identity: ["Identity", "个人身份", "基本信息"],
        profile: ["Profile", "个人定位"],
        summary: ["Summary", "个人简介", "简介"],
        stats: ["Key Metrics", "关键数据"],
        skills: ["Core Capabilities", "核心能力"],
        toolbox: ["Tech Stack", "技术栈"],
        sidebarSkills: ["Sidebar Skills", "侧栏技能"],
        experience: ["Experience", "工作经历"],
        projects: ["Projects", "项目经历"],
        education: ["Education", "教育背景"],
        certifications: ["Certifications", "证书"],
        responsibilities: ["Responsibilities", "主要职责"],
        materials: ["Project Materials", "项目资料"],
      },
      fieldAliases: {
        name: ["Name", "姓名"],
        preferredName: ["Preferred name", "常用名"],
        headline: ["Headline", "职位"],
        location: ["Location", "所在地"],
        nationality: ["Nationality", "国籍"],
        years: ["Experience", "经验"],
        educationLevel: ["Education", "学历"],
        email: ["Email", "邮箱"],
        phone: ["Phone", "电话"],
        wechat: ["WeChat", "微信"],
        period: ["Period", "时间"],
        type: ["Type", "类型"],
        category: ["Category", "分类"],
        stack: ["Stack", "技术栈"],
        showOnHome: ["Show on home", "首页展示"],
      },
      aiContext: {
        systemPrompt: [
          "# System Prompt",
          "You will receive a candidate's CV. Treat this CV as the only trusted background source for the candidate, and use it to answer follow-up questions about the candidate's capabilities, project experience, role fit, interview preparation, CV improvement, job-search communication, and technical positioning.",
          "Follow these rules:",
          "- Base your answers on facts from the CV first. Do not invent companies, projects, achievements, education, certificates, or technical experience that are not present in the CV.",
          "- If the user's question goes beyond the CV, state that the CV does not contain that information, then give careful suggestions based on the available background.",
          "- When writing for HR, recruiters, interviewers, or business stakeholders, make the answer professional, clear, credible, and focused on the candidate's AI application development, AI Agent, RAG, backend engineering, and full-stack delivery strengths.",
          "- If the user asks you to rewrite, summarize, or generate copy, produce a directly usable version instead of merely restating the CV.",
          "",
          "Here is the candidate's CV:",
        ],
        cvInstruction:
          "Below is my personal capability context, including skills, project experience, and career positioning. Use it as background when giving advice, plans, writing, or technical recommendations for me.",
      },
    },
  };

  function clean(value) {
    return String(value == null ? "" : value)
      .replace(/\s*\n+\s*/g, " ")
      .trim();
  }

  function normalized(value) {
    return clean(value).toLowerCase().replace(/[：:]/g, "").replace(/\s+/g, "");
  }

  function matches(value, aliases) {
    const target = normalized(value);
    return aliases.some((alias) => normalized(alias) === target);
  }

  function splitHeadingBlocks(input, level) {
    const lines = Array.isArray(input) ? input.slice() : String(input || "").split("\n");
    const marker = "#".repeat(level);
    const heading = new RegExp(`^${marker}\\s+(.+?)\\s*$`);
    const preamble = [];
    const blocks = [];
    let current = null;

    for (const line of lines) {
      const match = line.match(heading);
      if (match) {
        current = { title: clean(match[1]), lines: [] };
        blocks.push(current);
      } else if (current) {
        current.lines.push(line);
      } else {
        preamble.push(line);
      }
    }

    return { preamble, blocks };
  }

  function section(blocks, aliases) {
    return blocks.find((block) => matches(block.title, aliases)) || null;
  }

  function fieldLine(line) {
    const match = String(line || "").match(/^\s*-\s+([^：:]+)[：:]\s*(.+?)\s*$/);
    return match ? { label: clean(match[1]), value: clean(match[2]) } : null;
  }

  function fields(lines) {
    return lines.map(fieldLine).filter(Boolean);
  }

  function fieldValue(items, aliases) {
    const item = items.find((entry) => matches(entry.label, aliases));
    return item ? item.value : "";
  }

  function bulletItems(lines) {
    return lines
      .map((line) => String(line || "").match(/^\s*[-*]\s+(.+?)\s*$/))
      .filter(Boolean)
      .map((match) => clean(match[1]));
  }

  function paragraphs(lines) {
    const result = [];
    let current = [];

    function flush() {
      if (current.length) result.push(clean(current.join(" ")));
      current = [];
    }

    for (const line of lines) {
      if (!clean(line)) {
        flush();
      } else if (/^\s*[-*]\s+/.test(line) || /^\s*\|/.test(line)) {
        flush();
      } else {
        current.push(line);
      }
    }
    flush();
    return result;
  }

  function parseTable(lines) {
    const rows = lines
      .filter((line) => /^\s*\|/.test(line))
      .map((line) => line.split("|").slice(1, -1).map(clean));
    if (rows.length < 2) return [];
    return rows.slice(1).filter((row) => row.length >= 2 && !row.every((cell) => /^-+$/.test(cell))).map((row) => ({
      value: row[1],
      label: row[0],
    }));
  }

  function parseLinks(lines) {
    const result = [];
    for (const line of lines) {
      const match = line.match(/^\s*[-*]\s+\[([^\]]+)\]\(([^)]+)\)/);
      if (match) result.push({ label: clean(match[1]), url: clean(match[2]) });
    }
    return result;
  }

  function parseIdentity(block, config, locale) {
    const items = fields(block ? block.lines : []);
    const get = (key) => fieldValue(items, config.fieldAliases[key]);
    const knownLinks = ["GitHub", "Telegram", "LinkedIn", "GitLab", "Portfolio"];
    const links = items
      .filter((item) => knownLinks.some((label) => normalized(label) === normalized(item.label)) || /^https?:\/\//i.test(item.value))
      .map((item) => ({ label: item.label, url: item.value }));

    const name = get("name");
    const preferredName = get("preferredName") || name;
    return {
      name,
      preferredName,
      headline: get("headline"),
      location: get("location"),
      nationality: get("nationality"),
      email: get("email"),
      phone: get("phone"),
      years: get("years"),
      educationLevel: get("educationLevel"),
      avatar: ["assets/avatar.png", "assets/self-pic-1.png"],
      links,
      wechat: get("wechat"),
      locale,
    };
  }

  function parseProfile(block) {
    const content = block ? block.lines : [];
    const text = paragraphs(content);
    return {
      title: text[0] || "",
      intro: text[1] || text[0] || "",
      highlights: bulletItems(content),
    };
  }

  function parseSkills(block, config) {
    if (!block) return [];
    return splitHeadingBlocks(block.lines, 3).blocks.map((entry) => ({
      title: entry.title,
      items: bulletItems(entry.lines),
    })).filter((entry) => entry.title && entry.items.length);
  }

  function parseToolbox(block) {
    if (!block) return [];
    return fields(block.lines).map((item) => ({
      label: item.label,
      items: item.value.split(/[、,，]\s*/).map(clean).filter(Boolean),
    })).filter((entry) => entry.label && entry.items.length);
  }

  function filteredBulletItems(lines, aliases) {
    return lines.filter((line) => {
      const item = fieldLine(line);
      return !item || !aliases.some((alias) => matches(item.label, [alias]));
    }).map((line) => line).filter((line) => /^\s*[-*]\s+/.test(line));
  }

  function parseExperience(block, config) {
    if (!block) return [];
    const periodAliases = config.fieldAliases.period;
    return splitHeadingBlocks(block.lines, 3).blocks.map((entry) => {
      const items = fields(entry.lines);
      return {
        period: fieldValue(items, periodAliases),
        company: entry.title.split(" · ")[0].trim(),
        role: entry.title.includes(" · ") ? entry.title.split(" · ").slice(1).join(" · ").trim() : "",
        items: bulletItems(filteredBulletItems(entry.lines, periodAliases)),
      };
    }).filter((entry) => entry.company);
  }

  function categoryValue(value) {
    const target = normalized(value);
    if (target === "个人项目" || target === "personalproject" || target === "personal") return "personal";
    if (target === "企业项目" || target === "enterpriseproject" || target === "enterprise") return "enterprise";
    return clean(value);
  }

  function parseProjects(block, config) {
    if (!block) return [];
    const nestedAliases = config.labels;
    return splitHeadingBlocks(block.lines, 3).blocks.map((entry, index) => {
      const nested = splitHeadingBlocks(entry.lines, 4);
      const metadata = fields(nested.preamble);
      const description = paragraphs(nested.preamble.filter((line) => !fieldLine(line)));
      const responsibility = section(nested.blocks, nestedAliases.responsibilities);
      const materials = section(nested.blocks, nestedAliases.materials);
      const stack = fieldValue(metadata, config.fieldAliases.stack)
        .split(/[、,，]\s*/).map(clean).filter(Boolean);
      const showOnHome = fieldValue(metadata, config.fieldAliases.showOnHome);

      return {
        period: fieldValue(metadata, config.fieldAliases.period),
        name: entry.title,
        is_show_home: /^(是|yes|true|1)$/i.test(showOnHome) || (!showOnHome && index < 5),
        type: fieldValue(metadata, config.fieldAliases.type),
        category: categoryValue(fieldValue(metadata, config.fieldAliases.category)),
        description: description.join("\n\n"),
        stack,
        media: materials ? parseLinks(materials.lines) : [],
        items: responsibility ? bulletItems(responsibility.lines) : [],
      };
    }).filter((entry) => entry.name);
  }

  function parseEducation(block) {
    if (!block) return [];
    return bulletItems(block.lines).map((item) => {
      const parts = item.split(/\s+·\s+/).map(clean).filter(Boolean);
      return {
        school: parts[0] || "",
        major: parts[1] || "",
        degree: parts[2] || "",
        period: parts[3] || "",
      };
    }).filter((entry) => entry.school);
  }

  function parseLocale(title, body, locale) {
    const config = LOCALE_CONFIG[locale];
    const root = splitHeadingBlocks(body, 2).blocks;
    const identity = parseIdentity(section(root, config.labels.identity), config, locale);
    const profile = parseProfile(section(root, config.labels.profile));
    const toolbox = parseToolbox(section(root, config.labels.toolbox));
    const sidebarSkills = bulletItems(section(root, config.labels.sidebarSkills)?.lines || [])
      .flatMap((item) => item.split(/[、,，]\s*/))
      .map(clean)
      .filter(Boolean);

    return {
      locale,
      meta: {
        siteTitle: config.siteTitle,
        description: config.description,
      },
      nav: config.nav,
      aiContext: config.aiContext,
      identity,
      home: {
        eyebrow: config.home.eyebrow,
        title: profile.title,
        intro: profile.intro,
        highlights: profile.highlights,
        primaryAction: config.home.primaryAction,
        secondaryAction: config.home.secondaryAction,
      },
      summary: bulletItems(section(root, config.labels.summary)?.lines || []),
      stats: parseTable(section(root, config.labels.stats)?.lines || []),
      skills: parseSkills(section(root, config.labels.skills), config),
      toolbox,
      sidebarSkills: sidebarSkills.length
        ? sidebarSkills
        : toolbox.flatMap((group) => group.items).slice(0, 12),
      experience: parseExperience(section(root, config.labels.experience), config),
      projects: parseProjects(section(root, config.labels.projects), config),
      education: parseEducation(section(root, config.labels.education)),
      certifications: bulletItems(section(root, config.labels.certifications)?.lines || []),
      downloads: {
        strategy: "browser-print",
        label: config.home.secondaryAction,
      },
      privateAccess: {
        enabled: true,
        protectedSections: ["preview"],
      },
    };
  }

  function parse(markdown) {
    const lines = String(markdown || "").replace(/\r\n?/g, "\n").split("\n");
    const documents = [];
    let current = null;

    for (const line of lines) {
      const heading = line.match(/^#\s+(.+?)\s*$/);
      if (heading) {
        if (current) documents.push(current);
        current = { title: clean(heading[1]), lines: [] };
      } else if (current) {
        current.lines.push(line);
      }
    }
    if (current) documents.push(current);

    const zhDocument = documents.find((document) => /中文|简历/.test(document.title));
    const enDocument = documents.find((document) => /english|resume/i.test(document.title) && document !== zhDocument);
    if (!zhDocument || !enDocument) {
      throw new Error("resume.md must contain both Chinese and English resume sections");
    }

    return {
      zh: parseLocale(zhDocument.title, zhDocument.lines.join("\n"), "zh"),
      en: parseLocale(enDocument.title, enDocument.lines.join("\n"), "en"),
    };
  }

  const sourceUrl = typeof document !== "undefined" && document.currentScript
    ? new URL("../resume.md", document.currentScript.src).toString()
    : "resume.md";

  window.CV_RESUME_PARSER = { parse };
  window.CV_RESUME_DATA_READY = fetch(sourceUrl)
    .then((response) => {
      if (!response.ok) throw new Error(`Unable to load resume.md (${response.status})`);
      return response.text();
    })
    .then((markdown) => {
      const data = parse(markdown);
      window.RESUME_DATA = data;
      return data;
    });
})();
