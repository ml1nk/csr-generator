const $ = require('jquery');
const download = require('../lib/download.js');

module.exports = function(views, main, data, overwriteBack) {
    $('#title').text(data.title);
    overwriteBack(
        'Downloadbereich verlassen',
        'Haben Sie den CSR gespeichert?',
        'overview');

    let time = Math.floor(new Date().getTime() / 1000);
    $('#downloadCSR').click(function() {
        download(
            time + '_' + data.type + '.csr',
            'application/x-pem-file;charset=utf-8',
            data.csr);
    });
    $('#showCSR').val(data.csr);
};
