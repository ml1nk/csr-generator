module.exports = function(el) {
  var verdictLevel = 0;
  el.pwstrength({
    i18n : {
        t: function (key) {
          return translate(key);
        }
    },
    ui: {
      showVerdictsInsideProgressBar: true
    },
    rules : {
        activated: {
            wordTwoCharacterClasses: true,
            wordRepetitions: true
        }
    },
    common : {
      onKeyUp: function (evt, data) {
        verdictLevel=data.verdictLevel;
      }
    }
  });
  return function() {
    return verdictLevel;
  };
};

var de = {
    "wordLength": "Das Passwort ist zu kurz",
    "wordNotEmail": "Das Passwort darf die E-Mail Adresse nicht enthalten",
    "wordSimilarToUsername": "Das Passwort darf den Benutzernamen nicht enthalten",
    "wordTwoCharacterClasses": "Bitte Buchstaben und Ziffern verwenden",
    "wordRepetitions": "Zu viele Wiederholungen",
    "wordSequences": "Das Passwort enthält Buchstabensequenzen",
    "errorList": "Fehler:",
    "veryWeak": "Sehr schwach",
    "weak": "Schwach",
    "normal": "Normal",
    "medium": "Mittel",
    "strong": "Stark",
    "veryStrong": "Sehr stark"
};

function translate (key) {
 return de.hasOwnProperty(key) ? de[key] : key;
}
