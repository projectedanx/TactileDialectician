import VanceLSPDashboard from '@/components/VanceLSPDashboard';

/**
 * Application metadata configuration for the Vance page.
 *
 * @type {Metadata}
 */
export const metadata = {
  title: 'VANCE | Topological LSP Cartographer',
};

/**
 * Renders the Vance LSP Dashboard page.
 *
 * @returns {JSX.Element} The rendered Vance page.
 */
export default function VancePage() {
  return <VanceLSPDashboard />;
}
