import { theme } from '@/styles/theme';

export function Footer() {
    return (
        <footer className={`${theme.spacing.container} py-8 text-center border-t border-zinc-900 mt-8`}>
            <div className="flex justify-center gap-4 mb-4 text-xs text-zinc-500">
                <a href="#" className="hover:text-purple-400">About</a>
                <a href="#" className="hover:text-purple-400">Demo Video</a>
                <a href="#" className="hover:text-purple-400">GitHub</a>
            </div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-900/20 border border-purple-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                <span className="text-[10px] font-medium text-purple-300 tracking-wide uppercase">Monad Testnet</span>
            </div>
        </footer>
    );
}
