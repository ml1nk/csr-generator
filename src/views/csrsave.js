var $ = require("jquery");

module.exports = function(views, main, data, overwriteBack) {
    $("#title").text(data.title);
    overwriteBack("Downloadbereich verlassen","Haben Sie den CSR gespeichert?","overview");

    var time = Math.floor(new Date().getTime() / 1000);
    $("#downloadCSR").click(function() {
        window.saveAs(new window.Blob([data.csr], {
            type: "application/x-pem-file;charset=utf-8"
        }), time + "_" + data.type + ".csr");
    });
    $("#showCSR").html(data.csr.replace(new RegExp('\r?\n','g'), '<br />'));
};
