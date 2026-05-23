'use client';

import { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import DisambiguationEngine from '@/components/DisambiguationEngine';
import LexicalTopologyMiner from '@/components/LexicalTopologyMiner';
import NeuroSymbolicExecutor from '@/components/NeuroSymbolicExecutor';
import InterpretabilityDashboard from '@/components/InterpretabilityDashboard';
import Chatbot from '@/components/Chatbot';
import AtomicTokenizationModule from '@/components/AtomicTokenizationModule';
import AutomatedWorkflow from '@/components/AutomatedWorkflow';
import TopologicalPersonaSculptor from '@/components/TopologicalPersonaSculptor';
import SovereignProjectOrchestrator from '@/components/SovereignProjectOrchestrator';
import RelationalSovereigntyEngine from '@/components/RelationalSovereigntyEngine';
import AureliusDashboard from '@/components/aurelius/AureliusDashboard';
import EpistemicEscrowDashboard from '@/components/EpistemicEscrowDashboard';
import AdminDashboard from '@/components/AdminDashboard';

/**
 * The main entry point for the Tactile Dialectician application.
 * Manages the state of the active tab and orchestrates transitions between the various neuro-symbolic modules.
 *
 * @returns {JSX.Element} The rendered Home view.
 */
export default function Home() {
  const [activeTab, setActiveTab] = useState('workflow');
  const [chatQuery, setChatQuery] = useState('');

  const handleWorkflowComplete = (contextBundle: string) => {
    setChatQuery(contextBundle);
    setActiveTab('chat');
  };

  return (
    <div className="flex h-screen bg-surface overflow-hidden">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="flex-1 h-full relative">
        {activeTab === 'admin' && <AdminDashboard />}
        {activeTab === 'workflow' && <AutomatedWorkflow onComplete={handleWorkflowComplete} />}
        {activeTab === 'persona' && <TopologicalPersonaSculptor />}
        {activeTab === 'orchestrator' && <SovereignProjectOrchestrator />}
        {activeTab === 'relational' && <RelationalSovereigntyEngine />}
        {activeTab === 'lexical' && <LexicalTopologyMiner />}
        {activeTab === 'disambiguation' && <DisambiguationEngine />}
        {activeTab === 'tokenization' && <AtomicTokenizationModule />}
        {activeTab === 'executor' && <NeuroSymbolicExecutor />}
        {activeTab === 'dashboard' && <InterpretabilityDashboard />}
        {activeTab === 'chat' && <Chatbot initialQuery={chatQuery} />}
        {activeTab === 'escrow' && <EpistemicEscrowDashboard />}
        {activeTab === 'aurelius' && <AureliusDashboard />}
      </main>
    </div>
  );
}
