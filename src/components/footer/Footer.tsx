import GitHubLgo from '@assets/GitHub_Invertocat_White.svg';

function Footer() {
  return (
    <footer className="mt-auto flex flex-col items-center gap-2 border-t border-slate-800 pt-4 text-xs text-slate-400 sm:flex-row sm:justify-end sm:gap-3">
      <span>Created by Will Warner</span>
      <a
        href="https://github.com/cofad/financial-portfolio-dashboard"
        target="_blank"
        rel="noreferrer noopener"
        className="focus-ring inline-flex h-11 items-center gap-2 rounded-full border border-transparent p-2 text-xs font-semibold text-slate-300 transition hover:border-emerald-300/40 hover:text-emerald-100 sm:h-auto"
      >
        <img src={GitHubLgo} alt="GitHub" className="h-4 w-4" />
        <span>GitHub</span>
      </a>
    </footer>
  );
}

export default Footer;
