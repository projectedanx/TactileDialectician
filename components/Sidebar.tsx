import {
  BookOpen,
  Calculator,
  MessageSquare,
  Activity,
  Layers,
  Cpu,
  Workflow
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  const tabs = [
    { id: 'workflow', label: 'Automated Workflow', icon: Workflow },
    { id: 'disambiguation', label: 'Disambiguation Engine', icon: BookOpen },
    { id: 'tokenization', label: 'Atomic Tokenization', icon: Cpu },
    { id: 'executor', label: 'Neuro-Symbolic Executor', icon: Calculator },
    { id: 'dashboard', label: 'Interpretability Dashboard', icon: Activity },
    { id: 'chat', label: 'Dialectical Chat', icon: MessageSquare },
  ];

  return (
    <div className="w-64 bg-[#0a0a0a] border-r border-[#2a2a2a] h-screen flex flex-col">
      <div className="p-6 border-b border-[#2a2a2a]">
        <div className="flex items-center gap-3">
          <Layers className="w-6 h-6 text-emerald-500" />
          <h1 className="font-mono text-sm font-bold tracking-wider text-emerald-500">TACTILE_DIALECTICIAN</h1>
        </div>
        <p className="text-xs text-zinc-500 mt-2 font-mono">v1.0.0-beta</p>
      </div>
      
      <nav className="flex-1 p-4 space-y-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-mono transition-all duration-200 ${
                isActive 
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                  : 'text-zinc-400 hover:bg-[#1a1a1a] hover:text-zinc-200 border border-transparent'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </nav>
    </div>
  );
}
