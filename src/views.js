const $ = require('jquery');
const url = new (require('url-search-params'))(window.location.search);

const main = $('#main');
const back = $('#back');
const title = $('#title');

let currentView = false;

let html = _requireAllHtml();
let views = _requireAllViews();


back.click(() => {
  window.history.back();
});

addEventListener('popstate', (event) => {
  console.log('popstate', event);
  if (typeof event.state === 'string'
  && event.state.length>0
  && currentView !== event.state) {
    load(event.state);
  }
});

console.log('test', history.state);

function load(view, data) {
  main.html(html[view]);
  views[view].load(load, main, data, overwriteBack);
  title.text(views[view].title);
  if (views[view].stateless) {
    url.set('v', view);
    history[
      currentView ? 'pushState' : 'replaceState'
      ](view, '', '?' + url.toString());
  }
  currentView = view;
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

load(views.hasOwnProperty(url.get('v')) ? url.get('v') : 'overview');

module.exports = load;


function _requireAllHtml() {
  let result = {};
  let req = require.context('./html', true, /^\.\/.*\.html$/);
  req.keys().forEach((key) => {
    result[key.substring(2, key.length-5)] = req(key);
  });
  return result;
}

function _requireAllViews() {
  let result = {};
  let req = require.context('./views', true, /^\.\/.*\.js$/);
  req.keys().forEach((key) => {
    result[key.substring(2, key.length-3)] = req(key);
  });
  return result;
}
