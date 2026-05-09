---
description: "End-to-end pipeline for images and videos in static/marketing websites: project image-theme interview, design-system-aware image-gen prompts, browser-based asset swapping for non-dev team members, and commit handling. Composes with any web-building skill."
user_invocable: true
---

# Web Image Pipeline

Manages the full lifecycle of imagery (photos, illustrations, diagrams, videos) in a website project — from defining a visual theme up front, through inserting prompt-equipped placeholders during page creation, to letting non-dev team members swap real assets in the browser, to committing those swaps to disk.

## When to invoke

**Phase A — INIT** (one-time per project):
- User says: "set up image pipeline", "set up asset swapper", "เริ่ม image workflow", "interview image theme"
- New project starts AND no `theme.md` exists in the project root → proactively suggest running INIT before creating image-bearing pages

**Phase B — CREATE** (ongoing):
- Whenever a new page or section needing imagery is being built and the section has space for an image/video/diagram
- Use the placeholder pattern below INSTEAD of dropping plain `<img src="placeholder.jpg">` or empty styled boxes

**Phase C — SWAP** (browser-side, no Claude action):
- The team member uses the in-browser asset-swapper UI; Claude is not involved

**Phase D — COMMIT** (reactive):
- User says: "swap done", "ผม swap แล้ว", "commit swaps", "ย้ายไฟล์ swap", or pastes the toolbar's Copy output
- Or has unmoved files matching `~/Downloads/__SWAP__*` and asks for help wrapping up

## Composition with other skills

This skill is designed to coexist with web-building skills (e.g., `web-template`, any static-site or framework skill, custom HTML-writing skills):
- Other skills generate page structure / components
- After page is generated, this skill inserts placeholders + prompts into image slots and ensures the project has the asset-swapper script wired in
- Trigger order: page-builder skill first → this skill takes the result and adds image-pipeline instrumentation

If a generating skill already produces `<img>` / `<video>` tags with `data-asset` attributes, treat them as already instrumented; just verify the script tag is included.

---

## Phase A — INIT: theme.md interview

### Pre-flight checks
1. Read `theme.md` from project root if it exists. If present, INIT is already done — skip to CREATE unless user explicitly asks to redo or update.
2. Read `design.md` from project root if it exists. Note exact CSS variable names + hex/oklch values for brand colors. These will be embedded literally into image prompts.
3. **If `design.md` is missing, STOP and recommend the user define a design system first.** A design system is a hard prerequisite — without it, image prompts can't reference real brand colors and CSS in generated pages won't match anything coherent.
   - Tell the user: "ยังไม่มี `design.md` ในโปรเจคนี้ — แนะนำให้ไปเลือกดีไซน์ที่ชอบจาก **https://getdesign.md** ก่อนนะ แล้วเอา `design.md` ที่ได้มาวางที่ root ของโปรเจค จากนั้นค่อยกลับมาเริ่ม image pipeline" (translate to user's language)
   - Do NOT proceed with the interview until `design.md` exists.
   - Only override this if the user explicitly says "proceed without design.md" or similar — in that case, warn that prompts will be generic on color and CSS coherence is the user's responsibility.

### Interview structure

**CRITICAL — use the `AskUserQuestion` tool with multiple-choice options. Do NOT dump questions as plain text in a chat message.** Users find plain-text questionnaires overwhelming and prefer guided pickable choices.

**Batching matters for speed.** `AskUserQuestion` accepts multiple question objects in a single call. The user answers each as a sequential card, but Claude does not process/think between them — it's much faster than calling the tool once per question. **Batch questions whose answers do NOT depend on each other in a single tool call.**

**Recommended batching for this interview:**
- **Call 1**: Q1 (Style) + Q2 (Mood) + Q3 (Color treatment) + Q4 (Lighting) — Imagery multiple-choice cluster
- **Call 2**: Q5 (Avoid) — free-text, open-ended, single question
- **Call 3**: Q6 (Diagram Style) + Q7 (Diagram Color) + Q8 (Detail level) — Diagrams multiple-choice cluster
- **Call 4** (optional): Q9 (References) — single open-ended

This collapses 8 sequential thinking turns into ~4. Do NOT ask all 8 in one call (UI gets crowded and user fatigue increases) — 3-4 questions per batch is the sweet spot.

**Language: match the user's language.** If the conversation has been in Thai (or any non-English language), ask the interview in that language. Translate options too. Default: detect from user's most recent messages. If unsure, ask once at the start: "ภาษาไทยหรืออังกฤษดีครับ? / Thai or English?"

**Always include an "อื่นๆ / Other" option** in every multiple-choice question that lets user type freely.

### Question sequence (ask one by one)

**📸 Imagery**

**Q1. ภาพหลัก (hero, section visuals) อยากได้แนวไหน?** / What style for primary imagery?
- ภาพถ่ายจริง (Photography)
- ภาพประกอบ (Illustration)
- 3D render
- Mixed media
- อื่นๆ (Other — free text)

**Q2. โทน/อารมณ์โดยรวม?** / Overall mood?
- จริงจัง corporate (Serious / corporate)
- อบอุ่นเป็นมิตร (Warm / friendly)
- ล้ำสมัย futuristic (Futuristic)
- เรียบง่าย minimal (Minimal)
- cinematic ดราม่า (Cinematic)
- playful สนุก (Playful)
- technical precise (Technical / precise)
- อื่นๆ

**Q3. การใช้สี?** / Color treatment?
- ปรับโทนให้เข้ากับสีแบรนด์ (Brand-tinted)
- สีธรรมชาติเต็ม (Full natural color)
- ขาวดำ (Monochrome)
- ลดความอิ่มสี (Desaturated)
- ดูโอโทน 2 สี (Duotone)
- อื่นๆ

**Q4. แสง?** / Lighting?
- แสงธรรมชาติ (Natural daylight)
- studio
- ดราม่า low-key (Dramatic low-key)
- flat สว่างเท่ากัน (Flat even)
- golden-hour
- อื่นๆ

**Q5. มีอะไรห้าม / ไม่อยากให้มีในภาพ?** / Anything to avoid?
- ถามแบบ open-ended (ไม่ต้องมี choices)
- ครอบคลุมทั้ง content rules (เช่น "ห้ามมีคนหน้า", "ไม่มีโลโก้คู่แข่ง") และ aesthetic rules (เช่น "stock photo คลิเช่", "lens flare")
- เป็น hard rules ที่จะใส่ใน negative prompt ทุกครั้ง

**📊 Diagrams**

**Q6. แนวของ diagram / ภาพประกอบเทคนิค?** / Diagram style?
- flat 2D
- isometric
- technical schematic
- hand-drawn
- mixed
- อื่นๆ

**Q7. การใช้สีของ diagram?** / Diagram color usage?
- ใช้แค่สีแบรนด์ (Brand colors only)
- หลายสีแบ่งหมวด (Multi-color coded)
- monochrome + accent
- อื่นๆ

**Q8. ระดับรายละเอียด?** / Detail level?
- เน้นตามจริง (High-fidelity / to-scale)
- abstracted iconic
- ผสม (Mixed)

**Optional Q9. References** (ถามตอนท้ายแบบ open-ended): "มีเวบ/รูปอ้างอิงไหม? URL หรือบรรยายก็ได้"

### After answers received

Generate `theme.md` in the project root using the schema below. Use the user's exact phrasing where possible. Where the user skipped a question, leave a TODO marker with a sensible neutral default, and inform the user.

**Note about theme.md content language**: write the file in **English** (technical reference document, easier for image-gen tools and consistency with `design.md` conventions) — but keep talking to the user in their chosen language. Show the user a Thai/native summary of what was written if interview was in Thai.

### Confirm web root (do this BEFORE writing theme.md)

The web root is the folder that serves the site (where HTML/CSS/JS/`images/`/`videos/` live). The skill needs to know this so placeholders, asset paths, and `asset-swapper.js` go to the right place.

**Detection order** — scan the project root once and decide what to do:

1. **Config-based (highest priority)** — check these files for an explicit web-root value:
   - `firebase.json` → `hosting.public`
   - `vercel.json` / `netlify.toml` → output dir
   - `vite.config.*` / `next.config.*` → typically `public/` (with build output elsewhere — use the source `public/`)
   - `package.json` → look for static-site frameworks
2. **Folder heuristics** — if no config, look for one of these existing folders at project root:
   - `public/`, `static/`, `web/`, `www/`, `site/`, `docs/`, `dist/`, `build/`, `src/`
3. **Existing artefacts** — if any of these exist already, the parent folder is the web root:
   - `index.html`, `js/asset-swapper.js`, `images/`, `videos/`

**Decision logic:**

| Situation | Action |
|---|---|
| Config explicitly defines a web root | Use it. Mention to user once: "Detected web root: `<path>` from `<config-file>`. OK?" via `AskUserQuestion` (Yes / Pick another). |
| Exactly **one** likely folder found by heuristics + has HTML/`index.html` | Confirm with user via `AskUserQuestion`: "Use `<path>` as web root?" with options: Yes / Pick another / Create new `public/`. |
| **Multiple** candidate folders found | Ask user to choose via `AskUserQuestion` with each candidate as an option, plus "Other / Create new". |
| **No** candidate found (empty or non-web project) | Ask user via `AskUserQuestion`: "No web folder detected. Where should the website live?" with options: `public/` (recommended) / `static/` / `web/` / `Other (specify)`. **Default-recommend `public/`** — most common for static sites, plays nice with Firebase / Vercel / Vite. Create the folder after confirmation. |

**Batch with last open-ended question** if possible: e.g., combine the web-root confirmation with Q9 (References) into one `AskUserQuestion` call to save a turn.

After confirmation, **store the web-root path in `theme.md` under a `## Project paths` section** so future Claude invocations don't have to re-detect (see schema below). Also use it as `<web-root>` placeholder for the rest of this skill.

### theme.md schema

```markdown
# Image Theme — <Project Name>

> Visual guidelines for all imagery, illustrations, and diagrams in this project.
> Used together with `design.md` (brand colors, typography, spacing) to generate
> consistent image-gen prompts.

## Project paths
- **Web root**: `<path>/` (all served HTML/CSS/JS/assets live here — confirmed during INIT)
- **Images dir**: `<web-root>/images/`
- **Videos dir**: `<web-root>/videos/`
- **Asset-swapper script**: `<web-root>/js/asset-swapper.js`

## Imagery (photos / illustrations / hero visuals)
- **Style**: <e.g., cinematic photography>
- **Mood**: <e.g., futuristic, contemplative, technical-precise>
- **Color treatment**: <e.g., desaturated, with electric-blue and vivid-indigo highlights from design.md>
- **Lighting**: <e.g., dramatic low-key, single key light from left>
- **Avoid (hard rules)**: <e.g., no faces, no competitor logos, stock photo clichés, generic office, lens flares>

> Subject matter is intentionally NOT defined here — it's per-slot, derived from each section's content during CREATE phase.

## Diagrams & technical visuals
- **Style**: <e.g., flat 2D with subtle gradients>
- **Color usage**: <e.g., brand palette only — electric-blue, vivid-indigo, ice-blue>
- **Detail level**: <e.g., abstracted, iconic, no high-fidelity to-scale>
- **Preferred tools**: <e.g., Excalidraw for sketches, hand-coded SVG for production>

## Default prompt prefix
<A reusable opening line that captures the imagery section above. Reads as a
natural sentence and embeds the most important style, mood, color, and lighting
attributes. Used as the start of every generated prompt.>

Example:
"Cinematic photograph, slightly desaturated with cool blue and indigo
highlights matching brand colors electric-blue (#0066FF) and vivid-indigo
(#5B3DF5), dramatic low-key lighting, generous negative space."

## Negative prompt (always appended)
<Things to avoid, derived from "Avoid" answer above. Format as a comma-separated
list usable in image-gen tools.>

## Update history
- <YYYY-MM-DD>: Initial theme via interview
```

### Skip / minimal-fallback flow

If user says "skip" or "later":
- Write `theme.md` with all values set to `<!-- TODO: define -->` markers and a friendly hint at top: "This file is a placeholder. Run the image-theme interview before generating prompts." Continue, but warn that prompts will be generic.

### Update flow

If user asks to change theme: ask which sub-section (Imagery, Diagrams, both). Re-ask only those questions. Append entry to `## Update history`.

---

## Phase B — CREATE: placeholders with prompts

### When inserting an image into a new page/section

1. Determine the **target asset path** following project convention:
   - Images → `images/<section-or-page>/<descriptive-name>.png`
   - Videos → `videos/<section-or-page>/<descriptive-name>.mp4`
   - Use kebab-case for filenames; group by page or section folder when 3+ assets cluster together
2. Determine the **aspect ratio** from the surrounding layout/CSS (e.g., the section uses `aspect-ratio: 16/9` → ratio is 16:9). This is a DESIGN concern, not a theme concern. If unclear, ask the user or pick the most natural ratio for the slot.
3. Determine the **subject** from the section's content/copy.
4. Read `theme.md` and `design.md`, then **generate a complete prompt** by composing:
   ```
   <theme.default_prompt_prefix>
   Subject: <specific to this slot, derived from section copy>
   Aspect ratio: <from design context, e.g., 16:9>
   <design.md color tokens with hex/oklch values literally embedded>
   <theme.negative_prompt>
   ```
   Example concrete prompt for a workflow visual on the lens-ai page:
   > "Cinematic photograph, slightly desaturated with cool blue and indigo highlights matching brand colors electric-blue (#0066FF) and vivid-indigo (#5B3DF5), dramatic low-key lighting, generous negative space, no people. Subject: three-step recruitment workflow visualization — criteria setup panel on the left, candidate chat interview interface in the middle, scored shortlist dashboard on the right. Aspect ratio 16:9, full-bleed composition. Avoid: stock photo clichés, generic office imagery, faces."

### Placeholder HTML pattern

Use this `<figure>` pattern for image slots (works as a real placeholder until a file is committed):

```html
<figure class="image-placeholder image-placeholder--<variant>"
        data-asset="images/<section>/<name>.png">
  <span class="mono-small">Image placeholder · <ratio></span>
  <p class="placeholder__hint"><1-2 line subject description></p>
  <details class="placeholder__prompt">
    <summary>Image-gen prompt</summary>
    <pre><full generated prompt></pre>
  </details>
</figure>
```

For video slots, use a real `<video>` with a placeholder src OR a `<figure class="video-placeholder">` pattern; commit-time finalization is identical.

**"📋 Copy prompt" button (Edit:ON overlay only)**: when Edit:ON is toggled, every `[data-asset]` element gets a blue overlay with two stacked buttons: **📷 Swap `<path>`** and **📋 Copy prompt**. Single click on Copy prompt → auto-copies to clipboard. The Copy prompt button appears only when a prompt is resolvable (see resolver below). This works even when the asset is a background image with text overlay on top.

> **Design rule**: `asset-swapper.js` MUST NOT inject any DOM nodes that affect host page layout. The Edit:ON overlays are `position: absolute` and visually decoupled from the host. Earlier attempts to inject inline "Copy prompt" buttons into placeholder figures broke their flex alignment — that pattern is forbidden. Anything inside `[data-asset]` or its ancestors is host-layout territory; the script lives in the absolute-positioned overlay layer only.

**Prompt resolution order** (asset-swapper looks for the prompt in this order):
1. `data-prompt` attribute on the `[data-asset]` element itself
2. `<pre>` inside a descendant `.placeholder__prompt` (typical placeholder figure)
3. `<pre>` inside the closest ancestor `<figure>`'s `.placeholder__prompt`
4. `<template data-prompt-for="<asset-path>">prompt text</template>` anywhere on the page

Use **method 4** when instrumenting real (non-placeholder) backgrounds, hero videos with text overlays, or any asset where you can't nest a `<details>` inside the visual element. Example:

```html
<section class="hero" style="background-image: url(images/hero.jpg)" data-asset="images/hero.jpg">
  <h1>Hero text covering the whole element</h1>
</section>
<template data-prompt-for="images/hero.jpg">
Cinematic photograph, slightly desaturated... full prompt here.
</template>
```

The `<template>` is inert in the DOM (browsers don't render its contents), so it's safe to drop next to the element or at the end of the page.

### Placeholder CSS (add once to project's main stylesheet if missing)

```css
.image-placeholder, .video-placeholder {
  margin: 0;
  border: 1.5px dashed rgba(91, 61, 245, 0.35);
  background:
    repeating-linear-gradient(135deg,
      rgba(91, 61, 245, 0.03) 0 12px,
      rgba(91, 61, 245, 0.06) 12px 24px),
    rgba(255, 255, 255, 0.5);
  border-radius: var(--radius-comfortable, 14px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  padding: 24px;
  gap: 8px;
  color: var(--color-vivid-indigo, #5B3DF5);
}
.image-placeholder .placeholder__hint,
.video-placeholder .placeholder__hint {
  font-size: 14px;
  line-height: 1.45;
  margin: 0;
  max-width: 52ch;
  color: inherit;
}
.placeholder__prompt {
  margin-top: 8px;
  font-family: ui-monospace, monospace;
  font-size: 12px;
}
.placeholder__prompt summary {
  cursor: pointer;
  user-select: none;
}
.placeholder__prompt pre {
  white-space: pre-wrap;
  margin: 8px 0 0;
  padding: 12px;
  background: rgba(0,0,0,0.04);
  border-radius: 8px;
}

/* Filled state (asset-swapper preview): hide hint, show image full-bleed */
.image-placeholder.is-filled, .video-placeholder.is-filled {
  border: none;
  background-color: transparent;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  padding: 0;
}
.image-placeholder.is-filled > *, .video-placeholder.is-filled > * {
  display: none;
}

/* Aspect-ratio variants — extend as needed per layout */
.image-placeholder--16-9 { aspect-ratio: 16 / 9; width: 100%; }
.image-placeholder--4-3  { aspect-ratio: 4 / 3;  width: 100%; }
.image-placeholder--1-1  { aspect-ratio: 1 / 1;  width: 100%; }
```

### Project setup (instrumentation)

When CREATEing for the first time, also ensure:
1. **Read `<web-root>` from `theme.md` → `## Project paths` section** (set during INIT). If `theme.md` doesn't have it (older project), run the "Confirm web root" sub-step from Phase A and update `theme.md`.
2. `<web-root>/js/asset-swapper.js` exists. If not, **copy the file from this skill's directory** (`~/.claude/skills/web-image-pipeline/asset-swapper.js`) into the project at `<web-root>/js/asset-swapper.js`.
3. Each page that contains `data-asset` elements has `<script src="/js/asset-swapper.js" defer></script>` before `</body>`.

### Existing real (non-placeholder) `<img>` and `<video>`

When a page already has real images/videos that the team should be able to swap, add `data-asset="<path-relative-to-web-root>"` to those elements. Do **not** convert them to placeholders.

Skip elements that are part of layout chrome (navigation logos, footer logos, decorative icons in nav/footer regions). Use judgment — if it's brand identity, leave it alone.

---

## Phase C — SWAP (handled by `asset-swapper.js` in browser)

The team member's workflow:
1. Open the site on `localhost` (or `127.0.0.1` / `file://`)
2. Toolbar appears bottom-right with `Edit: OFF` toggle
3. Click toggle → `Edit: ON` → blue dashed overlays appear on every `[data-asset]` element with a "📷 Swap <path>" button
4. Click any overlay → file picker (accepts both image and video) → choose new file
5. Browser downloads file to `~/Downloads/__SWAP__<encoded-path>.<ext>` (path separators replaced with `__`)
6. Live preview updates in-page (unless media-type changed)
7. Repeat across pages — log persists via localStorage and is shared across the entire origin
8. Click `Copy` button in toolbar → clipboard contains a paste-ready message for Claude listing all pending swaps

The script is dev-only (no-op on non-localhost hostnames), so it's safe to leave the `<script>` tag in production.

---

## Phase D — COMMIT: handle "swap done"

When the user says "swap done" / pastes the Copy message / asks to wrap up swaps:

### Step 1 — Checkpoint
If the project is a git repo with uncommitted changes:
- Show `git status` summary
- Offer to commit a checkpoint before applying swaps (recommended)
- If accepted, commit with message: `checkpoint: before applying asset swaps`

### Step 2 — List pending swaps
```bash
ls -la ~/Downloads/__SWAP__*
```
Group by **decoded target path**. Multiple `(n)` suffixes for the same target → keep the latest by `mtime`, delete the rest. Example decoder:
- `__SWAP__videos__hero.mp4` → `<web-root>/videos/hero.mp4`
- `__SWAP__images__products__lens-ai-workflow.png` → `<web-root>/images/products/lens-ai-workflow.png`

### Step 3 — Apply each swap

For each pending file, in order:

#### Case A — Same media type, existing file at target
```bash
mv "~/Downloads/__SWAP__<encoded>.<ext>" "<web-root>/<decoded-path>"
```
Done. HTML doesn't change (canonical-filename pattern). Delete any `(n)` siblings.

#### Case B — Placeholder figure (target file does not exist yet)
1. Move file to target path (`mkdir -p` parent if needed)
2. Rewrite the `<figure class="image-placeholder...">` element:
   ```html
   <figure class="<project>-figure <project>-figure--<variant>">
     <img src="<relative-path-to-asset>" alt="<derived from placeholder hint>" />
   </figure>
   ```
   - Pick a sensible class name for the new figure (e.g., `product-figure`, `hero-figure`); add CSS preserving the aspect-ratio + max-width that the placeholder had
   - Keep the `data-asset` attribute on the new `<img>` so future swaps work without HTML edits
3. Add CSS for the new figure class (mirror placeholder's aspect-ratio + max-width). Place near related figure/section CSS in the main stylesheet.

#### Case C — Media-type change (image ↔ video)
Detected when the picked extension's media type differs from the original target's media type. The encoded filename will reflect the picked extension.

1. Move file to **type-appropriate folder**:
   - `__SWAP__images__hero.mp4` → file should land in `<web-root>/videos/hero.mp4` (NOT `images/`)
   - The original `<web-root>/images/hero.png` (or whatever was there) should be deleted
2. Rewrite the HTML element:
   - `<img>` → `<video autoplay muted loop playsinline>` with inner `<source>`
   - `<video>` → `<img>` with `src` + `alt`
3. Migrate attributes:
   - `alt` → `aria-label` (and vice-versa if going video→img, derive new `alt` from existing aria-label or surrounding context)
   - Drop video-only attrs (autoplay/muted/loop) when going to img
   - Add video-only attrs when going to video
4. Update `data-asset` to new path with new extension
5. Adjust CSS classes if any are media-type-specific (e.g., a class like `.bg-video-overlay` should be removed when switching to img)
6. The asset-swapper log entry includes `mediaTypeChange: "image->video"` to make this easy to detect

### Step 4 — Cleanup
- Remove `(1)`, `(2)`, ... duplicates from `~/Downloads/`
- Verify `ls ~/Downloads/__SWAP__*` is empty
- Run a sanity check: load the affected pages mentally / `git diff` the HTML

### Step 5 — Final commit
```bash
git add -A
git commit -m "assets: swap <summary of what changed>"
```
Tell user: "Done. Refresh the affected pages and the toolbar's Clear button to reset pending count."

---

## Edge cases & pitfalls

- **Browser cannot overwrite Downloads** — same target swapped 3× yields `(1)`, `(2)`, `(3)` suffixes. Always use latest by `mtime`. The asset-swapper log dedupes by target so the `Copy` message lists only the latest, but the older files still exist on disk and must be cleaned up.
- **`data-asset` on `<video>` swaps the inner `<source>`** if present (not the video src directly). Match this when generating placeholder/instrumented HTML.
- **`<source>` tags** can carry `data-asset` directly too if you prefer per-source granularity (e.g., multiple resolutions).
- **First-swap of a placeholder requires HTML+CSS rewrite**, not just a file move. After that, the canonical-filename pattern means subsequent swaps need only a file move.
- **`localStorage` is per-origin** — a swap done on `localhost:8000` is invisible on `localhost:9000`. Stick to one dev port per project.
- **File System Access API was rejected** for this design intentionally — too complex for non-dev users and limited to Chromium browsers. Downloads-based flow works on all browsers and OSes.
- **Production safety** — `asset-swapper.js` self-disables on non-localhost hostnames. Safe to leave the `<script>` tag in production builds. If strict no-deliver is required, the deploy step can blank the file or rewrite it via `firebase.json`.

## Files in this skill directory

- `SKILL.md` — this file
- `asset-swapper.js` — the JS to copy into the project at `<web-root>/js/asset-swapper.js`. Always copy the **latest** version from this skill directory; do not depend on the user's project to keep its copy up to date.

## Quick reference card

| Trigger | Phase | Action |
|---|---|---|
| New project, no `theme.md` | A | Run interview, write theme.md |
| User: "update theme" | A | Re-ask affected sub-sections only |
| Building page with image slot | B | Insert placeholder + generated prompt + ensure script wired |
| User: "swap done" / Copy paste | D | Checkpoint commit → move files → rewrite placeholders → cleanup → final commit |
| `~/Downloads/__SWAP__*` exists | D | Same as above |
