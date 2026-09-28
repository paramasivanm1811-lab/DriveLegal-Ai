# DriveLegal TN 🚦

> AI-Powered Tamil Nadu Traffic Laws & Compliance Platform

[![Live Demo](https://img.shields.io/badge/Live-drive--legal--ai.vercel.app-green?style=for-the-badge)](https://drive-legal-ai.vercel.app)
[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge)](https://nextjs.org)
[![Groq AI](https://img.shields.io/badge/Groq-LLaMA3-orange?style=for-the-badge)](https://groq.com)

Built for **Road Safety Hackathon 2026** — CoERS, RBG Labs, IIT Madras  
Topic: **DriveLegal** | Team: **DriveLegal TN** | By: **Prathap S**

---

## 🌐 Live Demo

**[drive-legal-ai.vercel.app](https://drive-legal-ai.vercel.app)**

---

## 📌 About

DriveLegal TN is a full-stack AI-powered web platform that provides Tamil Nadu citizens instant access to:
- Location-specific traffic laws and fine schedules
- AI chatbot for real-time legal guidance in English & Tamil
- Interactive district map with local rules and contacts
- Vehicle-specific rules and challan calculator

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🤖 **AI Chat Assistant** | Groq LLaMA 3 powered chatbot — bilingual English/Tamil with voice input |
| 🗺️ **District Map** | Interactive Tamil Nadu map with real DB data per district |
| 🚗 **Vehicle Rules** | Dynamic rules filtered by vehicle type from live database |
| 📊 **Admin Dashboard** | Publish & manage traffic rules by vehicle type and category |
| 🏆 **Road Safety Quiz** | Multi-level quiz with Motor Vehicle Act references |
| 💰 **Challan Calculator** | Fine lookup by violation type and vehicle class |
| 🌐 **Bilingual Support** | Full English / Tamil language toggle |
| 📱 **PWA** | Installable as mobile app |

---

## 🛠️ Tech Stack

- **Frontend:** Next.js 16, React, TypeScript, Tailwind CSS, Zustand
- **AI:** Groq API (LLaMA 3)
- **Database:** PostgreSQL (Neon) + Prisma ORM
- **Deployment:** Vercel + GitHub CI/CD

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- A Groq API key (free at [console.groq.com](https://console.groq.com))
- A PostgreSQL database (free at [neon.tech](https://neon.tech))

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/Prathap2349/DriveLegal-Ai
cd DriveLegal-Ai

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env.local
# Add your GROQ_API_KEY and DATABASE_URL

# 4. Set up the database
npx prisma generate
npx prisma db push

# 5. Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 🔑 Environment Variables

Create a `.env.local` file:

```env
GROQ_API_KEY=your_groq_api_key_here
DATABASE_URL=your_postgresql_connection_string_here
```

---

## 📁 Project Structure

```
DriveLegal-Ai/
├── app/
│   ├── chat/          # AI chatbot page
│   ├── map/           # District map page
│   ├── vehicles/      # Vehicle rules page
│   ├── quiz/          # Road safety quiz
│   ├── admin/         # Admin dashboard
│   └── api/           # API routes
├── components/        # Reusable UI components
├── prisma/
│   └── schema.prisma  # Database schema
├── lib/               # Utility functions
└── public/            # Static assets
```

---

## 🗄️ Database Schema

```prisma
model Law {
  id          Int      @id @default(autoincrement())
  title       String
  description String
  category    String   // City / Highway / General
  vehicleType String   // 2-Wheeler / Auto / Lorry / Bus / General
  fine        Float
  section     String
  district    String
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

---

## 🌏 BIMSTEC Scalability

This platform is designed to scale to any BIMSTEC nation:
- ✅ Architecture works for any country
- ✅ Only database content needs updating
- ✅ No code changes required for new regions
- ✅ Open APIs used throughout

---

## 📄 License

This project was built for the Road Safety Hackathon 2026 by CoERS, RBG Labs, IIT Madras.

---

*Made with ❤️ for safer roads in Tamil Nadu and beyond*
