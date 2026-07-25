import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { QueryProvider } from '../providers/query-provider';
import { AuthProvider } from '../providers/auth-provider';
import { ToastProvider } from '../components/ui/toast';
import { AppLayout } from '../components/layout/app-layout';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'TaskPulse - Team Task Management Platform',
  description: 'Track projects, assign tasks, and manage progress with role-based access control.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <QueryProvider>
          <AuthProvider>
            <ToastProvider>
              <AppLayout>{children}</AppLayout>
            </ToastProvider>
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
