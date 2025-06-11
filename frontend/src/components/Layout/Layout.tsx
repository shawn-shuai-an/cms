import React from 'react';
import LayoutClient from './LayoutClient';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return <LayoutClient>{children}</LayoutClient>;
} 