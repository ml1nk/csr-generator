const $ = require('jquery');
const api = require('csr-helper');
const compareVersions = require('compare-versions');
const views = require('./../views.js');

exports.title = 'Funktionsübersicht';
exports.load = (main, data) => {
    $('#csrshow').click(function() {
        views.load('csrshow');
    });

    $('#csroverview').click(function() {
        views.load('csroverview');
    });

    if (!api.hasNativeCrypto()) {
        $('#cryptoWarning').show();
        $('#keygen').addClass('disabled');
    } else {
        $('#keygen').click(function() {
            views.load('keygen');
        });
    }

    $('#bulkwork').click(function() {
        views.load('bulkwork');
    });

    $('#p12create').click(function() {
        views.load('p12create');
    });

    let updates = $('#updates');
    updates.click(function() {
      updates.prop('disabled', true);
      checkUpdates(function() {
        updates.prop('disabled', false);
      });
    });
};

function checkUpdates(callback) {
    $.getJSON('https://rawgit.com/ml1nk/csr-generator/master/package.json', {_: new Date().getTime()}).done(function(data) {
        if (compareVersions(data.version, VERSION) < 1) {
          current();
          // old(VERSION, data.version);
          // error();
        } else {
          old(VERSION, data.version);
        }
    }).fail(function() {
        error();
    }).always(function() {
      callback();
    });

    function current() {
        $.alert({
            title: 'Aktuell',
            content: 'Sie besitzen bereits die aktuelle Version.',
            type: 'green',
        });
    }

    function old(oldVersion, newVersion) {
        $.alert({
            title: 'Veraltet',
            content: 'Die Version '+oldVersion+' ist leider veraltet.<br/>Bitte aktualisieren Sie auf die aktuelle Version '+newVersion+'.<br/><br/><a target="_blank" href="https://github.com/ml1nk/csr-generator/releases">Download Link</a>',
            type: 'orange',
        });
    }

    function error() {
      $.alert({
          title: 'Verbindungsproblem',
          content: 'Die aktuelle Version konnte nicht ermittelt werden.<br/><br/><a target="_blank" href="https://github.com/ml1nk/csr-generator/releases">Download Link</a>',
          type: 'red',
      });
    }
}
