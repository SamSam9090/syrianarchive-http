import translations from './translations.json';

const t = (s, l) => {
  try {
    return translations[l][s];
  } catch (e) {
    return s;
  }
};
export default t;
