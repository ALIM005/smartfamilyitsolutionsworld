import Link from 'next/link';


export default function NotFound() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-linear-to-br from-[#FFF4F6] via-[#FDE6EC] to-[#FBD3DE] p-6 text-center">
      {/* Background Glow */}
      <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-[#D81B7A]/15 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 h-80 w-80 rounded-full bg-[#C9A24B]/20 blur-3xl" />


      <div className="relative max-w-lg rounded-3xl border border-[#F3C6D3] bg-white/95 p-8 shadow-2xl shadow-[#B0124F]/15 backdrop-blur md:p-12">
        <p className="text-6xl font-black text-[#B0124F] mb-2 font-serif">404</p>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#2E0A1C] mb-3 font-serif">
          Page Not Found <span className="italic text-[#B0124F]">(Page Not Found)</span>
        </h1>
        <p className="text-sm text-[#7A5566] mb-8 leading-relaxed">
          The page or URL you tried to access has been removed or does not exist.
        </p>


        <div className="space-y-3">
          <Link
            href="/"
            className="block w-full rounded-full bg-linear-to-r from-[#B0124F] to-[#D81B7A] py-3.5 text-sm font-bold text-white shadow-lg shadow-[#B0124F]/30 hover:opacity-90 transition"
          >
            🏠 Back to homepage
          </Link>
          <Link
            href="/marketplace"
            className="block w-full rounded-full border border-[#F3C6D3] bg-[#FFF4F6] py-3.5 text-sm font-bold text-[#4A0F2E] hover:bg-[#FDE6EC] transition"
          >
            🛍️ Browse the marketplace
          </Link>
        </div>
      </div>
    </div>
  );
}