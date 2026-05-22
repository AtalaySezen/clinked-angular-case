# Clinked — Angular Case Study

A news article web app built as an Angular 21 case study, demonstrating modern Angular patterns: standalone components, Signals, OnPush change detection, auxiliary router outlets, and Angular Material.

## Tech Stack

- **Angular 21** (standalone, Signals, OnPush)
- **Angular Material** (Azure/Material 3 theme)
- **ngx-quill** — rich text editor
- **json-server 0.17.4** — mock REST API
- **Vitest** — unit test runner

## Getting Started

### Prerequisites

- Node.js 20+ (LTS)
- npm 10+

### Install dependencies

```bash
npm install
```

### Run the mock API

```bash
npm run api
```

Starts json-server on `http://localhost:3001`.

> **Note:** This project pins json-server to **v0.17.4** (stable). The v1.x beta broke exact-match query filtering (`?field=value`), which caused comment lookups by `articleId` to silently return empty results.

### Run the app

```bash
ng serve
```

Open `http://localhost:4200`.

> Both the API server and the dev server must be running simultaneously.

## Available Scripts

| Command | Description |
|---|---|
| `npm run api` | Start json-server mock API on port 3001 |
| `ng serve` | Start Angular dev server |
| `npm run build` | Production build |
| `npm test` | Run unit tests |

## Features

### Article List
- Fetches articles from the mock API on load
- Debounced search (300 ms) filters by title in real time
- Excerpt pipe strips HTML tags, decodes entities, and truncates to 150 characters
- Empty states for loading, error, no articles, and no search results

### Article Detail
- Displays full article content, sanitized against XSS
- Shows comment count updated in real time after new comments are posted
- Comments button toggles the side panel via an auxiliary router outlet

### Comments Side Panel
- Slides in from the right using a named auxiliary outlet (`side-panel`)
- Lists existing comments and allows submitting new ones
- Comment content is sanitized against XSS before display

### Article Create
- Rich text editor (Quill) for article content
- Reactive form with validation (required title ≤ 101 chars; required content; optional category)
- Unsaved changes guard — prompts before navigating away with unsaved work
- Submit button disabled during API call; errors shown inline

### Infrastructure
- HTTP error interceptor with human-readable messages (network down, 404, 5xx)
- Custom `TitleStrategy` for `Page | Clinked` browser tab titles
- `InjectionToken<Environment>` for environment DI (no static imports in services)
- `fileReplacements` in `angular.json` for production environment swap

## Project Structure

```
src/
├── app/
│   ├── core/
│   │   ├── guards/          # unsaved-changes guard
│   │   ├── interceptors/    # HTTP error interceptor
│   │   ├── models/          # Article, Comment interfaces
│   │   ├── services/        # ArticleService, CommentService
│   │   └── strategies/      # PageTitleStrategy
│   ├── features/
│   │   ├── article-list/
│   │   ├── article-create/
│   │   ├── article-detail/
│   │   └── comments/
│   └── shared/
│       ├── components/      # ConfirmDialogComponent
│       └── pipes/           # ExcerptPipe
└── environments/
```
