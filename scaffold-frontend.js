#!/usr/bin/env node
/**
 * Scaffold production-grade frontend folders and boilerplate files.
 * Node.js script for MSSMEBazaar Next.js app.
 */

const fs = require('fs');
const path = require('path');

const baseDir = path.join(__dirname, 'frontend');

// Folder blueprint
const structure = [
  'public/assets/icons',
  'public/assets/onboarding',
  'public/assets/logos',
  'src/app/(auth)/login',
  'src/app/(auth)/register',
  'src/app/(auth)/logout',
  'src/app/(roles)/buyer/free',
  'src/app/(roles)/buyer/pro/onboarding',
  'src/app/(roles)/seller',
  'src/app/(roles)/investor',
  'src/app/(roles)/admin',
  'src/app/(roles)/superadmin',
  'src/components/ui',
  'src/components/layout',
  'src/components/nav',
  'src/components/onboarding',
  'src/components/gating',
  'src/modules/onboarding',
  'src/modules/business-loans',
  'src/modules/business-valuation',
  'src/modules/market-linkage',
  'src/modules/compliance',
  'src/modules/exit-strategy',
  'src/modules/leadership-training',
  'src/services',
  'src/store',
  'src/hooks',
  'src/config',
  'src/utils',
  'src/types',
  'src/styles',
  'src/tests/__tests__',
  '.github/workflows'
];

// Template creation helper
function createFile(filePath, content) {
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, content.trimStart());
    console.log(`✅ Created: ${filePath}`);
  }
}

// Create folders
structure.forEach(folder => {
  const dirPath = path.join(baseDir, folder);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`📂 Created: ${dirPath}`);
  }
});

// Boilerplate files
createFile(path.join(baseDir, 'src/app/layout.tsx'), `
  import React from 'react';
  import '../styles/globals.css';
  import { Navbar } from '../components/layout/Navbar';
  import { Footer } from '../components/layout/Footer';

  export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
      <html lang="en">
        <body>
          <Navbar />
          <main>{children}</main>
          <Footer />
        </body>
      </html>
    );
  }
`);

createFile(path.join(baseDir, 'src/services/apiClient.ts'), `
  import axios from 'axios';
  import { API_BASE_URL } from '../config';

  export const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: { 'Content-Type': 'application/json' },
  });

  apiClient.interceptors.response.use(
    resp => resp,
    error => {
      console.error('API Error:', error);
      throw error;
    }
  );
`);

createFile(path.join(baseDir, 'src/config/index.ts'), `
  export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.example.com';
  export const APP_NAME = 'MSMEBazaar';
`);

createFile(path.join(baseDir, 'src/store/auth.store.ts'), `
  import { create } from 'zustand';
  import { User } from '../types/user';

  interface AuthState {
    user: User | null;
    setUser: (user: User | null) => void;
    logout: () => void;
  }

  export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    setUser: (user) => set({ user }),
    logout: () => set({ user: null }),
  }));
`);

createFile(path.join(baseDir, 'src/hooks/useAuth.ts'), `
  import { useAuthStore } from '../store/auth.store';

  export const useAuth = () => {
    const { user, setUser, logout } = useAuthStore();
    return { user, setUser, logout };
  };
`);

createFile(path.join(baseDir, 'src/types/user.ts'), `
  export interface User {
    id: string;
    name: string;
    email: string;
    role: string;
    token?: string;
  }
`);

createFile(path.join(baseDir, '.env.example'), `
NEXT_PUBLIC_API_URL=https://api.example.com
NEXT_PUBLIC_ENV=development
`);

createFile(path.join(baseDir, '.github/workflows/ci-cd.yml'), `
name: CI/CD
on: [push]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm ci
      - run: npm run lint
      - run: npm run build
`);

console.log('🚀 Scaffold complete! You can now start coding.');
