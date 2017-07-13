const i18next = require('i18next');
const plugin = require('jquery-i18next');
const $ = require('jquery');
const lang = require('./lang/de.json');

i18next.init({
  lng: 'de',
  resources: {
    de: {
        translation: lang,
    },
  },
});

plugin.init(i18next, $);


document.title = i18next.t('title');
