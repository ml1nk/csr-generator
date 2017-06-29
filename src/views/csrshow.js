const $ = require('jquery');
const api = require('csr-helper');
const highlight = require('./../lib/syntaxHighlight.js');
const filedata = require('./../lib/filedata.js');

exports.title = 'CSR Anzeigen';
exports.load = (main, data) => {
    let filefield = $('#file');
    let pre = $('#pre');

    filefield.fileinput({language: 'de'});

    filefield.on('fileclear', (event) => {
        pre.hide();
    });

    filedata(filefield[0], (file) => {
        if (!file.hasFile()) {
            pre.hide();
        } else {
            file.getData((success, data) => {
                if (!success) {
                    pre.hide();
                }
                if (!display(data, pre)) {
                  filefield.fileinput('clear');
                }
            });
        }
    });
};


function display(data, pre) {
    let csr = api.import.csr(data);

    if (csr === false) {
        pre.hide();
        $.toast({
            heading: 'Error',
            text: 'Die angegebene Datei enthält keinen CSR.',
            showHideTransition: 'fade',
            icon: 'error',
            position: 'top-right',
            hideAfter: 10000,
        });
        return false;
    }

    $('.highlight', pre).html(highlight(api.display.csr(csr)));
    $('.codefield', pre).val(api.export.csr(csr));
    pre.show();
    return true;
}
