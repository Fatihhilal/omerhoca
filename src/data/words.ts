export interface WordData {
  id: string;
  oldWord: string;
  modernMeaning: string;
  definition: string;
  letters: string[];
}

export const words: WordData[] = [
  {
    id: '1',
    oldWord: 'GÖKÇE',
    modernMeaning: 'Güzel, hoş, sevimli',
    definition: 'Eski Türkçede "mavi" anlamına da gelen, göze hoş görünen.',
    letters: ['G', 'Ö', 'K', 'Ç', 'E'],
  },
  {
    id: '2',
    oldWord: 'ESEN',
    modernMeaning: 'Sağlıklı, salim',
    definition: 'Ruhsal ve bedensel olarak sağlıklı olma durumu.',
    letters: ['E', 'S', 'E', 'N'],
  },
  {
    id: '3',
    oldWord: 'BİLGE',
    modernMeaning: 'Alim, bilgili',
    definition: 'Bilgili, iyi ahlaklı, olgun ve örnek kimse.',
    letters: ['B', 'İ', 'L', 'G', 'E'],
  },
  {
    id: '4',
    oldWord: 'TAN',
    modernMeaning: 'Şafak vakti',
    definition: 'Güneş doğmadan önceki alaca karanlık.',
    letters: ['T', 'A', 'N'],
  },
  {
    id: '5',
    oldWord: 'US',
    modernMeaning: 'Akıl',
    definition: 'İnsanın düşünme yetisi, anlayış.',
    letters: ['U', 'S'],
  },
  {
    id: '6',
    oldWord: 'GÜZ',
    modernMeaning: 'Sonbahar',
    definition: 'Yaz ile kış arasındaki mevsim.',
    letters: ['G', 'Ü', 'Z'],
  },
  {
    id: '7',
    oldWord: 'YAZGI',
    modernMeaning: 'Kader',
    definition: 'Tanrı\'nın uygun gördüğü durum, alın yazısı.',
    letters: ['Y', 'A', 'Z', 'G', 'I'],
  },
  {
    id: '8',
    oldWord: 'KONUK',
    modernMeaning: 'Misafir',
    definition: 'Bir yere veya birinin evine kısa bir süre için gelen kimse.',
    letters: ['K', 'O', 'N', 'U', 'K'],
  },
  {
    id: '9',
    oldWord: 'BETİK',
    modernMeaning: 'Kitap, mektup',
    definition: 'Yazılı olan şey, kitap veya mektup.',
    letters: ['B', 'E', 'T', 'İ', 'K'],
  },
  {
    id: '10',
    oldWord: 'DÖNENCE',
    modernMeaning: 'Mevsim',
    definition: 'Yılın, iklim şartları bakımından farklılık gösteren dört bölümünden her biri.',
    letters: ['D', 'Ö', 'N', 'E', 'N', 'C', 'E'],
  }
];
