var $ = require("jquery");
var api = require("csr-helper");
var pw = require("./../lib/pwstrength.js");

module.exports = function(views, main, data, overwriteBack) {
    var password = $("#password");
    var score = pw(password);

    $("#form").validator().on('submit', function(e) {
        if (e.isDefaultPrevented()) {
            // handle the invalid form...
        } else {
          if(score()<50) {
            $.confirm({
                title: 'Schlüsselpasswort',
                content: 'Sie haben nur ein schwaches Schlüsselpasswort gewählt, wollen Sie wirklich fortsetzen?',
                buttons: {
                    confirm: {
                        text: 'Ja',
                        action: function() {
                          submit(overwriteBack,password);
                        }
                    },
                    cancel: {
                        text: 'Nein',
                    }
                }
            });
          } else {
            submit(overwriteBack,password);
          }
          return false;
        }
    });
};

function submit(overwriteBack,password) {
  var wait = $("#keygenWait");
  $("#keygenForm").hide();
  wait.show();

  var keylength = $("#keylength").val();
  password = password.val();

  api.gen(keylength).then(function(data) {
      wait.hide();
      $("#keygenDownload").show();

      overwriteBack("Downloadbereich verlassen","Ist Ihr neues Schlüsselpaar wirklich gesichert?","overview");

      var time = Math.floor(new Date().getTime() / 1000);

      $("#downloadPrivateKey").click(function() {
          window.saveAs(new window.Blob([data.save.privateKey(password)], {
              type: "application/x-pem-file;charset=utf-8"
          }), time + "_" + keylength + ".pem");
      });

      $("#downloadPublicKey").click(function() {
          window.saveAs(new window.Blob([data.save.publicKey()], {
              type: "application/x-pem-file;charset=utf-8"
          }), time + "_" + keylength + ".pub");
      });

  });
}
