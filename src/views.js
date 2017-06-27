const $ = require('jquery');
const moment = require('moment');
const url = new (require('url-search-params'))(window.location.search);

const version = $('#version');
const main = $('#main');
const back = $('#back');
const title = $('#title');

const html = _requireAllHtml();
const views = _requireAllViews();

moment.locale('de');

version.text(
  'Version ' + VERSION + ' vom '
  + moment(VERSION_TIME).format('LLL')
);

_initState();
_refresh();

addEventListener('popstate', (event) => {
  if (typeof event.state === 'object') {
    _refresh();
  }
});

back.click(() => {
  window.history.back();
});

function confirm(title, content) {
    let back = $('#back');
    back.off('click');
    back.click(() => {
        $.confirm({
            title: title,
            content: content,
            buttons: {
                confirm: {
                    text: 'Ja',
                    action: () => {
                          window.history.back();
                          back.off('click');
                          back.click(() => {
                            window.history.back();
                          });
                    },
                },
                cancel: {
                    text: 'Nein',
                },
            },
        });
    });
}

function load(view, data) {
  if (!views.hasOwnProperty(view)) {
    return false;
  }
  url.set('v', view);
  history.pushState({
    view: view,
    num: history.state.num+1,
  }, '', '?' + url.toString());
  _refresh(data);
  return true;
}

function _requireAllHtml() {
  let result = {};
  let req = require.context('./html', true, /^\.\/.*\.html$/);
  req.keys().forEach((key) => {
    result[key.substring(2, key.length-5).replace(/\//g, '.')] = req(key);
  });
  return result;
}

function _requireAllViews() {
  let result = {};
  let req = require.context('./views', true, /^\.\/.*\.js$/);
  req.keys().forEach((key) => {
    result[key.substring(2, key.length-3).replace(/\//g, '.')] = req(key);
  });
  return result;
}

function _refresh(data) {
  main.html(html[history.state.view]);
  views[history.state.view].load(main, data);
  title.text(views[history.state.view].title);
  if (history.state.num===0) {
    version.show();
    back.hide();
  } else {
    version.hide();
    back.show();
  }
}

function _initState() {
  if (!history.state
  || typeof history.state !== 'object'
  || !history.state.hasOwnProperty('view')
  || !history.state.hasOwnProperty('num')) {
    let view = url.get('v').replace(/./g, '/');
    url.set('v', 'overview');
    history.replaceState({view: 'overview', num: 0}, '', '?' + url.toString());
    if (views.hasOwnProperty(view)) {
      url.set('v', view);
      history.pushState({view: view, num: 1}, '', '?' + url.toString());
    }
  }
}

exports.load = load;
exports.confirm = confirm;
