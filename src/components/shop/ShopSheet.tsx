'use client';
import { useEffect, useRef, useState } from 'react';

interface ShopItem { id: string; title: string; description: string; price: number; }
const ITEMS: ShopItem[] = [
  { id: 'hints_5',  title: '힌트 5',  description: '힌트 5회 추가',   price: 5_000 },
  { id: 'hints_10', title: '힌트 10', description: '힌트 10회 추가',  price: 10_000 },
  { id: 'heart_1',  title: '하트 +1', description: '이번 게임 실수 +1 허용', price: 1_000 },
];

interface Props {
  score: number;
  hintStock: number;
  onPurchase: (id: string, price: number) => boolean;
  onAddHeart: () => void;
  onClose: () => void;
}

export default function ShopSheet({ score, hintStock, onPurchase, onAddHeart, onClose }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [onClose]);

  const handleBuy = (item: ShopItem) => {
    const ok = onPurchase(item.id, item.price);
    if (!ok) { setMessage('포인트가 부족합니다.'); return; }
    if (item.id === 'heart_1') onAddHeart();
    setMessage(`${item.title} 구매 완료!`);
    setTimeout(() => setMessage(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center" style={{ background: 'rgba(0,0,0,0.4)' }}>
      <div
        ref={ref}
        className="w-full max-w-lg rounded-t-2xl p-5 pb-10"
        style={{ background: 'var(--surface)', maxHeight: '80vh', overflowY: 'auto' }}
      >
        <div className="w-10 h-1 rounded mx-auto mb-4" style={{ background: 'var(--muted)' }} />

        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[20px] font-thin tracking-widest" style={{ color: 'var(--given-text)', fontFamily: 'var(--font-mono)' }}>
            샵
          </h2>
          <span className="text-[11px]" style={{ color: 'var(--muted)', fontFamily: 'var(--font-mono)' }}>
            {score.toLocaleString()}점 보유
          </span>
        </div>

        {message && (
          <p className="text-sm mb-3" style={{ color: 'var(--accent)' }}>{message}</p>
        )}

        <div className="flex flex-col gap-3">
          {ITEMS.map(item => {
            const canAfford = score >= item.price;
            const extra = item.id.startsWith('hints') ? `보유: ${hintStock}` : undefined;
            return (
              <div
                key={item.id}
                className="flex items-center justify-between gap-3 p-4 rounded-lg"
                style={{ background: 'var(--accent-soft)' }}
              >
                <div className="flex-1 min-w-0">
                  <p className="font-light" style={{ color: 'var(--given-text)', fontFamily: 'var(--font-mono)', fontSize: 17 }}>
                    {item.title}
                  </p>
                  <p className="text-[13px]" style={{ color: 'var(--muted)' }}>{item.description}</p>
                  {extra && <p className="text-[11px]" style={{ color: 'var(--muted)', fontFamily: 'var(--font-mono)' }}>{extra}</p>}
                </div>
                <button
                  disabled={!canAfford}
                  onClick={() => handleBuy(item)}
                  className="shrink-0 px-4 py-2 rounded text-[11px] transition-opacity"
                  style={{
                    fontFamily: 'var(--font-mono)',
                    background: canAfford ? 'var(--accent)' : 'rgba(128,128,128,0.4)',
                    color: canAfford ? 'var(--accent-label)' : 'rgba(255,255,255,0.5)',
                    cursor: canAfford ? 'pointer' : 'not-allowed',
                  }}
                >
                  {item.price.toLocaleString()}점
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
