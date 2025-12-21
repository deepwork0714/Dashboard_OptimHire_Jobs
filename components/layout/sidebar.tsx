import Link from 'next/link';

export default function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-[#0b1116] text-sm text-muted-foreground border-r border-border/10">
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-green-500 flex items-center justify-center text-white font-bold">J</div>
          <div>
            <div className="font-semibold text-white">Job Analytics</div>
            <div className="text-xs text-muted-foreground/70">Dashboard</div>
          </div>
        </div>
      </div>

      <nav className="mt-6 px-2">
        <ul className="space-y-1">
          <li>
            <Link href="#" className="flex items-center gap-3 px-3 py-2 rounded-md bg-green-600/10 text-white">
              <span className="text-sm font-medium">Overview</span>
            </Link>
          </li>
          <li>
            <Link href="#" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-white/2">
              <span>Subscribers</span>
            </Link>
          </li>
          <li>
            <Link href="#" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-white/2">
              <span>Channels</span>
            </Link>
          </li>
          <li>
            <Link href="#" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-white/2">
              <span>Reports</span>
            </Link>
          </li>
        </ul>
      </nav>

      <div className="absolute bottom-6 left-4 right-4">
        <button className="w-full rounded-md bg-[#051217] px-3 py-2 text-sm text-muted-foreground">Settings</button>
      </div>
    </aside>
  );
}
