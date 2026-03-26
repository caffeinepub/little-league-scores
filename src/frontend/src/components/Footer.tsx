export default function Footer() {
  const year = new Date().getFullYear();
  const hostname = encodeURIComponent(window.location.hostname);

  return (
    <footer className="bg-navy text-white mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-display font-bold uppercase tracking-widest text-sm text-orange mb-3">
              Little League Scores
            </h3>
            <p className="text-white/60 text-sm leading-relaxed">
              Your hub for recreational little league game results, MVP
              highlights, and division standings.
            </p>
          </div>
          <div>
            <h3 className="font-display font-bold uppercase tracking-widest text-sm text-orange mb-3">
              Divisions
            </h3>
            <ul className="text-white/60 text-sm space-y-1">
              <li>Co-Ed TeeBall</li>
              <li>Baseball &amp; Softball Coach Pitch</li>
              <li>Baseball &amp; Softball Minors</li>
              <li>Baseball &amp; Softball Majors</li>
            </ul>
          </div>
          <div>
            <h3 className="font-display font-bold uppercase tracking-widest text-sm text-orange mb-3">
              Season Info
            </h3>
            <ul className="text-white/60 text-sm space-y-1">
              <li>Spring Season 2026</li>
              <li>Games every Saturday &amp; Sunday</li>
              <li>Playoffs begin June 2026</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/10 mt-8 pt-6 text-center text-white/40 text-xs">
          © {year}. Built with ❤️ using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${hostname}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-orange transition-colors underline"
          >
            caffeine.ai
          </a>
        </div>
      </div>
    </footer>
  );
}
