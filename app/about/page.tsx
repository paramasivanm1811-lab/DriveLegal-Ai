import Link from "next/link";
import { ArrowRight, Code, Award } from "lucide-react";

export default function About() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl flex-1 flex flex-col justify-center">
      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 md:p-12">
        <div className="inline-flex items-center justify-center px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm font-bold tracking-wide uppercase mb-6">
          <Award className="w-4 h-4 mr-2" /> BIMSTEC Hackathon 2026
        </div>
        
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6">About DriveLegal</h1>
        
        <div className="space-y-6 text-gray-600 text-lg leading-relaxed">
          <p>
            DriveLegal was built for the 2026 BIMSTEC Hackathon challenge. It addresses the critical need for transparent, accessible, and structured traffic law information across the Bay of Bengal region.
          </p>
          <p>
            Traffic laws often vary wildly not just between countries, but between local municipalities. Whether you are a tourist renting a scooter in Phuket, a truck driver crossing the India-Nepal border, or a local citizen in Dhaka, navigating the exact penalty for a specific vehicle type is incredibly difficult.
          </p>
          <p>
            <strong>DriveLegal solves this by combining a highly-structured regional database with an AI Agent capable of interpreting complex legal variations.</strong>
          </p>
        </div>

        <div className="mt-10 grid sm:grid-cols-2 gap-6 border-t border-gray-100 pt-10">
          <div>
            <h3 className="font-bold text-gray-900 mb-2">Built With</h3>
            <ul className="space-y-2 text-sm text-gray-500">
              <li>• Next.js App Router (React)</li>
              <li>• Tailwind CSS v4</li>
              <li>• Vercel AI SDK (GPT-4o)</li>
              <li>• Progressive Web App (PWA) Offline Caching</li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-gray-900 mb-2">Hackathon Focus</h3>
            <ul className="space-y-2 text-sm text-gray-500">
              <li>• AI-driven legal interpretation</li>
              <li>• Geo-fenced calculator logic</li>
              <li>• No-internet offline capability</li>
              <li>• BIMSTEC data interoperability</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex items-center justify-between">
          <a href="#" className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-gray-900 transition-colors">
            <Code className="w-5 h-5" /> View Source Code
          </a>
          <Link href="/" className="bg-[var(--color-brand-green)] hover:bg-[var(--color-brand-green-dark)] text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all">
            Return Home <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
