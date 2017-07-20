const $ = require('jquery');
const download = require('./../lib/download.js');
const views = require('./../views.js');
const t = require('i18next').t;

exports.load = (main, data) => {
    if (!data) {
        history.back();
        return;
    }
    exports.title = data.title;
    views.confirm(
        t('confirmtitle'),
        t('confirmcontent')
    );
    let time = Math.floor(new Date().getTime() / 1000);
    $('#downloadCSR').click(() => {
        download(
            time + '_' + data.type + '.csr',
            'application/x-pem-file',
            data.csr
        );
    });
    $('#showCSR').val(data.csr);
};
