var $ = require("jquery");
var api = require("csr-helper");
var highlight = require("./../lib/syntaxHighlight.js");
var filedata = require("./../lib/filedata.js");

module.exports = function(views, main, data) {
    var filefield = $("#file");
    var pre = $("#pre");

    filefield.fileinput({language : "de"});

    filefield.on('fileclear', function(event) {
        pre.hide();
    });

    filedata(filefield[0], function(file) {
        if (!file.hasFile()) {
            pre.hide();
        } else {
            file.getData(function(success, data) {
                if (!success) {
                    pre.hide();
                }
                if(!display(data, pre)) {
                  filefield.fileinput('clear');
                }
            });
        }
    });
};


function display(data, pre) {
    var csr = api.import.csr(data);

    if (csr === false) {
        pre.hide();
        $.toast({
            heading: 'Error',
            text: 'Die angegebene Datei enthält keinen CSR.',
            showHideTransition: 'fade',
            icon: 'error',
            position : 'top-right',
            hideAfter : 10000
        });
        return false;
    }

    pre.html(highlight(api.display.csr(csr)));
    pre.show();
    return true;
}
