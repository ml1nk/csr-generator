const $ = require('jquery');
const api = require('csr-helper');
const compareVersions = require('compare-versions');
const views = require('./../views.js');
const i18next = require('i18next').default;

exports.title = i18next.t('overview.title');
exports.load = (main, data) => {
  $('#csrshow').click(() => {
    views.load('csrshow');
  });

  $('#csremail').click(() => {
    views.load('csr.email');
  });

  $('#csrserverpass').click(() => {
    views.load('csr.serverpass');
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

  const updates = $('#updates');
  if (!views.url.has('apk')) {
    updates.parent().removeClass('hidden');
    updates.click(() => {
      updates.prop('disabled', true);
      checkUpdates(() => {
        updates.prop('disabled', false);
      });
    });
  }
};

function checkUpdates(callback) {
  $.getJSON(
      'https://api.github.com/repos/ml1nk/csr-generator/releases/latest',
      {_: new Date().getTime()})
      .done((data) => {
        if (compareVersions(data.name, VERSION) < 1) {
          $.alert({
            title: i18next.t('overview.updatescurtitle'),
            content: i18next.t('overview.updatescurcontent'),
            type: 'green',
          });
        } else {
          $.alert({
            title: i18next.t('overview.updatesoldtitle'),
            content: i18next.t(
                'overview.updatesoldcontent',
                {version: data.name.replace(/[^0-9.]/g, '')},
            ),
            type: 'orange',
          });
        }
      }).fail(() => {
        $.alert({
          title: i18next.t('overview.updateserrtitle'),
          content: i18next.t('overview.updateserrcontent'),
          type: 'red',
        });
      }).always(() => {
        callback();
      });
}
