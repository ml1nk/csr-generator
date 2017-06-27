const $ = require('jquery');

exports.title = 'Einsatzort des CSR';
exports.stateless = true;
exports.load = (views, main, data) => {
  $('#ServerPass').click(() => {
    views('csr_ServerPass');
  });

  $('#Email').click(() => {
    views('csr_Email');
  });
};
