'use client';

import React, { ReactNode } from 'react';
import { SessionProvider } from 'next-auth/react';
import { Toaster } from '@/components/ui/toaster';


type LayoutProps = {
  children: ReactNode;
};

function Layout({ children }: LayoutProps) {
  return (
    <SessionProvider>
        <div> 
          {children}
          <Toaster /> 
        </div>
      </SessionProvider>
    )
}

export default Layout;
