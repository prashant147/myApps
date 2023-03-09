import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import en from './en.json';
import fr from './fr.json';
import ch from './ch.json';
import jp from './jp.json';
import si from './si.json';
import sp from './sp.json';

i18n.use(initReactI18next).init({
    compatibilityJSON: 'v3',
    lng: 'en',
    fallbackLng: 'en',
    resources: {
        en: en,
        fr: fr,
        ch: ch,
        jp: jp,
        si: si,
        sp: sp
    },
    interpolation: {
        escapeValue: false // react already safes from xss
    },
    react: {
        useSuspense:false,
    }
});
export default i18n;