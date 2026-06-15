# Maintenance Notes

## Single Source of Truth

Maintain resume content only in:

```text
content/resume-data.js
```

This file feeds:

- homepage content,
- online CV content,
- Chinese/English switching,
- preview copy,
- browser PDF export,
- AI assistant copy context.

There are no separate JSON files and no separate PDF-specific CV content in the static MVP.

## Data Shape

```js
window.RESUME_DATA = {
  zh: {
    identity: {},
    aiContext: {},
    home: {},
    summary: [],
    skills: [],
    toolbox: [],
    experience: [],
    projects: [],
    education: [],
    certifications: []
  },
  en: {
    // same shape, independently authored text
  }
};
```

## Project Content

The Chinese project section is migrated from the current Overleaf `project.tex` source. Keep project descriptions, stack, and responsibility bullets in `content/resume-data.js`; templates should only decide how to display them.

Each project supports:

```js
{
  period: "",
  name: "",
  type: "",
  category: "personal", // or "enterprise"
  description: "",
  stack: [],
  media: [],
  items: []
}
```

`media` is optional per project. Use image or video entries:

```js
media: [
  { type: "image", src: "assets/projects/example.png", alt: "Preview", caption: "Preview" },
  { type: "video", src: "assets/projects/example.mp4", caption: "Demo" }
]
```

## Skill Icons

Homepage skill chips and sidebar core skills are driven by:

```js
toolbox: [
  { label: "AI / ML", items: ["Python", "Spring AI"] }
]
```

Brand SVGs live in:

```text
assets/icons/
```

The reference template maps common names such as `Python`, `Java`, `Go`, `React`, `GitHub`, `Docker`, `PostgreSQL`, and `Redis` to local SVG files. Unknown names still render as plain tags.

## PDF Workflow

Use the in-page "Download PDF" button. It renders the CV route from the same data and calls browser print/save.

If a future server-side PDF renderer is added, it should consume `RESUME_DATA` or the same migrated content source. Do not reintroduce a hand-maintained PDF copy.

## AI Context Workflow

Open:

```text
index.html#ai
```

The Talk with AI view builds a hidden Markdown CV snippet from `content/resume-data.js` for pasting into AI assistants. The system-style instruction lives in each locale under:

```js
aiContext: {
  systemPrompt: [],
  cvInstruction: ""
}
```

If new resume sections are added to `RESUME_DATA`, update the AI copy generation in `app.js` so the generated AI context stays complete.

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
