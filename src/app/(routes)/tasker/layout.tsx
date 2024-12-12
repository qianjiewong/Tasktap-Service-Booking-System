'use client';

import React, { ReactNode } from 'react';
import { SessionProvider } from 'next-auth/react';
import { Toaster } from '@/components/ui/toaster';
import Header from '@/app/_components/Header';
import TaskerHeader from '@/app/_components/TaskerHeader';


type LayoutProps = {
  children: ReactNode;
};

function Layout({ children }: LayoutProps) {
  return (
    <div>
      <SessionProvider>
        <div>
          {children}
          <Toaster />
        </div>
      </SessionProvider>
    </div>
  );
}

export default Layout;
