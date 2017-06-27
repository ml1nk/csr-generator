const $ = require('jquery');
const views = require('./../views.js');

exports.title = 'Einsatzort des CSR';
exports.load = (main, data) => {
  $('#ServerPass').click(() => {
    views.load('csr.serverpass');
  });

  $('#Email').click(() => {
    views.load('csr.email');
  });
};
