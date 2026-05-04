interface Props {
  checked: boolean;
  onChange: () => void;
  label?: string;
}

export default function Toggle({ checked, onChange, label }: Props) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      onClick={onChange}
      className="flex items-center gap-3 min-h-[44px] transition-opacity active:opacity-60"
      style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: 0 }}
    >
      {/* Track */}
      <span
        className="relative inline-flex shrink-0 rounded-full transition-colors duration-200"
        style={{
          width: 48,
          height: 28,
          background: checked ? 'var(--accent)' : 'rgba(128,128,128,0.25)',
        }}
      >
        {/* Thumb */}
        <span
          className="absolute top-[3px] rounded-full shadow transition-transform duration-200"
          style={{
            width: 22,
            height: 22,
            background: '#ffffff',
            transform: checked ? 'translateX(23px)' : 'translateX(3px)',
          }}
        />
      </span>

      {label && (
        <span style={{
          fontFamily: 'var(--font-mono)',
          fontWeight: 300,
          fontSize: 17,
          color: 'var(--given-text)',
        }}>
          {label}
        </span>
      )}
    </button>
  );
}
