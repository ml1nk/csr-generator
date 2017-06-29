const $ = require('jquery');
const filedata = require('./../lib/filedata.js');
const api = require('csr-helper');
const download = require('../lib/download.js');
const views = require('./../views.js');

exports.title = 'P12 Erzeugen';
exports.load = (main, data) => {
  let privateKey = $('#privateKey');
  let p7 = $('#p7');

  privateKey.fileinput({language: 'de'});
  p7.fileinput({language: 'de'});
  let privateKeyFile = filedata(privateKey[0]);
  let p7File = filedata(p7[0]);

  $('#form').validator().on('submit', function(e) {
      if (e.isDefaultPrevented()) {
          // handle the invalid form...
      } else {
        submit(privateKeyFile, p7File, $('#password').val(), $('#friendlyName').val());
      }
      return false;
  });
};

function submit(privateKeyFile, p7File, password, friendlyName) {
  let privateKeyData = false;
  let p7Data = false;
  privateKeyFile.getData(function(success, privateKey) {
      if (!success) {
          privateKey.fileinput('clear');
          $.toast({
              heading: 'Error',
              text: 'Es ist ein Fehler beim Auslesen des Privaten Schlüssels aufgetreten.',
              showHideTransition: 'fade',
              icon: 'error',
              position: 'top-right',
              hideAfter: 10000,
          });
          return;
      }
      privateKeyData = privateKey;
      if (p7Data!==false) {
        finish();
      }
  });
  p7File.getData(function(success, p7) {
      if (!success) {
          p7.fileinput('clear');
          $.toast({
              heading: 'Error',
              text: 'Es ist ein Fehler beim Auslesen der PKCS#7 Datei aufgetreten.',
              showHideTransition: 'fade',
              icon: 'error',
              position: 'top-right',
              hideAfter: 10000,
          });
          return;
      }
      p7Data = p7;
      if (privateKeyData!==false) {
        finish();
      }
  });

  function finish() {
    let keypair = api.import.keypair(privateKeyData, password);
    if (keypair === false) {
        $.toast({
            heading: 'Error',
            text: 'Die angegebene Datei ist kein Privater Schlüssel oder das eingetragene Schlüsselpasswort ist ungültig.',
            showHideTransition: 'fade',
            icon: 'error',
            position: 'top-right',
            hideAfter: 10000,
        });
        return false;
    }

    let p7 = api.import.p7(p7Data, 'test');
    if (p7 === false) {
        $.toast({
            heading: 'Error',
            text: 'Die angegebene Datei enthält keinen gültigen PKCS#7.',
            showHideTransition: 'fade',
            icon: 'error',
            position: 'top-right',
            hideAfter: 10000,
        });
        return false;
    }

    let p12 = api.create.p12(keypair.privateKey, p7, friendlyName);
    if (p12 === false) {
        $.toast({
            heading: 'Error',
            text: 'Das Erzeugen der P12 ist fehlgeschlagen. Passt der private Schlüssel zur PKCS#7?',
            showHideTransition: 'fade',
            icon: 'error',
            position: 'top-right',
            hideAfter: 10000,
        });
        return false;
    }

    views.confirm(
        'Downloadbereich verlassen',
        'Ist die P12 Datei gesichert?'
    );

    let time = Math.floor(new Date().getTime() / 1000);

    $('#p12Download').show();
    $('#p12Create').hide();

    $('#downloadP12').click(function() {
      download(
          time + '.p12', 'application/x-pkcs12;base64',
          api.export.p12(p12));
    });
  }
}
