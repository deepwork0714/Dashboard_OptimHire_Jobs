# Job Analytics Dashboard Frontend

Modern Next.js dashboard for job analytics.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Copy `.env.local.example` to `.env.local` and configure:
```bash
cp .env.local.example .env.local
```

3. Update `.env.local` with your API URL (default: `http://localhost:8000`)

4. Run the development server:
```bash
npm run dev
```

Dashboard will be available at `http://localhost:3000`

## Features

- Real-time job statistics
- Interactive charts with Recharts
- Responsive design with Tailwind CSS
- Type-safe API calls
- Loading states and error handling

## Design updates (Dec 2025)

- Updated UI to a modern dark "glassy" theme: richer navy background, translucent cards, softer shadows, and rounded elements.
- Charts:
  - `BoardBarChart` now uses polished gradients and rounded stacked bars for Active/Inactive statuses.
  - `DailyLineChart` converted to a stacked Area chart showing `Active` and `Inactive` over time.
- Components updated: `Card`, `Input`, `Select`, `Label`, and `Skeleton` now follow the new visual style.

Previewing the new theme

- Start the dev server: `npm run dev`
- Toggle dark mode to see the new glassy style. If your app uses a theme toggle, enable dark mode; otherwise add the `dark` class to `<html class="dark">` in the browser devtools to preview.

Notes

- All functionality is preserved; these changes are visual only. If you want additional adjustments (spacing, colors, or a custom set of gradients), I can iterate further.

