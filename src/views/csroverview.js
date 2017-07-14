const $ = require('jquery');
const views = require('./../views.js');
const t = require('i18next').t;

exports.title = t('csroverview.title');
exports.load = (main, data) => {
  $('#ServerPass').click(() => {
    views.load('csr.serverpass');
  });

  $('#Email').click(() => {
    views.load('csr.email');
  });
};
