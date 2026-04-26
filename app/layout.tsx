import type {Metadata} from 'next';
import 'katex/dist/katex.min.css';
import './globals.css'; // Global styles

export const metadata: Metadata = {
  title: 'Tactile Dialectician',
  description: 'Neuro-symbolic executor and symbol disambiguation engine',
};

/**
 * Root layout component for the Tactile Dialectician Next.js application.
 * Injects global CSS and sets the fundamental HTML shell.
 *
 * @param {Object} props - The component props.
 * @param {React.ReactNode} props.children - The child components to render within the layout.
 * @returns {JSX.Element} The rendered root layout.
 */
export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning className="bg-surface text-on-surface font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
