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
        submit(privateKeyFile,p7File,$("#password").val(),$("#friendlyName").val(),overwriteBack);
      }
      return false;
  });
};

function submit(privateKeyFile, p7File, password, friendlyName, overwriteBack) {
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
    var keypair = api.import.keypair(privateKeyData, password);
    if (keypair === false) {
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
    var p7 = api.import.p7(p7Data,"test");
    if (p7 === false) {
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
    var p12 = api.create.p12(keypair.privateKey,p7,friendlyName);
    if (p12 === false) {
        $.toast({
            heading: 'Error',
            text: 'Das Erzeugen der P12 ist fehlgeschlagen. Passt der private Schlüssel zur PKCS#7?',
            showHideTransition: 'fade',
            icon: 'error',
            position: 'top-right',
            hideAfter: 10000
        });
        return false;
    }

    overwriteBack("Downloadbereich verlassen","Ist die P12 Datei gesichert?","overview");

    var time = Math.floor(new Date().getTime() / 1000);

    $("#p12Download").show();
    $("#p12Create").hide();

    $("#downloadP12").click(function() {
        window.saveAs(new window.Blob([api.export.p12(p12)], {
            type: "application/x-pkcs12;base64"
        }), time + ".p12");
    });
  }
}