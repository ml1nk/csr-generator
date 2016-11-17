var $ = require("jquery");

module.exports = function(views, main, data) {
    $("#title").text(data.title);
    overwriteBack(views);
    var time = Math.floor(new Date().getTime() / 1000);
    $("#downloadCSR").click(function() {
        window.saveAs(new window.Blob([data.csr], {
            type: "application/x-pem-file;charset=utf-8"
        }), time + "_" + data.type + ".csr");
    });
    $("#showCSR").html(data.csr.replace(new RegExp('\r?\n','g'), '<br />'));
};

function overwriteBack(views) {
    var back = $("#back");
    back.off("click");
    back.click(function() {
        $.confirm({
            title: 'Downloadbereich verlassen',
            content: 'Haben Sie den CSR gespeichert?',
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
