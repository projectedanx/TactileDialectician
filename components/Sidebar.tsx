'use client';

import {
  Workflow,
  Search,
  Cpu,
  LineChart,
  MessageSquare,
  Binary,
  UserCog,
  ClipboardList,
  Fingerprint,
  ShieldAlert,
  Shield,
    HeartPulse,
  GitMerge
} from 'lucide-react';
import React from 'react';

export interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

/**
 * The sidebar navigation component.
 *
 * @param {SidebarProps} props - The component props.
 * @returns {JSX.Element} The rendered sidebar component.
 */
export default function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  const tabs = [
    { id: 'workflow', icon: Workflow, label: 'Automated Workflow' },
    { id: 'persona', icon: UserCog, label: 'Topological Persona' },
    { id: 'orchestrator', icon: ClipboardList, label: 'PM Orchestrator' },
    { id: 'relational', icon: HeartPulse, label: 'Relational Sovereignty' },
    { id: 'lexical', icon: Fingerprint, label: 'Lexical Topology' },
    { id: 'disambiguation', icon: Search, label: 'Disambiguation' },
    { id: 'tokenization', icon: Binary, label: 'Tokenization' },
    { id: 'executor', icon: Cpu, label: 'Neuro-Symbolic Exec' },
    { id: 'dashboard', icon: LineChart, label: 'Interpretability' },
    { id: 'chat', icon: MessageSquare, label: 'Dialectical Chat' },
        { id: 'escrow', icon: ShieldAlert, label: 'Epistemic Escrow' },
    { id: 'vance', icon: GitMerge, label: 'VANCE Cartographer' },
    { id: 'aurelius', icon: Shield, label: 'Aurelius Dashboard' },
  ];

  return (
    <div className="w-64 bg-surface border-r border-border h-full flex flex-col">
      <div className="p-6 border-b border-border">
        <h1 className="text-xl font-mono font-bold text-primary tracking-tight">Tactile Dialectician</h1>
        <p className="text-xs font-mono text-on-surface-muted mt-2 tracking-wider">ATLAS FRAMEWORK v2.1</p>
      </div>

      <nav className="flex-1 overflow-y-auto py-4">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`w-full flex items-center px-6 py-4 text-sm font-mono transition-colors ${
              activeTab === tab.id
                ? 'bg-primary/10 text-primary border-r-2 border-primary'
                : 'text-on-surface-muted hover:bg-surface-raised hover:text-on-surface'
            }`}
          >
            <tab.icon className="w-5 h-5 mr-3" />
            {tab.label}
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-border">
        <button
          onClick={() => setActiveTab('admin')}
          className={`w-full flex items-center justify-center px-4 py-2 text-xs font-mono transition-colors border ${
            activeTab === 'admin'
              ? 'bg-red-500/20 text-red-400 border-red-500/50'
              : 'text-on-surface-muted border-border hover:bg-surface-raised hover:text-on-surface'
          }`}
        >
          <ShieldAlert className="w-4 h-4 mr-2" />
          ADMIN OVERRIDE
        </button>
        <div className="text-center mt-4">
          <p className="text-[10px] font-mono text-on-surface-muted uppercase tracking-widest">System Status: Active</p>
          <div className="flex items-center justify-center mt-1">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
