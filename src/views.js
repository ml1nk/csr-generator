const $ = require('jquery');
const main = window.document.getElementById('main');

let views = {
  overview: {
    html: require('./views/overview.html'),
    js: require('./views/overview.js'),
  },
  csrshow: {
    html: require('./views/csrshow.html'),
    js: require('./views/csrshow.js'),
  },
  p12create: {
    html: require('./views/p12create.html'),
    js: require('./views/p12create.js'),
  },
  keygen: {
    html: require('./views/keygen.html'),
    js: require('./views/keygen.js'),
  },
  bulkwork: {
    html: require('./views/bulkwork.html'),
    js: require('./views/bulkwork.js'),
  },
  csroverview: {
    html: require('./views/csroverview.html'),
    js: require('./views/csroverview.js'),
  },
  csr_serverpass: {
    html: require('./views/csr/serverPass.html'),
    js: require('./views/csr/serverPass.js'),
  },
  csr_email: {
    html: require('./views/csr/email.html'),
    js: require('./views/csr/email.js'),
  },
  csrsave: {
    html: require('./views/csrsave.html'),
    js: require('./views/csrsave.js'),
  },
};

$('#back').click(() => {
  load('overview');
});

function load(view, data) {
  main.innerHTML = views[view].html;
  views[view].js(load, main, data, overwriteBack);
}

function overwriteBack(title, content, dest) {
    let back = $('#back');
    back.off('click');
    back.click(function() {
        $.confirm({
            title: title,
            content: content,
            buttons: {
                confirm: {
                    text: 'Ja',
                    action: function() {
                        load(dest);
                    },
                },
                cancel: {
                    text: 'Nein',
                },
            },
        });
    });
}

module.exports = load;
