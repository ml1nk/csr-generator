const $ = require('jquery');
const filedata = require('./../lib/filedata.js');
const api = require('csr-helper');
const download = require('../lib/download.js');
const views = require('./../views.js');
const i18next = require('i18next').default;

exports.title = i18next.t('p12create.title');
exports.load = (main, data) => {
  const privateKey = $('#privateKey');
  const p7 = $('#p7');

  privateKey.fileinput({language: 'de'});
  p7.fileinput({language: 'de'});
  const privateKeyFile = filedata(privateKey[0]);
  const p7File = filedata(p7[0]);

  $('#form').validator().on('submit', function(e) {
    if (e.isDefaultPrevented()) {
      // handle the invalid form...
    } else {
      submit(
          privateKeyFile,
          p7File,
          $('#password').val(),
          $('#friendlyName').val(),
      );
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
        heading: i18next.t('p12create.privatekeyloadheading'),
        text: i18next.t('p12create.privatekeyloadtext'),
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
        heading: i18next.t('p12create.pkcs7loadheading'),
        text: i18next.t('p12create.pkcs7loadtext'),
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
    const keypair = api.import.keypair(privateKeyData, password);
    if (keypair === false) {
      $.toast({
        heading: i18next.t('p12create.privatekeyheading'),
        text: i18next.t('p12create.privatekeytext'),
        showHideTransition: 'fade',
        icon: 'error',
        position: 'top-right',
        hideAfter: 10000,
      });
      return false;
    }

    const p7 = api.import.p7(p7Data, 'test');
    if (p7 === false) {
      $.toast({
        heading: i18next.t('p12create.pkcs7heading'),
        text: i18next.t('p12create.pkcs7text'),
        showHideTransition: 'fade',
        icon: 'error',
        position: 'top-right',
        hideAfter: 10000,
      });
      return false;
    }

    const p12 = api.create.p12(keypair.privateKey, p7, friendlyName);
    if (p12 === false) {
      $.toast({
        heading: i18next.t('p12create.combiheading'),
        text: i18next.t('p12create.combitext'),
        showHideTransition: 'fade',
        icon: 'error',
        position: 'top-right',
        hideAfter: 10000,
      });
      return false;
    }

    views.confirm(
        i18next.t('p12create.confirmheading'),
        i18next.t('p12create.confirmtext'),
    );

    const time = Math.floor(new Date().getTime() / 1000);

    $('#p12Download').show();
    $('#p12Create').hide();

    $('#downloadP12').click(() => {
      download(
          time + '.p12',
          'application/x-pkcs12',
          api.export.p12(p12),
          false,
      );
    });
  }
}
