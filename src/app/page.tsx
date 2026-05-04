'use client';
import dynamic from 'next/dynamic';

// SSR 비활성화 — 게임은 브라우저 전용 (localStorage, timer 등)
const SudokuApp = dynamic(() => import('@/components/SudokuApp'), { ssr: false });

export default function Page() {
  return <SudokuApp />;
}

