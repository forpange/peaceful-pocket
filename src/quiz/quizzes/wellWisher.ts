import type { QuizConfig, QuizQuestion } from '../types';

/**
 * Template question bank for the Secret Well-Wisher viral quiz.
 * Playful "secret admirer / ditto copy" style: the creator answers about
 * themselves, friends try to match the vibe. No tags/points — scoring is
 * pure "did you match the creator".
 */
const bank: QuizQuestion[] = [
  {
    id: 'ww-01',
    text: { en: 'If someone had a secret crush on me, what would they admire first?', ro: 'Agar kisi ko mujh par secret crush ho to wo sab se pehle kya admire karega?' },
    options: [
      { id: 'a', label: { en: 'My smile', ro: 'Meri smile' }, emoji: '😁' },
      { id: 'b', label: { en: 'My style', ro: 'Mera style' }, emoji: '😎' },
      { id: 'c', label: { en: 'My sense of humour', ro: 'Mera sense of humour' }, emoji: '😂' },
      { id: 'd', label: { en: 'My cooking', ro: 'Mera khana' }, emoji: '🍳' },
    ],
  },
  {
    id: 'ww-02',
    text: { en: 'My friends call me the ___ of the group.', ro: 'Dost mujhe group ka ___ kehte hain.' },
    options: [
      { id: 'a', label: { en: 'Comedian', ro: 'Comedian' }, emoji: '😂' },
      { id: 'b', label: { en: 'Therapist', ro: 'Therapist' }, emoji: '💌' },
      { id: 'c', label: { en: 'Planner', ro: 'Planner' }, emoji: '📋' },
      { id: 'd', label: { en: 'Latecomer', ro: 'Latecomer' }, emoji: '⏰' },
    ],
  },
  {
    id: 'ww-03',
    text: { en: 'My most annoying habit is…', ro: 'Meri sab se annoying aadat hai…' },
    options: [
      { id: 'a', label: { en: 'Replying late', ro: 'Late reply' }, emoji: '⏰' },
      { id: 'b', label: { en: 'Talking too much', ro: 'Zyada bolna' }, emoji: '🗣️' },
      { id: 'c', label: { en: 'Too many selfies', ro: 'Bohat selfies' }, emoji: '🤳' },
      { id: 'd', label: { en: 'Never sharing food', ro: 'Khana share na karna' }, emoji: '🍟' },
    ],
  },
  {
    id: 'ww-04',
    text: { en: 'My dream date would be…', ro: 'Meri dream date hogi…' },
    options: [
      { id: 'a', label: { en: 'Long drive', ro: 'Long drive' }, emoji: '🚗' },
      { id: 'b', label: { en: 'Candlelight dinner', ro: 'Candlelight dinner' }, emoji: '🕯️' },
      { id: 'c', label: { en: 'Chai at a dhaba', ro: 'Dhabe ki chai' }, emoji: '☕' },
      { id: 'd', label: { en: 'Movie night', ro: 'Movie night' }, emoji: '🎬' },
    ],
  },
  {
    id: 'ww-05',
    text: { en: 'I cannot survive a single day without…', ro: 'Main ek din bhi ___ ke baghair nahi guzaar sakta.' },
    options: [
      { id: 'a', label: { en: 'My phone', ro: 'Apna phone' }, emoji: '📱' },
      { id: 'b', label: { en: 'Chai', ro: 'Chai' }, emoji: '☕' },
      { id: 'c', label: { en: 'My best friend', ro: 'Apna best friend' }, emoji: '👯' },
      { id: 'd', label: { en: 'My afternoon nap', ro: 'Dopahar ki neend' }, emoji: '😴' },
    ],
  },
  {
    id: 'ww-06',
    text: { en: 'If I were invisible for a day, I would first…', ro: 'Agar main ek din ke liye invisible ho jaaun to sab se pehle…' },
    options: [
      { id: 'a', label: { en: 'Sneak into a concert', ro: 'Concert mein ghus jao' }, emoji: '🎶' },
      { id: 'b', label: { en: 'Prank my friends', ro: 'Doston ko prank karo' }, emoji: '😈' },
      { id: 'c', label: { en: 'Nap in peace', ro: 'Sukoon se so jao' }, emoji: '😴' },
      { id: 'd', label: { en: 'Eat free biryani', ro: 'Muft ki biryani khao' }, emoji: '🍚' },
    ],
  },
  {
    id: 'ww-07',
    text: { en: 'Which animal matches my personality?', ro: 'Kaunsa janwar meri personality se match karta hai?' },
    options: [
      { id: 'a', label: { en: 'Cat', ro: 'Billi' }, emoji: '🐱' },
      { id: 'b', label: { en: 'Lion', ro: 'Sher' }, emoji: '🦁' },
      { id: 'c', label: { en: 'Owl', ro: 'Ullu' }, emoji: '🦉' },
      { id: 'd', label: { en: 'Monkey', ro: 'Bandar' }, emoji: '🐵' },
    ],
  },
  {
    id: 'ww-08',
    text: { en: 'My friends secretly think I am…', ro: 'Mere dost chhup ke samajhte hain ke main…' },
    options: [
      { id: 'a', label: { en: 'A softie', ro: 'Naram dil' }, emoji: '🥺' },
      { id: 'b', label: { en: 'A drama queen/king', ro: 'Drama queen/king' }, emoji: '👑' },
      { id: 'c', label: { en: 'A genius', ro: 'Genius' }, emoji: '🧠' },
      { id: 'd', label: { en: 'A foodie', ro: 'Foodie' }, emoji: '🍔' },
    ],
  },
  {
    id: 'ww-09',
    text: { en: 'If I won the lottery tomorrow, my first splurge would be…', ro: 'Agar kal lottery lag jaye to sab se pehle…' },
    options: [
      { id: 'a', label: { en: 'World tour', ro: 'World tour' }, emoji: '✈️' },
      { id: 'b', label: { en: 'New phone', ro: 'Naya phone' }, emoji: '📱' },
      { id: 'c', label: { en: 'Treat all my friends', ro: 'Sab doston ki dawat' }, emoji: '🍽️' },
      { id: 'd', label: { en: 'Save it like a good kid', ro: 'Bachat, achay bachon ki tarah' }, emoji: '🏦' },
    ],
  },
  {
    id: 'ww-10',
    text: { en: 'My guilty-pleasure show is…', ro: 'Mera guilty-pleasure show hai…' },
    options: [
      { id: 'a', label: { en: 'Romantic dramas', ro: 'Romantic dramas' }, emoji: '💕' },
      { id: 'b', label: { en: 'Reality shows', ro: 'Reality shows' }, emoji: '🎥' },
      { id: 'c', label: { en: 'Cartoons', ro: 'Cartoons' }, emoji: '🍿' },
      { id: 'd', label: { en: 'Cricket highlights', ro: 'Cricket highlights' }, emoji: '🏏' },
    ],
  },
  {
    id: 'ww-11',
    text: { en: 'The song I secretly sing in the shower is…', ro: 'Wo gaana jo main bathroom mein gate gate hoon…' },
    options: [
      { id: 'a', label: { en: 'Old Bollywood classics', ro: 'Purane Bollywood classics' }, emoji: '🎶' },
      { id: 'b', label: { en: 'Atif Aslam', ro: 'Atif Aslam' }, emoji: '🎤' },
      { id: 'c', label: { en: 'Coke Studio bangers', ro: 'Coke Studio' }, emoji: '🥁' },
      { id: 'd', label: { en: 'Whatever is trending', ro: 'Jo trending ho' }, emoji: '📈' },
    ],
  },
  {
    id: 'ww-12',
    text: { en: 'My ideal shaadi would be…', ro: 'Meri ideal shaadi hogi…' },
    options: [
      { id: 'a', label: { en: 'Big fat dhoom-dhaam', ro: 'Bari dhoom dhaam wali' }, emoji: '💃' },
      { id: 'b', label: { en: 'Simple nikkah', ro: 'Simple nikkah' }, emoji: '🤍' },
      { id: 'c', label: { en: 'Destination wedding', ro: 'Destination wedding' }, emoji: '✈️' },
      { id: 'd', label: { en: 'Shaadi? No thanks', ro: 'Shaadi? Rehne do' }, emoji: '🙈' },
    ],
  },
  {
    id: 'ww-13',
    text: { en: 'I spend the most money on…', ro: 'Main sab se zyada paise urata hoon…' },
    options: [
      { id: 'a', label: { en: 'Food', ro: 'Khanay par' }, emoji: '🍔' },
      { id: 'b', label: { en: 'Clothes', ro: 'Kapron par' }, emoji: '👗' },
      { id: 'c', label: { en: 'Gadgets', ro: 'Gadgets par' }, emoji: '📱' },
      { id: 'd', label: { en: 'Gifts for others', ro: "Doston ke gifts par" }, emoji: '🎁' },
    ],
  },
  {
    id: 'ww-14',
    text: { en: 'My 3am thoughts are usually about…', ro: 'Raat 3 baje mere zehan mein hota hai…' },
    options: [
      { id: 'a', label: { en: 'Future plans', ro: 'Future plans' }, emoji: '🔮' },
      { id: 'b', label: { en: 'Embarrassing memories from 2015', ro: '2015 ki sharmindagi wali yaadein' }, emoji: '😳' },
      { id: 'c', label: { en: 'Food', ro: 'Khana' }, emoji: '🍜' },
      { id: 'd', label: { en: 'Nothing — I am asleep', ro: 'Kuch nahi, main so raha hota hoon' }, emoji: '😴' },
    ],
  },
  {
    id: 'ww-15',
    text: { en: 'If my life had a title, it would be…', ro: 'Agar meri zindagi ka title hota to…' },
    options: [
      { id: 'a', label: { en: '"Kahani Ghar Ghar Ki"', ro: '"Kahani Ghar Ghar Ki"' }, emoji: '🏠' },
      { id: 'b', label: { en: '"Mission Impossible"', ro: '"Mission Impossible"' }, emoji: '🕶️' },
      { id: 'c', label: { en: '"Comedy Nights"', ro: '"Comedy Nights"' }, emoji: '😂' },
      { id: 'd', label: { en: '"Sasural Simar Ka"', ro: '"Sasural Simar Ka"' }, emoji: '📺' },
    ],
  },
  {
    id: 'ww-16',
    text: { en: 'The cutest thing in the world, according to me, is…', ro: 'Mere hisaab se duniya ki sab se cute cheez hai…' },
    options: [
      { id: 'a', label: { en: 'Baby goats', ro: 'Bakri ke bachay' }, emoji: '🐐' },
      { id: 'b', label: { en: 'My niece/nephew', ro: 'Mera bhanja/bhatija' }, emoji: '👶' },
      { id: 'c', label: { en: 'Me, obviously', ro: 'Main, obviously' }, emoji: '😎' },
      { id: 'd', label: { en: 'Biryani', ro: 'Biryani' }, emoji: '🍚' },
    ],
  },
  {
    id: 'ww-17',
    text: { en: 'My love language is…', ro: 'Meri love language hai…' },
    options: [
      { id: 'a', label: { en: 'Acts of service', ro: 'Kaam kar ke dikhana' }, emoji: '🫶' },
      { id: 'b', label: { en: 'Quality time', ro: 'Saath waqt guzarna' }, emoji: '⏰' },
      { id: 'c', label: { en: 'Gifts', ro: 'Gifts' }, emoji: '🎁' },
      { id: 'd', label: { en: 'Shared biryani = love', ro: 'Biryani share karna' }, emoji: '🍚' },
    ],
  },
  {
    id: 'ww-18',
    text: { en: 'On the desi-mom scolding scale, I am at…', ro: 'Desi ammi ki daant ke scale par main hoon…' },
    options: [
      { id: 'a', label: { en: '"Beta, tum to farishta ho"', ro: '"Beta, tum to farishta ho"' }, emoji: '😇' },
      { id: 'b', label: { en: '"Thora sudhar jao"', ro: '"Thora sudhar jao"' }, emoji: '🙂' },
      { id: 'c', label: { en: '"Sharma ji ke betay ko dekho"', ro: '"Sharma ji ke betay ko dekho"' }, emoji: '😅' },
      { id: 'd', label: { en: '"Chappal kahan hai?"', ro: '"Chappal kahan hai?"' }, emoji: '🩴' },
    ],
  },
  {
    id: 'ww-19',
    text: { en: 'My secret wish that nobody knows…', ro: 'Meri wo secret wish jo kisi ko nahi pata…' },
    options: [
      { id: 'a', label: { en: 'Become famous', ro: 'Famous hona' }, emoji: '🌟' },
      { id: 'b', label: { en: 'Open a café', ro: 'Apna café kholna' }, emoji: '☕' },
      { id: 'c', label: { en: 'Travel the world', ro: 'Duniya ghoomna' }, emoji: '🌍' },
      { id: 'd', label: { en: 'Marry my crush', ro: 'Apne crush se shaadi' }, emoji: '💍' },
    ],
  },
  {
    id: 'ww-20',
    text: { en: 'The real reason my friends keep me around is…', ro: 'Asal wajah jis ki bina par dost mujhe saath rakhte hain…' },
    options: [
      { id: 'a', label: { en: 'I am hilarious', ro: 'Main bohat funny hoon' }, emoji: '😂' },
      { id: 'b', label: { en: 'I always pay for chai', ro: 'Main hamesha chai pilata hoon' }, emoji: '☕' },
      { id: 'c', label: { en: 'I give great advice', ro: 'Main acha mashwara deta hoon' }, emoji: '💡' },
      { id: 'd', label: { en: 'They cannot get rid of me', ro: 'Wo mujh se jaan nahi chhura sakte' }, emoji: '🙃' },
    ],
  },
];

export const wellWisher: QuizConfig = {
  id: 'well-wisher',
  kind: 'viral',
  category: 'fun',
  title: { en: 'Secret Well-Wisher', ro: 'Secret Well-Wisher' },
  tagline: {
    en: 'Who secretly admires you? Make the quiz, share it, find out.',
    ro: 'Kon chhup ke tumhein admire karta hai? Quiz banao, share karo, pata lagao.',
  },
  howItWorks: {
    en: 'Answer fun questions about yourself, share the link, and see which friend matches your vibe best.',
    ro: 'Apne baare mein mazedaar sawalon ke jawab do, link share karo, aur dekho kaunsa dost tumhari vibe se sab se zyada match karta hai.',
  },
  emoji: '💌',
  gradient: 'from-pink-500 via-rose-400 to-orange-300',
  glow: '#f43f5e',
  questions: [],
  bank,
  questionCounts: [5, 10, 15],
  capture: ['age', 'city'],
};
