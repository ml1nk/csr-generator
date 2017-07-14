const $ = require('jquery');
const api = require('csr-helper');
const pw = require('./../lib/pwstrength.js');
const download = require('./../lib/download.js');
const views = require('./../views.js');
const t = require('i18next').t;

exports.title = t('keygen.title');
exports.load = (main, data) => {
    let password = $('#password');
    let verdictLevel = pw(password);

    $('#form').validator().on('submit', function(e) {
        if (e.isDefaultPrevented()) {
            // handle the invalid form...
        } else {
          if (verdictLevel()<3) {
            $.confirm({
                title: t('keygen.weaktitle'),
                content: t('keygen.weakcontent'),
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
  let wait = $('#keygenWait');
  $('#keygenForm').hide();
  wait.show();

  let keylength = $('#keylength').val();
  password = password.val();

  api.create.keypair(keylength).then((keypair) => {
      wait.hide();
      $('#keygenDownload').show();

      views.confirm(t('keygen.confirmtitle'), t('keygen.confirmtext'));

      let time = Math.floor(new Date().getTime() / 1000);

      $('#downloadPrivateKey').click(() => {
          download(
              time + '_' + keylength + '.pem',
              'application/x-pem-file;charset=utf-8',
              api.export.keypair.privateKey(keypair.privateKey, password));
      });

      $('#downloadPublicKey').click(() => {
          download(
              time + '_' + keylength + '.pub',
              'application/x-pem-file;charset=utf-8',
              api.export.keypair.publicKey(keypair.publicKey)
            );
      });
  });
}
