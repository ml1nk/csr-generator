const $ = require('jquery');
const api = require('csr-helper');
const compareVersions = require('compare-versions');
const views = require('./../views.js');
const t = require('i18next').t;

exports.title = t('overview.title');
exports.load = (main, data) => {
    $('#csrshow').click(() => {
        views.load('csrshow');
    });

    $('#csroverview').click(() => {
        views.load('csroverview');
    });

    if (!api.hasNativeCrypto()) {
        $('#cryptoWarning').show();
        $('#keygen').addClass('disabled');
    } else {
        $('#keygen').click(() => {
            views.load('keygen');
        });
    }

    $('#bulkwork').click(() => {
        views.load('bulkwork');
    });

    $('#p12create').click(() => {
        views.load('p12create');
    });

    let updates = $('#updates');
    updates.click(() => {
      updates.prop('disabled', true);
      checkUpdates(() => {
        updates.prop('disabled', false);
      });
    });
};

function checkUpdates(callback) {
    $.getJSON('https://api.github.com/repos/ml1nk/csr-generator/releases/latest', {_: new Date().getTime()}).done((data) => {
        if (compareVersions(data.name, VERSION) < 1) {
            $.alert({
                title: t('overview.updatescurtitle'),
                content: t('overview.updatescurcontent'),
                type: 'green',
            });
        } else {
            $.alert({
                title: t('overview.updatesoldtitle'),
                content: t(
                    'overview.updatesoldcontent',
                    {version: data.name.replace(/[^0-9.]/g, '')}
                ),
                type: 'orange',
            });
        }
    }).fail(() => {
        $.alert({
          title: t('overview.updateserrtitle'),
          content: t('overview.updateserrcontent'),
          type: 'red',
        });
    }).always(() => {
      callback();
    });
}
