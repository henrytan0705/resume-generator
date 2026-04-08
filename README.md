# LinkedIn to Resume Generator

A professional, production-ready LinkedIn profile scraper and PDF resume generator built with **Next.js 16**, **React 19**, **Tailwind v4**, and **TypeScript**.

## 🚀 Features

- **LinkedIn Scraper API**: Secure orchestration with Apify to extract profile data.
- **Smart Normalization**: Transforms raw scraper JSON into a strict, typed `LinkedInProfile` schema.
- **Curatable UI**: Interactive preview allowing users to reorder sections, soft-delete entries, and toggle entire categories.
- **High-Fidelity PDF**: Generates professional, ATS-friendly resumes with fixed headers/footers and smart page-break handling. Includes conditional description truncation (showing top 3 roles) to optimize readability.
- **Anti-Abuse Protection**: Integrated IP-based rate limiting (10 requests / 15 mins) to prevent credit exhaustion.
- **Resilient Caching**: In-memory TTL cache with bounded size to prevent memory leaks and minimize API costs.

## 🛠️ Setup

### 1. Prerequisites
- Node.js 20+ (Required for Next.js 16)
- An Apify account (for the [LinkedIn Profile Scraper](https://apify.com/harvestapi/linkedin-profile-scraper) actor)

### 2. Environment Variables
Create a `.env.local` file in the root directory:

```bash
# [REQUIRED] Apify API Token
APIFY_API_TOKEN=your_token_here

# [OPTIONAL] Set to "true" to skip scraping and use mock data for UI testing
USE_MOCK_DATA=false
```

### 3. Installation
```bash
npm install
```

### 4. Development
```bash
npm run dev
```

### 5. Production Build
```bash
npm run build
npm start
```

### 6. Vercel Deployment 🚀
For a stable production deployment on Vercel:
- **Environment Variables**: Set `APIFY_API_TOKEN` and `USE_MOCK_DATA` in the Vercel Dashboard.
- **Function Timeout**: Go to **Settings > Functions** and set the **Max Duration** to **30s**. The default 10s timeout is insufficient for the Apify scraper to complete.
- **Memory**: The default is usually sufficient, but **256MB** is recommended if processing profile pictures with large resolutions.

## 🏗️ Architecture

- **`/app/api/scrape`**: API Route handler for validation, caching, and orchestration.
- **`/lib/apify-parser.ts`**: Pure data normalization layer with retry logic for media extraction.
- **`/components/pdf`**: Declarative PDF layouts using `@react-pdf/renderer`.
- **`/components/views`**: Modular UI components for data curation and layout management.

## 🛡️ Security
- **Strict Zod Validation**: Validates all incoming URLs and payloads.
- **Privacy-First**: No personal data is persisted beyond the 1-hour in-memory cache.
- **Secure Headers**: Sensitive tokens are passed via Authorization headers.
- **Anti-Abuse**: IP-based rate limiting prevents automated scraping and protects Apify credits.
- **Error Sanitization**: Stack traces are logged server-side but never exposed to the client.

