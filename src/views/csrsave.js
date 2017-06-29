const $ = require('jquery');
const download = require('./../lib/download.js');
const views = require('./../views.js');

exports.load = (main, data) => {
    if (!data) {
        history.back();
        return;
    }
    exports.title = data.title;
    views.confirm(
        'Downloadbereich verlassen',
        'Haben Sie den CSR gespeichert?',
    );
    let time = Math.floor(new Date().getTime() / 1000);
    $('#downloadCSR').click(() => {
        download(
            time + '_' + data.type + '.csr',
            'application/x-pem-file;charset=utf-8',
            data.csr);
    });
    $('#showCSR').val(data.csr);
};
