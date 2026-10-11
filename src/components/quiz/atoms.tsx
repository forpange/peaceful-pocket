import { useCallback, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import type { Lang } from '../../quiz/types';
import { tr } from '../../quiz/i18n';
import { whatsappUrl } from '../../quiz/storage';

/* ---------------- ProgressRing ---------------- */

interface ProgressRingProps {
  value: number;
  max: number;
  size?: number;
  color?: string;
}

export function ProgressRing({ value, max, size = 120, color = '#f97316' }: ProgressRingProps) {
  const stroke = Math.max(8, size / 10);
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const pct = max > 0 ? Math.min(1, Math.max(0, value / max)) : 0;

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#fed7aa" strokeWidth={stroke} />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          animate={{ strokeDashoffset: c * (1 - pct) }}
          transition={{ duration: 0.9, ease: 'easeOut' }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="font-display font-extrabold text-orange-950" style={{ fontSize: size / 3.6 }}>
          {value}/{max}
        </span>
      </div>
    </div>
  );
}

/* ---------------- useConfetti ---------------- */

const DEFAULT_COLORS = ['#f97316', '#ec4899', '#fbbf24', '#22c55e', '#38bdf8'];

export function useConfetti(): { burst: (colors?: string[]) => void } {
  const burst = useCallback((colors: string[] = DEFAULT_COLORS) => {
    confetti({ particleCount: 90, spread: 75, origin: { y: 0.6 }, colors });
    window.setTimeout(
      () => confetti({ particleCount: 45, angle: 60, spread: 60, origin: { x: 0, y: 0.75 }, colors }),
      200
    );
    window.setTimeout(
      () => confetti({ particleCount: 45, angle: 120, spread: 60, origin: { x: 1, y: 0.75 }, colors }),
      350
    );
  }, []);
  return { burst };
}

/* ---------------- AdSlot ---------------- */

export function AdSlot({ lang }: { lang: Lang }) {
  const client = (window as unknown as { QUIZPOP_AD_CLIENT?: string }).QUIZPOP_AD_CLIENT;

  useEffect(() => {
    if (!client) return;
    try {
      const w = window as unknown as { adsbygoogle?: unknown[] };
      w.adsbygoogle = w.adsbygoogle || [];
      w.adsbygoogle.push({});
    } catch {
      /* ads script not ready yet — ignore */
    }
  }, [client]);

  if (client) {
    return (
      <ins
        className="adsbygoogle block w-full"
        data-ad-client={client}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    );
  }
  return (
    <div className="w-full rounded-2xl border-2 border-dashed border-orange-200 bg-orange-50/60 px-4 py-5 text-center">
      <span className="text-sm font-bold uppercase tracking-widest text-orange-300">{tr('adLabel', lang)}</span>
    </div>
  );
}

/* ---------------- ConsentBox ---------------- */

interface ConsentBoxProps {
  lang: Lang;
  checked: boolean;
  onChange: (v: boolean) => void;
}

export function ConsentBox({ lang, checked, onChange }: ConsentBoxProps) {
  return (
    <label className="flex cursor-pointer items-start gap-3 rounded-2xl border-2 border-orange-100 bg-orange-50 p-4">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-0.5 h-5 w-5 shrink-0 accent-orange-500"
      />
      <span className="text-sm font-semibold leading-snug text-orange-900">{tr('consent', lang)}</span>
    </label>
  );
}

/* ---------------- ShareButtons ---------------- */

interface ShareButtonsProps {
  lang: Lang;
  title: string;
  url: string;
}

export function ShareButtons({ lang, title, url }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = url;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  };

  const nav = navigator as Navigator & { share?: (d: { title: string; text: string; url: string }) => Promise<void> };
  const canNativeShare = typeof nav.share === 'function';

  const nativeShare = () => {
    if (nav.share) nav.share({ title, text: title, url }).catch(() => { /* dismissed */ });
  };

  return (
    <div className="flex flex-col gap-3">
      <motion.a
        whileTap={{ scale: 0.97 }}
        href={whatsappUrl(title, url)}
        target="_blank"
        rel="noopener noreferrer"
        className="btn-chunky bg-[#25d366] text-center"
      >
        💬 {tr('whatsappShare', lang)}
      </motion.a>
      <div className="flex gap-3">
        <motion.button whileTap={{ scale: 0.97 }} onClick={copyLink} className="btn-chunky flex-1 bg-orange-500">
          {copied ? `✅ ${tr('copied', lang)}` : `🔗 ${tr('copyLink', lang)}`}
        </motion.button>
        {canNativeShare && (
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={nativeShare}
            className="btn-chunky bg-sky-500"
            aria-label="Share"
          >
            📤
          </motion.button>
        )}
      </div>
    </div>
  );
}
