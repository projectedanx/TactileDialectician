import {
  BookOpen,
  Calculator,
  MessageSquare,
  Activity,
  Layers,
  Cpu,
  Workflow
} from 'lucide-react';

/**
 * Defines the properties required by the Sidebar component.
 */
interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

/**
 * Renders the global navigation sidebar for the Tactile Dialectician interface.
 * Controls the active viewing state across different neuro-symbolic modules.
 *
 * @param {SidebarProps} props - The props object.
 * @param {string} props.activeTab - The currently active tab identifier.
 * @param {function} props.setActiveTab - State setter function to mutate the active tab.
 * @returns {JSX.Element} The rendered Sidebar component.
 */
export default function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  // Miller's Law limit: 5 nav items. We group workflow and chat as primary.
  const MAX_NAV_ITEMS = 5;

  const tabs = [
    { id: 'workflow', label: 'Automated Workflow', icon: Workflow },
    { id: 'disambiguation', label: 'Disambiguation', icon: BookOpen },
    { id: 'tokenization', label: 'Atomic Tokens', icon: Cpu },
    { id: 'executor', label: 'Symbolic Executor', icon: Calculator },
    { id: 'chat', label: 'Dialectical Chat', icon: MessageSquare },
  ];

  if (tabs.length > MAX_NAV_ITEMS) {
    console.warn(
      `[AestheticGeometrician] MILLER VIOLATION: ${tabs.length} nav items exceed the 5-item cognitive budget.`
    );
  }

  return (
    <div className="w-64 bg-surface-raised border-r border-border h-screen flex flex-col">
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-4">
          <Layers className="w-6 h-6 text-primary" />
          <h1 className="font-sans text-label font-bold tracking-tight text-primary">DIALECTICIAN</h1>
        </div>
        <p className="text-sm text-on-surface-muted mt-2 font-sans tracking-tight">v1.0.0-beta</p>
      </div>
      
      <nav className="flex-1 p-4 space-y-2">
        {tabs.slice(0, MAX_NAV_ITEMS).map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-4 px-4 py-2 rounded-none text-body font-sans transition-all duration-200 border-2 ${
                isActive 
                  ? 'bg-transparent text-primary border-primary'
                  : 'text-on-surface-muted hover:bg-transparent hover:text-on-surface border-transparent hover:border-border'
              } focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-surface`}
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
