export default function Footer() {
  return (
    <footer className="pb-5 pt-3">
      <div className="flex items-center justify-center gap-3 text-xs md:text-sm tracking-[0.15em] text-gray-500 font-light">
        <span>© 2026</span>

        <span className="w-1 h-1 rounded-full bg-gray-400"></span>

        <span className="hover:text-gray-700 transition duration-300">
          Developed by ต้นไม้ ครับ
        </span>

        <span className="w-1 h-1 rounded-full bg-gray-400"></span>

        <span className="hover:text-blue-600 transition duration-300">
          Yangtalad Hospital
        </span>
      </div>
    </footer>
  );
}