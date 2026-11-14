# AI Creative Intelligence Studio

> **"Describe your imagination. Let AI design it. Edit it. Own it."**

An enterprise-grade, cloud-native generative design ecosystem. Unlike ordinary text-to-image generators that produce flat raster bitmaps with scrambled text and uneditable pixels, **AI Creative Intelligence Studio** operates on a **Design Document Object Model (DDOM)**.

Every natural language prompt is parsed by an intelligent semantic engine that synthesizes multi-layered vector geometry, typography, and color tokens into 100% editable SVG, A4 print-ready PDF, transparent PNG, and responsive HTML/React components.

---

## 🎨 6 Core Creative Studios

1. **Logo Design Studio**: Minimalist, corporate, luxury, modern, and creative vector logo marks with transparent PNG and SVG exports.
2. **Company Letterhead Studio**: ISO 216 A4 & US Letter print-ready corporate stationery with custom headers, margins, and contact coordinates.
3. **Business Stationery Studio**: Business cards (front/back), tabular itemized tax invoices, corporate staff ID badges, and DL envelopes.
4. **Website Design Studio**: Responsive landing pages and corporate layouts with clean HTML/CSS and modular React (.tsx) code generation.
5. **Social Media Design Studio**: High-CTR Instagram square (1080x1080), stories (1080x1920), LinkedIn banners, and YouTube thumbnails.
6. **Brand Identity Studio**: Centralized brand repository managing color palettes (HEX/RGB), typography pairings, and downloadable style specification boards.

---

## 🛠️ Interactive Vector Editor Capabilities

- **Drag-and-Drop Canvas**: Move, align, and reposition layers in real time.
- **8-Point Transform Handles**: Resize width and height with live coordinate updates.
- **Typography Engine**: Real-time font swapping with Google Fonts (Plus Jakarta Sans, Inter, Playfair Display, Space Grotesk, etc.), font sizes, line heights, letter spacing, and color pickers.
- **Vector Shapes & Icons**: Rectangles, circles, pills, divider lines, and hundreds of vector Lucide icons.
- **Layer Stack Management**: Reorder z-index (bring to front, send to back, move up/down), toggle visibility, lock layers, and duplicate.
- **In-Editor AI Copilot**: Conversational prompt-based canvas refinement ("Make headline larger and electric emerald", "Switch to luxury gold accents", "Apply dark mode").
- **History Stack**: Multi-level Undo (Ctrl+Z) and Redo (Ctrl+Y / Ctrl+Shift+Z).
- **Multi-Format Export**: PNG (transparent background toggle, 1x/2x/3x scale), Standalone SVG vector, Print-Ready A4 300 DPI PDF, and HTML/React TSX.

---

## 🚀 Getting Started

### 1. Installation

```bash
npm install
```

### 2. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Production Build & Verification

```bash
npm run build
npm run start
```

---

## 🔐 Environment Variables (.env)

The platform runs with zero external dependencies out-of-the-box using the built-in **Autonomous Vector Intelligence Engine**. To connect external providers:

```env
# Optional external LLM providers
OPENAI_API_KEY=sk-proj-...
GEMINI_API_KEY=AIzaSy...

# Optional Supabase Cloud PostgreSQL & Storage
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...
```

---

## 🗄️ Database Provisioning

To set up Supabase / PostgreSQL with Row Level Security (RLS), execute `schema.sql` in your Supabase SQL Editor.

---

## 🚀 Live Production Deployment

### Option A: Deploy to Vercel (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FOGlordchaliya%2Fdesigner-bot)

1. Click the **Deploy with Vercel** button above or go to [Vercel Dashboard](https://vercel.com/new).
2. Select **Import Git Repository** and choose `OGlordchaliya/designer-bot`.
3. Vercel automatically detects Next.js 14 via `vercel.json`.
4. (Optional) Add your environment variables:
   - `OPENAI_API_KEY`
   - `GEMINI_API_KEY`
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. Click **Deploy**. Your app will be live with a global CDN and automatic HTTPS in under 2 minutes!

### Option B: Deploy to Netlify

1. Go to [Netlify Dashboard](https://app.netlify.com/start).
2. Select **Import from GitHub** &rarr; `OGlordchaliya/designer-bot`.
3. Netlify will automatically detect the build settings via `netlify.toml`.
4. Click **Deploy Site**.

### Option C: Self-Hosted Docker Container

```bash
# Build production Docker image
docker build -t designer-bot .

# Run on port 3000
docker run -p 3000:3000 designer-bot
```

