import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-[var(--color-brand-dark)] text-gray-400 py-8 border-t border-[var(--color-brand-gray-light)] mt-auto">
      <div className="container mx-auto px-4 text-center space-y-2">
        <p>&copy; 2026 DriveLegal TN. Hackathon Submission.</p>
        <p className="text-[11px] text-gray-500 max-w-xl mx-auto leading-relaxed">
          Disclaimer: DriveLegal TN is a student proof-of-concept project built for the Road Safety Hackathon 2026 (CoERS, RBG Labs, IIT Madras). It is not affiliated with, authorized, or endorsed by the Government of Tamil Nadu, the Ministry of Road Transport & Highways, or any official traffic authority.
        </p>
        <div className="flex justify-center gap-4 pt-2 text-sm flex-wrap">
          <Link href="/about" className="hover:text-white transition-colors">About</Link>
          <Link href="/laws" className="hover:text-white transition-colors">Laws Database</Link>
          <Link href="/calculator" className="hover:text-white transition-colors">Calculator</Link>
          <span className="text-gray-600 hidden sm:inline">|</span>
          <Link href="/admin/login" className="text-[var(--color-brand-green-light)] hover:text-white transition-colors font-bold">Authority Login</Link>
        </div>
      </div>
    </footer>
  );
}
