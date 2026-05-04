interface Props {
  onMenu: () => void;
  onShop: () => void;
}

export default function TopBar({ onMenu, onShop }: Props) {
  return (
    <div className="flex items-center justify-between w-full">
      <button
        onClick={onMenu}
        className="p-2 text-xl leading-none rounded transition-opacity active:opacity-50"
        style={{ color: 'var(--accent)' }}
        aria-label="메뉴"
      >
        ☰
      </button>

      <span
        className="text-[20px] font-thin tracking-[3px]"
        style={{ color: 'var(--given-text)', fontFamily: 'var(--font-mono)' }}
      >
        SUDOKU
      </span>

      <button
        onClick={onShop}
        className="p-2 text-xl leading-none rounded transition-opacity active:opacity-50"
        style={{ color: 'var(--accent)' }}
        aria-label="샵"
      >
        🛒
      </button>
    </div>
  );
}
