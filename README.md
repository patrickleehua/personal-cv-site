# Personal CV Site

This directory is an isolated static personal homepage and bilingual CV renderer.

The project uses one maintainable resume source:

```text
resume.md
```

The Agent fetches this file directly. The homepage, online CV, language switching, AI copy context, preview content, and PDF export all parse and render the same Markdown source. Do not maintain a separate JavaScript or PDF-only CV copy.

## Open Locally

Serve this directory through a local web server and open `index.html`. The page fetches `resume.md`, so opening the HTML directly with `file://` is not supported.

No build step is required for deployment. The page uses local static dependencies:

- `vendor/lucide.min.js` for icons
- `templates/reference.js` for the current UI template
- `content/resume-parser.js` to parse `resume.md`

## Routes

The static version uses hash routes:

- `index.html#home`
- `index.html#cv`
- `index.html#ai`
- `index.html#preview`

## Talk With AI

Open `index.html#ai` or click "Talk with AI" to copy a prepared CV context for AI assistants. It reads the same parsed content as the homepage.

The page does not show the full generated content. It copies the context to the clipboard so it can be pasted into ChatGPT, Claude, DeepSeek, or another AI chat.

For an Agent that can fetch a URL, use:

```text
https://patrickleehua.is-a.dev/resume.md
```

## Editing Content

Edit only:

```text
resume.md
```

The file contains both the Chinese and English resume sections. Keep the existing heading structure so the browser parser can render the content correctly. No generation command or GitHub workflow is required.

## Homepage Images

The homepage portrait is presentation configuration, not resume content. The current parser uses these local assets:

```text
assets/avatar.png
assets/self-pic-1.png
```

The homepage rotates both images. The CV sidebar uses the first image for printing/export.

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

Projects can optionally include preview media in the Markdown project section:

```text
#### 项目资料
- [Dashboard preview](assets/projects/demo.png)
- [Workflow demo](assets/projects/demo.mp4)
```

Leave out the `项目资料` section when a project has no preview assets. The template hides the media area automatically.

## PDF Export

Clicking "Download PDF" switches to the CV view and opens browser print/save. This exports the same rendered CV content, so the PDF does not drift from the online version.

## Preview Password

The demo preview password is:

```text
patrick-preview
```

This is only a client-side preview gate. For real deployment, use platform-level protection or server-side middleware.
