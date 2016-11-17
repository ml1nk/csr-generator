var $ = require("jquery");
var filedata = require("./../lib/filedata.js");
var api = require("csr-helper");

module.exports = function(views, main, data, overwriteBack) {
  var privateKey = $("#privateKey");
  var p7 = $("#p7");

  privateKey.fileinput({language : "de"});
  p7.fileinput({language : "de"});
  var privateKeyFile = filedata(privateKey[0]);
  var p7File = filedata(p7[0]);

  $("#form").validator().on('submit', function(e) {
      if (e.isDefaultPrevented()) {
          // handle the invalid form...
      } else {
        submit(privateKeyFile,p7File,$("#password").val());
      }
      return false;
  });
};

function submit(privateKeyFile, p7File, password) {
  var privateKeyData = false;
  var p7Data = false;
  privateKeyFile.getData(function(success, privateKey) {
      if (!success) {
          privateKey.fileinput('clear');
          $.toast({
              heading: 'Error',
              text: 'Es ist ein Fehler beim Auslesen des Privaten Schlüssels aufgetreten.',
              showHideTransition: 'fade',
              icon: 'error',
              position: 'top-right',
              hideAfter: 10000
          });
          return;
      }
      privateKeyData = privateKey;
      if(p7Data!==false) {
        finish();
      }
  });
  p7File.getData(function(success, p7) {
      if (!success) {
          privateKey.fileinput('clear');
          $.toast({
              heading: 'Error',
              text: 'Es ist ein Fehler beim Auslesen der PKCS#7 Datei aufgetreten.',
              showHideTransition: 'fade',
              icon: 'error',
              position: 'top-right',
              hideAfter: 10000
          });
          return;
      }
      p7Data = p7;
      if(privateKeyData!==false) {
        finish();
      }
  });

  function finish() {
    var data = api.load(privateKeyData, password);
    if (data === false) {
        $.toast({
            heading: 'Error',
            text: 'Die angegebene Datei ist kein Privater Schlüssel oder das eingetragene Schlüsselpasswort ist ungültig.',
            showHideTransition: 'fade',
            icon: 'error',
            position: 'top-right',
            hideAfter: 10000
        });
        return false;
    }
    var p12 = data.p12(p7Data,"test");
    if (p12 === false) {
        $.toast({
            heading: 'Error',
            text: 'Die angegebene Datei enthält keinen gültigen PKCS#7.',
            showHideTransition: 'fade',
            icon: 'error',
            position: 'top-right',
            hideAfter: 10000
        });
        return false;
    }
    if (p12 === true) {
        $.toast({
            heading: 'Error',
            text: 'Das Erzeugen der P12 ist fehlgeschlagen. Stimmt der private Schlüssel zur PKCS#7?',
            showHideTransition: 'fade',
            icon: 'error',
            position: 'top-right',
            hideAfter: 10000
        });
        return false;
    }
    console.log(p12);
  }
}
