import { useState } from 'react';
import { motion } from 'framer-motion';
import type { Lang, QuizConfig } from '../../quiz/types';
import { tr } from '../../quiz/i18n';
import { getSource, type PlayerProfile } from '../../quiz/storage';
import { ConsentBox } from './atoms';

interface Props {
  quiz: QuizConfig;
  lang: Lang;
  onContinue: (p: PlayerProfile) => void;
  onBack: () => void;
}

const AGES = ['age_under18', 'age_18_24', 'age_25_34', 'age_35plus'] as const;

export function ProfileGate({ quiz, lang, onContinue, onBack }: Props) {
  const [nickname, setNickname] = useState('');
  const [age, setAge] = useState('');
  const [city, setCity] = useState('');
  const [email, setEmail] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [consent, setConsent] = useState(false);

  const go = (full: boolean) => {
    const name = nickname.trim() || (full ? '' : 'Player');
    if (!name) return;
    onContinue({
      nickname: name,
      ...(full && age ? { age } : {}),
      ...(full && city.trim() ? { city: city.trim() } : {}),
      ...(full && email.trim() ? { email: email.trim() } : {}),
      ...(full && whatsapp.trim() ? { whatsapp: whatsapp.trim() } : {}),
      consent: full ? consent : false,
      source: getSource(),
    });
  };

  const show = (f: string) => quiz.capture.includes(f as 'email');

  return (
    <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="quiz-card mx-auto max-w-lg px-6 py-8">
      <h2 className="font-display text-2xl font-extrabold text-orange-950">{tr('almostThere', lang)}</h2>
      <p className="mt-1 text-sm font-semibold text-orange-900/60">{tr('tellUs', lang)}</p>

      <div className="mt-5 flex flex-col gap-4">
        <div>
          <label className="mb-1 block text-sm font-extrabold text-orange-900">{tr('yourName', lang)} *</label>
          <input
            className="input-chunky"
            placeholder={tr('namePlaceholder', lang)}
            value={nickname}
            maxLength={24}
            onChange={(e) => setNickname(e.target.value)}
          />
        </div>

        {show('age') && (
          <div>
            <label className="mb-1 block text-sm font-extrabold text-orange-900">{tr('ageLabel', lang)}</label>
            <div className="flex flex-wrap gap-2">
              {AGES.map((a) => (
                <button
                  key={a}
                  onClick={() => setAge(age === a ? '' : a)}
                  className={`rounded-full px-4 py-2 font-bold transition-all ${
                    age === a ? 'bg-orange-500 text-white shadow' : 'bg-orange-50 text-orange-900 border-2 border-orange-100'
                  }`}
                >
                  {tr(a, lang)}
                </button>
              ))}
            </div>
          </div>
        )}

        {show('city') && (
          <div>
            <label className="mb-1 block text-sm font-extrabold text-orange-900">{tr('cityLabel', lang)}</label>
            <input className="input-chunky" value={city} maxLength={40} onChange={(e) => setCity(e.target.value)} placeholder="Lahore" />
          </div>
        )}

        {show('email') && (
          <div>
            <label className="mb-1 block text-sm font-extrabold text-orange-900">{tr('emailLabel', lang)}</label>
            <input
              className="input-chunky"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />
          </div>
        )}

        {show('whatsapp') && (
          <div>
            <label className="mb-1 block text-sm font-extrabold text-orange-900">{tr('whatsappLabel', lang)}</label>
            <input
              className="input-chunky"
              type="tel"
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              placeholder="03xx xxxxxxx"
            />
          </div>
        )}

        <ConsentBox lang={lang} checked={consent} onChange={setConsent} />

        <button onClick={() => go(true)} disabled={!nickname.trim()} className="btn-chunky bg-orange-500">
          {tr('continue', lang)} →
        </button>
        <div className="flex items-center justify-between">
          <button onClick={onBack} className="font-bold text-orange-700 underline-offset-2 hover:underline">
            ← {tr('back', lang)}
          </button>
          <button onClick={() => go(false)} className="font-bold text-orange-700 underline-offset-2 hover:underline">
            {tr('skip', lang)}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
