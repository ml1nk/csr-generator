const $ = require('jquery');
const api = require('csr-helper');
const pw = require('./../lib/pwstrength.js');
const download = require('../lib/download.js');

module.exports = function(views, main, data, overwriteBack) {
    let password = $('#password');
    let verdictLevel = pw(password);

    $('#form').validator().on('submit', function(e) {
        if (e.isDefaultPrevented()) {
            // handle the invalid form...
        } else {
          if (verdictLevel()<3) {
            $.confirm({
                title: 'Schlüsselpasswort',
                content: 'Sie haben nur ein schwaches Schlüsselpasswort gewählt, wollen Sie wirklich fortsetzen?',
                buttons: {
                    confirm: {
                        text: 'Ja',
                        action: function() {
                          submit(overwriteBack, password);
                        },
                    },
                    cancel: {
                        text: 'Nein',
                    },
                },
            });
          } else {
            submit(overwriteBack, password);
          }
          return false;
        }
    });
};

function submit(overwriteBack, password) {
  let wait = $('#keygenWait');
  $('#keygenForm').hide();
  wait.show();

  let keylength = $('#keylength').val();
  password = password.val();

  api.create.keypair(keylength).then(function(keypair) {
      wait.hide();
      $('#keygenDownload').show();

      overwriteBack('Downloadbereich verlassen', 'Ist Ihr neues Schlüsselpaar wirklich gesichert?', 'overview');

      let time = Math.floor(new Date().getTime() / 1000);

      $('#downloadPrivateKey').click(function() {
          download(
              time + '_' + keylength + '.pem',
              'application/x-pem-file;charset=utf-8',
              api.export.keypair.privateKey(keypair.privateKey, password));
      });

      $('#downloadPublicKey').click(function() {
          download(time + '_' + keylength + '.pub', 'application/x-pem-file;charset=utf-8', api.export.keypair.publicKey(keypair.publicKey));
      });
  });
}
