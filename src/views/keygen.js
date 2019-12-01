const $ = require('jquery');
const api = require('csr-helper');
const pw = require('./../lib/pwstrength.js');
const download = require('./../lib/download.js');
const views = require('./../views.js');
const i18next = require('i18next').default;

exports.title = i18next.t('keygen.title');
exports.load = (main, data) => {
  const password = $('#password');
  const verdictLevel = pw(password);

  $('#form').validator().on('submit', function(e) {
    if (e.isDefaultPrevented()) {
      // handle the invalid form...
    } else {
      if (verdictLevel()<3) {
        $.confirm({
          title: i18next.t('keygen.weaktitle'),
          content: i18next.t('keygen.weakcontent'),
          buttons: {
            confirm: {
              text: 'Ja',
              action: () => {
                submit(password);
              },
            },
            cancel: {
              text: 'Nein',
            },
          },
        });
      } else {
        submit(password);
      }
      return false;
    }
  });
};

function submit(password) {
  const wait = $('#keygenWait');
  $('#keygenForm').hide();
  wait.show();

  const keylength = $('#keylength').val();
  password = password.val();

  api.create.keypair(keylength).then((keypair) => {
    wait.hide();
    $('#keygenDownload').show();

    views.confirm(
        i18next.t('keygen.confirmtitle'),
        i18next.t('keygen.confirmtext'),
    );

    const time = Math.floor(new Date().getTime() / 1000);

    $('#downloadPrivateKey').click(() => {
      download(
          time + '_' + keylength + '.pem',
          'application/x-pem-file',
          api.export.keypair.privateKey(keypair.privateKey, password),
      );
    });

    $('#downloadPublicKey').click(() => {
      download(
          time + '_' + keylength + '.pub',
          'application/x-pem-file',
          api.export.keypair.publicKey(keypair.publicKey),
      );
    });
  });
}
