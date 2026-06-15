# Personal CV Site

This directory is an isolated static personal homepage and bilingual CV renderer.

The project uses one maintainable data source:

```text
content/resume-data.js
```

Homepage, online CV, AI copy context, language switching, preview content, and PDF export all render from that same data object. Do not maintain separate PDF-only CV content.

## Open Locally

Open `index.html` in a browser.

No build step is required. The page uses local static dependencies:

- `vendor/lucide.min.js` for icons
- `templates/reference.js` for the current UI template
- `content/resume-data.js` for all resume data

## Routes

The static version uses hash routes:

- `index.html#home`
- `index.html#cv`
- `index.html#ai`
- `index.html#preview`

## Talk With AI

Open `index.html#ai` or click "Talk with AI" to copy a prepared CV context for AI assistants. It reads the same `content/resume-data.js` file.

The page does not show the full generated content. It copies the context to the clipboard so it can be pasted into ChatGPT, Claude, DeepSeek, or another AI chat.

## Editing Content

Edit only:

```text
content/resume-data.js
```

The shape is:

```js
window.RESUME_DATA = {
  zh: { ... },
  en: { ... }
};
```

Both language versions can differ naturally, but they live in one file so maintenance stays centralized.

## Homepage Images

The homepage portrait area supports either one image or multiple rotating images. Keep the original single-image form when only one asset is needed:

```js
avatar: "assets/avatar.png"
```

For multiple images, use an array. They do not have to be avatars:

```js
avatar: ["assets/avatar.png", "assets/photo.jpg"]
```

You can also use richer media objects:

```js
media: [
  { type: "image", src: "assets/avatar.png", alt: "Portrait" },
  { type: "image", src: "assets/photo.jpg", alt: "Work photo" }
]
```

The homepage automatically rotates multiple images. The CV sidebar uses the first image as the static profile image for printing/export.

## Template Switching

The current screenshot-matching template is:

```text
templates/reference.js
```

Future templates should register a renderer:

```js
window.CV_APP.registerTemplate("template-name", render);
```

Then change `AppState.template` in `app.js`.

## Project Media

Projects can optionally include preview media:

```js
media: [
  { type: "image", src: "assets/projects/demo.png", alt: "Dashboard preview", caption: "Dashboard" },
  { type: "video", src: "assets/projects/demo.mp4", caption: "Workflow demo" }
]
```

Leave `media: []` when a project has no preview assets. The template hides the media area automatically.

## PDF Export

Clicking "Download PDF" switches to the CV view and opens browser print/save. This exports the same rendered CV content, so the PDF does not drift from the online version.

## Preview Password

The demo preview password is:

```text
patrick-preview
```

This is only a client-side preview gate. For real deployment, use platform-level protection or server-side middleware.
