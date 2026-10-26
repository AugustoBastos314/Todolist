import styles from './EmptyState.module.css';

export default function EmptyState({ title, hint }) {
  return (
    <div className={styles.wrap}>
      <svg width="200" height="160" viewBox="0 0 200 160" fill="none" aria-hidden="true">
        <ellipse cx="100" cy="142" rx="62" ry="9" fill="#f3ece8" />
        <rect x="52" y="22" width="96" height="112" rx="12" fill="#fff" stroke="#e6dcd6" strokeWidth="2" />
        <rect x="70" y="8" width="60" height="26" rx="8" fill="#db4c3f" />
        <circle cx="100" cy="21" r="4" fill="#fff" />
        <circle cx="70" cy="58" r="8" fill="#fff" stroke="#e6dcd6" strokeWidth="2" />
        <circle cx="70" cy="86" r="8" fill="#fff" stroke="#e6dcd6" strokeWidth="2" />
        <circle cx="70" cy="114" r="8" fill="url(#g)" />
        <path d="M66.5 114.5l2.5 2.5 5-5.5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <rect x="88" y="55" width="40" height="6" rx="3" fill="#f0e8e3" />
        <rect x="88" y="83" width="30" height="6" rx="3" fill="#f0e8e3" />
        <rect x="88" y="111" width="36" height="6" rx="3" fill="#f0e8e3" />
        <defs>
          <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#ffa24d" />
            <stop offset="1" stopColor="#c8281f" />
          </linearGradient>
        </defs>
      </svg>
      <p className={styles.title}>{title}</p>
      {hint && <p className={styles.hint}>{hint}</p>}
    </div>
  );
}
