import type { QuizConfig, QuizQuestion } from '../types';

/**
 * Template question bank for the Fake Friends viral quiz.
 * The creator picks N questions (5/10/15) and records their own answers;
 * friends then try to match them. Options carry no tags/points — scoring
 * is pure "did you match the creator".
 */
const bank: QuizQuestion[] = [
  {
    id: 'ff-01',
    text: { en: 'What is my all-time favourite desi food?', ro: 'Mera all-time favourite desi khana kya hai?' },
    options: [
      { id: 'a', label: { en: 'Biryani', ro: 'Biryani' }, emoji: '🍚' },
      { id: 'b', label: { en: 'Nihari', ro: 'Nihari' }, emoji: '🍖' },
      { id: 'c', label: { en: 'Chicken karahi', ro: 'Chicken karahi' }, emoji: '🍗' },
      { id: 'd', label: { en: 'Daal chawal', ro: 'Daal chawal' }, emoji: '🫕' },
    ],
  },
  {
    id: 'ff-02',
    text: { en: 'If I could teleport anywhere right now, where would I go?', ro: 'Agar main abhi kahin teleport ho sakun, to kahan jaaun?' },
    options: [
      { id: 'a', label: { en: 'Maldives', ro: 'Maldives' }, emoji: '🏝️' },
      { id: 'b', label: { en: 'Hunza & Skardu', ro: 'Hunza aur Skardu' }, emoji: '🏔️' },
      { id: 'c', label: { en: 'Dubai', ro: 'Dubai' }, emoji: '🕌' },
      { id: 'd', label: { en: 'Turkey', ro: 'Turkey' }, emoji: '🇹🇷' },
    ],
  },
  {
    id: 'ff-03',
    text: { en: 'What scares me the most?', ro: 'Mujhe sab se zyada darr kis cheez se lagta hai?' },
    options: [
      { id: 'a', label: { en: 'Darkness', ro: 'Andhera' }, emoji: '🌑' },
      { id: 'b', label: { en: 'Lizards', ro: 'Chipkali' }, emoji: '🦎' },
      { id: 'c', label: { en: 'Heights', ro: 'Oonchai' }, emoji: '🧗' },
      { id: 'd', label: { en: 'Public speaking', ro: 'Stage par bolna' }, emoji: '🎤' },
    ],
  },
  {
    id: 'ff-04',
    text: { en: 'What is my hidden talent?', ro: 'Mera hidden talent kya hai?' },
    options: [
      { id: 'a', label: { en: 'Singing', ro: 'Gaana gaana' }, emoji: '🎤' },
      { id: 'b', label: { en: 'Cooking', ro: 'Khana banana' }, emoji: '👨‍🍳' },
      { id: 'c', label: { en: 'Mimicry', ro: 'Mimicry karna' }, emoji: '🎭' },
      { id: 'd', label: { en: 'Drawing', ro: 'Drawing banana' }, emoji: '🎨' },
    ],
  },
  {
    id: 'ff-05',
    text: { en: 'What is my go-to drink?', ro: 'Meri favourite drink kaunsi hai?' },
    options: [
      { id: 'a', label: { en: 'Doodh patti', ro: 'Doodh patti' }, emoji: '☕' },
      { id: 'b', label: { en: 'Kashmiri chai', ro: 'Kashmiri chai' }, emoji: '🫖' },
      { id: 'c', label: { en: 'Strong espresso', ro: 'Strong espresso' }, emoji: '⚡' },
      { id: 'd', label: { en: 'Green tea', ro: 'Green tea' }, emoji: '🍵' },
    ],
  },
  {
    id: 'ff-06',
    text: { en: 'What is my ideal weekend plan?', ro: 'Mera ideal weekend plan kya hai?' },
    options: [
      { id: 'a', label: { en: 'Hangout with friends', ro: 'Doston ke saath hangout' }, emoji: '🛋️' },
      { id: 'b', label: { en: 'Movie night at home', ro: 'Ghar par movie night' }, emoji: '🎬' },
      { id: 'c', label: { en: 'Long drive', ro: 'Long drive' }, emoji: '🚗' },
      { id: 'd', label: { en: 'Shopping spree', ro: 'Shopping' }, emoji: '🛍️' },
    ],
  },
  {
    id: 'ff-07',
    text: { en: 'Which season matches my vibe?', ro: 'Kaunsa season meri vibe se match karta hai?' },
    options: [
      { id: 'a', label: { en: 'Winter', ro: 'Sardi' }, emoji: '❄️' },
      { id: 'b', label: { en: 'Summer', ro: 'Garmi' }, emoji: '☀️' },
      { id: 'c', label: { en: 'Monsoon', ro: 'Barsaat' }, emoji: '🌧️' },
      { id: 'd', label: { en: 'Spring', ro: 'Basant' }, emoji: '🌸' },
    ],
  },
  {
    id: 'ff-08',
    text: { en: 'What am I mostly doing on my phone?', ro: 'Main phone par sab se zyada kya karta hoon?' },
    options: [
      { id: 'a', label: { en: 'Instagram reels', ro: 'Instagram reels' }, emoji: '📱' },
      { id: 'b', label: { en: 'WhatsApp gossip', ro: 'WhatsApp par gupshup' }, emoji: '💬' },
      { id: 'c', label: { en: 'YouTube rabbit hole', ro: 'YouTube videos' }, emoji: '▶️' },
      { id: 'd', label: { en: 'Mobile games', ro: 'Mobile games' }, emoji: '🎮' },
    ],
  },
  {
    id: 'ff-09',
    text: { en: 'If I got one superpower, I would pick…', ro: 'Agar mujhe ek superpower mile to main…' },
    options: [
      { id: 'a', label: { en: 'Invisibility', ro: 'Gayab hona' }, emoji: '🫥' },
      { id: 'b', label: { en: 'Time travel', ro: 'Time travel' }, emoji: '⏳' },
      { id: 'c', label: { en: 'Mind reading', ro: "Dil ki baat parhna" }, emoji: '🧠' },
      { id: 'd', label: { en: 'Flying', ro: 'Urna' }, emoji: '🦸' },
    ],
  },
  {
    id: 'ff-10',
    text: { en: "It's 2am. What am I craving?", ro: 'Raat ke 2 baj rahe hain. Mera dil kya chahta hai?' },
    options: [
      { id: 'a', label: { en: 'Maggi', ro: 'Maggi' }, emoji: '🍜' },
      { id: 'b', label: { en: 'French fries', ro: 'French fries' }, emoji: '🍟' },
      { id: 'c', label: { en: 'Ice cream', ro: 'Ice cream' }, emoji: '🍨' },
      { id: 'd', label: { en: 'Samosa', ro: 'Samosa' }, emoji: '🥟' },
    ],
  },
  {
    id: 'ff-11',
    text: { en: 'Which colour would I wear every day?', ro: 'Main roz kaunsa colour pehnun?' },
    options: [
      { id: 'a', label: { en: 'Black', ro: 'Kala' }, emoji: '🖤' },
      { id: 'b', label: { en: 'Pink', ro: 'Gulabi' }, emoji: '💗' },
      { id: 'c', label: { en: 'Blue', ro: 'Neela' }, emoji: '💙' },
      { id: 'd', label: { en: 'Green', ro: 'Hara' }, emoji: '💚' },
    ],
  },
  {
    id: 'ff-12',
    text: { en: 'If I got a pet tomorrow, it would be…', ro: 'Agar kal mujhe pet mile to wo hoga…' },
    options: [
      { id: 'a', label: { en: 'Cat', ro: 'Billi' }, emoji: '🐱' },
      { id: 'b', label: { en: 'Dog', ro: 'Kutta' }, emoji: '🐶' },
      { id: 'c', label: { en: 'Parrot', ro: 'Tota' }, emoji: '🦜' },
      { id: 'd', label: { en: 'No pet, just plants', ro: 'Koi pet nahi, bas plants' }, emoji: '🌱' },
    ],
  },
  {
    id: 'ff-13',
    text: { en: 'Eid shopping starts. What do I buy first?', ro: 'Eid ki shopping shuru. Sab se pehle kya khareedoon?' },
    options: [
      { id: 'a', label: { en: 'Clothes', ro: 'Kapray' }, emoji: '👗' },
      { id: 'b', label: { en: 'Shoes', ro: 'Jootay' }, emoji: '👟' },
      { id: 'c', label: { en: 'Mehndi', ro: 'Mehndi' }, emoji: '🌿' },
      { id: 'd', label: { en: 'Nothing — collecting eidi', ro: 'Kuch nahi, eidi jama karni hai' }, emoji: '💸' },
    ],
  },
  {
    id: 'ff-14',
    text: { en: 'What is my sleep style?', ro: 'Meri neend ka style kya hai?' },
    options: [
      { id: 'a', label: { en: 'Early sleeper', ro: 'Jaldi sonay wala' }, emoji: '😴' },
      { id: 'b', label: { en: 'Night owl', ro: 'Raat ka ullu' }, emoji: '🦉' },
      { id: 'c', label: { en: 'Power-nap pro', ro: 'Power nap expert' }, emoji: '👑' },
      { id: 'd', label: { en: "Sleep? Never heard of her", ro: 'Neend naam ki cheez nahi' }, emoji: '🥱' },
    ],
  },
  {
    id: 'ff-15',
    text: { en: 'When I am angry, I…', ro: 'Jab mujhe gussa aata hai to main…' },
    options: [
      { id: 'a', label: { en: 'Go completely silent', ro: 'Bilkul khamosh ho jata hoon' }, emoji: '🤐' },
      { id: 'b', label: { en: 'Laugh it off', ro: 'Hans kar taal deta hoon' }, emoji: '😅' },
      { id: 'c', label: { en: 'Cry a little', ro: 'Thora ro leta hoon' }, emoji: '😭' },
      { id: 'd', label: { en: 'Say it straight to the face', ro: 'Munh par bol deta hoon' }, emoji: '🗣️' },
    ],
  },
  {
    id: 'ff-16',
    text: { en: 'My favourite drama/movie genre is…', ro: 'Mera favourite drama/movie genre hai…' },
    options: [
      { id: 'a', label: { en: 'Romantic', ro: 'Romantic' }, emoji: '💕' },
      { id: 'b', label: { en: 'Comedy', ro: 'Comedy' }, emoji: '😂' },
      { id: 'c', label: { en: 'Thriller', ro: 'Thriller' }, emoji: '🔪' },
      { id: 'd', label: { en: 'Horror', ro: 'Horror' }, emoji: '👻' },
    ],
  },
  {
    id: 'ff-17',
    text: { en: 'It starts raining. I immediately…', ro: 'Baarish shuru ho jaye to main foran…' },
    options: [
      { id: 'a', label: { en: 'Make pakoray + chai', ro: 'Pakoray aur chai banao' }, emoji: '☔' },
      { id: 'b', label: { en: 'Go for a long drive', ro: 'Long drive par niklo' }, emoji: '🚗' },
      { id: 'c', label: { en: 'Crawl into a blanket', ro: 'Kambal mein ghus jao' }, emoji: '🛌' },
      { id: 'd', label: { en: 'Call my friends', ro: 'Doston ko call karo' }, emoji: '📞' },
    ],
  },
  {
    id: 'ff-18',
    text: { en: 'How do I shop?', ro: 'Main shopping kaise karta hoon?' },
    options: [
      { id: 'a', label: { en: 'Online, always', ro: 'Online hi' }, emoji: '🛒' },
      { id: 'b', label: { en: 'Wandering the bazaar', ro: 'Bazaar ghoom kar' }, emoji: '🏪' },
      { id: 'c', label: { en: 'Waiting for sales', ro: 'Sale ka wait kar ke' }, emoji: '⏳' },
      { id: 'd', label: { en: 'Brand stores only', ro: 'Sirf brand stores se' }, emoji: '🛍️' },
    ],
  },
  {
    id: 'ff-19',
    text: { en: 'My dream birthday looks like…', ro: 'Meri dream birthday kaisi hogi?' },
    options: [
      { id: 'a', label: { en: 'Surprise party', ro: 'Surprise party' }, emoji: '🎉' },
      { id: 'b', label: { en: 'Long drive + dinner', ro: 'Long drive aur dinner' }, emoji: '🍽️' },
      { id: 'c', label: { en: 'Piles of gifts', ro: 'Dher saaray gifts' }, emoji: '🎁' },
      { id: 'd', label: { en: 'Just my favourite people', ro: 'Bas apne favourite log' }, emoji: '🫂' },
    ],
  },
  {
    id: 'ff-20',
    text: { en: 'Describe me in ONE word:', ro: 'Mujhe EK lafz mein describe karo:' },
    options: [
      { id: 'a', label: { en: 'Funny', ro: 'Funny' }, emoji: '😂' },
      { id: 'b', label: { en: 'Emotional', ro: 'Emotional' }, emoji: '🥺' },
      { id: 'c', label: { en: 'Chill', ro: 'Chill' }, emoji: '😎' },
      { id: 'd', label: { en: 'Full drama', ro: 'Full drama' }, emoji: '👑' },
    ],
  },
];

export const fakeFriends: QuizConfig = {
  id: 'fake-friends',
  kind: 'viral',
  category: 'fun',
  title: { en: 'Find the Fake Friends', ro: 'Fake Friends ko dhoondo' },
  tagline: {
    en: 'Make a quiz about yourself, share it, and see who really knows you.',
    ro: 'Apne baare mein quiz banao, share karo, dekho kon tumhein asal mein janta hai.',
  },
  howItWorks: {
    en: 'Answer questions about yourself, share your link, friends play and you see the scoreboard.',
    ro: 'Apne baare mein sawalon ke jawab do, link share karo, dost khelein aur scoreboard dekho.',
  },
  emoji: '🕵️',
  gradient: 'from-indigo-500 via-violet-400 to-purple-300',
  glow: '#6366f1',
  questions: [],
  bank,
  questionCounts: [5, 10, 15],
  capture: ['age', 'city'],
};
