/**
 * components/layouts/main-layout.tsx
 * Top-level layout wrapper used by pages/_app or App Router
 */
import React, { ReactNode } from "react";
import ThemeProvider from "../theme-provider";
import ErrorBoundary from "../common/ErrorBoundary";
import Loader from "../common/Loader";
import Navbar from "../navbar/navbar";

export interface MainLayoutProps {
  children: ReactNode;
  header?: ReactNode;
  footer?: ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children, header, footer }) => {
  return (
    <ThemeProvider>
      <ErrorBoundary fallback={<Loader />}>
        <div className="min-h-screen flex flex-col bg-white text-gray-900">
          <Navbar />
          {header}
          <main className="flex-1 container mx-auto px-4 py-6">{children}</main>
          {footer ?? (
            <footer className="border-t py-6 text-center text-sm text-gray-500">
              © {new Date().getFullYear()} MSMEBazaar
            </footer>
          )}
        </div>
      </ErrorBoundary>
    </ThemeProvider>
  );
};

export default MainLayout;
