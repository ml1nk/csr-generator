const $ = require('jquery');
const api = require('csr-helper');
const highlight = require('./../lib/syntaxHighlight.js');
const filedata = require('./../lib/filedata.js');
const i18next = require('i18next').default;

exports.title = i18next.t('csrshow.title');
exports.load = (main, data) => {
  const filefield = $('#file');
  const pre = $('#pre');

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
  const csr = api.import.csr(data);

  if (csr === false) {
    pre.hide();
    $.toast({
      heading: i18next.t('fileheading'),
      text: i18next.t('fileheading'),
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
