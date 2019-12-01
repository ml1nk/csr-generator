const $ = require('jquery');
const download = require('./../lib/download.js');
const views = require('./../views.js');
const i18next = require('i18next').default;

exports.load = (main, data) => {
  if (!data) {
    history.back();
    return;
  }
  exports.title = data.title;
  views.confirm(
      i18next.t('csrsave.confirmtitle'),
      i18next.t('csrsave.confirmcontent'),
  );
  const time = Math.floor(new Date().getTime() / 1000);
  $('#downloadCSR').click(() => {
    download(
        time + '_' + data.type + '.csr',
        'application/x-pem-file',
        data.csr,
    );
  });
  $('#showCSR').val(data.csr);
};
