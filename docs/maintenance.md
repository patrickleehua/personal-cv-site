# Maintenance Notes

## Single Source of Truth

Maintain resume content only in:

```text
resume.md
```

This file feeds:

- Agent fetch responses,
- homepage content,
- online CV content,
- Chinese/English switching,
- preview copy,
- browser PDF export,
- AI assistant copy context.

There is no generated resume file, deployment workflow, or separate PDF-specific CV content.

## Markdown Structure

```text
# 中文简历 · ...
## 基本信息
## 个人定位
## 个人简介
## 核心能力
## 技术栈
## 侧栏技能（可选，缺省时取技术栈前 12 项）
## 工作经历
## 项目经历
## 教育背景
## 证书

# English Resume · ...
## Identity
## Profile
## Summary
## Core Capabilities
## Tech Stack
## Sidebar Skills (optional; defaults to the first 12 Tech Stack items)
## Experience
## Projects
## Education
## Certifications
```

Keep the field labels, heading levels, and project subsections intact. `content/resume-parser.js` converts this one Markdown document into the data shape consumed by the existing visual template.

## Project Content

The Chinese project section is migrated from the current Overleaf `project.tex` source. Keep project descriptions, stack, and responsibility bullets in `resume.md`; templates should only decide how to display them.

Each project supports:

```text
### Project name
- 时间：...
- 类型：...
- 分类：个人项目
- 技术栈：...

Description paragraph.

#### 主要职责
- Responsibility bullet
```

`media` is optional per project. Use image or video entries:

```text
#### 项目资料
- [Preview](assets/projects/example.png)
- [Demo](assets/projects/example.mp4)
```

## Skill Icons

Homepage skill chips and sidebar core skills are driven by the `技术栈` / `Tech Stack` section in `resume.md`:

```text
## 技术栈
- AI / ML：Python、Spring AI
```

Brand SVGs live in:

```text
assets/icons/
```

The reference template maps common names such as `Python`, `Java`, `Go`, `React`, `GitHub`, `Docker`, `PostgreSQL`, and `Redis` to local SVG files. Unknown names still render as plain tags.

## PDF Workflow

Use the in-page "Download PDF" button. It renders the CV route from the same data and calls browser print/save.

If a future server-side PDF renderer is added, it should consume the same parsed `resume.md` content. Do not reintroduce a hand-maintained PDF copy.

## AI Context Workflow

Open:

```text
index.html#ai
```

The Talk with AI view builds a hidden Markdown CV snippet from the parsed `resume.md` content for pasting into AI assistants. The system-style instruction is UI behavior kept in `content/resume-parser.js`; it is not part of the Agent-facing Markdown document.

If new resume sections are added to `resume.md`, update `content/resume-parser.js` only when the Markdown structure itself changes.

## Template Workflow

Current template:

```text
templates/reference.js
```

To add another template:

1. Create `templates/<name>.js`.
2. Implement a renderer that accepts `{ state, data, allData, t }`.
3. Register it with `window.CV_APP.registerTemplate("<name>", render)`.
4. Set `AppState.template` in `app.js`.

## Access Protection

Local preview route:

```text
index.html#preview
```

Demo password:

```text
patrick-preview
```

This is not real security because the password is client-side. For deployment, prefer Cloudflare Access, Vercel/Netlify deployment protection, or server-side middleware.
