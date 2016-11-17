var $ = require("jquery");
var api = require("csr-helper");
var pw = require("./../lib/pwstrength.js");

module.exports = function(views, main, data) {
    var password = $("#password");
    pw(password);

    $("#start").click(function() {
        var wait = $("#keygenWait");
        $("#keygenForm").hide();
        wait.show();

        var keylength = $("#keylength").val();
        var password = $("#password").val();

        api.gen(keylength).then(function(data) {
            wait.hide();
            $("#keygenDownload").show();

            overwriteBack(views);

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
        return false;
    });
};

function overwriteBack(views) {
    var back = $("#back");
    back.off("click");
    back.click(function() {
        $.confirm({
            title: 'Downloadbereich verlassen',
            content: 'Haben Sie das Schlüsselpaar gespeichert?',
            buttons: {
                confirm: {
                    text: 'Ja',
                    action: function() {
                        views("overview");
                    }
                },
                cancel: {
                    text: 'Nein',
                }
            }
        });
    });
}
