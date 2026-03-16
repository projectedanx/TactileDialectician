import type {Metadata} from 'next';
import 'katex/dist/katex.min.css';
import './globals.css'; // Global styles

export const metadata: Metadata = {
  title: 'Tactile Dialectician',
  description: 'Neuro-symbolic executor and symbol disambiguation engine',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning className="bg-[#141414] text-[#E4E3E0] font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
