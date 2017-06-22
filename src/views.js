const main = window.document.getElementById("main");
const $ = require("jquery");
const URLSearchParams = require('url-search-params');

const views = {
  overview : {
    html : require("./views/overview.html"),
    js : require("./views/overview.js")
  },
  csrshow : {
    html : require("./views/csrshow.html"),
    js : require("./views/csrshow.js")
  },
  p12create : {
    html : require("./views/p12create.html"),
    js : require("./views/p12create.js")
  },
  keygen : {
    html : require("./views/keygen.html"),
    js : require("./views/keygen.js")
  },
  bulkwork : {
    html : require("./views/bulkwork.html"),
    js : require("./views/bulkwork.js")
  },
  csroverview : {
    html : require("./views/csroverview.html"),
    js : require("./views/csroverview.js")
  },
  csr_ServerPass : {
    html : require("./views/csr/ServerPass.html"),
    js : require("./views/csr/ServerPass.js")
  },
  csr_Email : {
    html : require("./views/csr/Email.html"),
    js : require("./views/csr/Email.js")
  },
  csrsave : {
    html : require("./views/csrsave.html"),
    js : require("./views/csrsave.js")
  }
};

const viewsStateless = [
  "overview",
  "csrshow",
  "p12create",
  "keygen",
  "bulkwork",
  "csroverview",
  "csr_ServerPass",
  "csr_Email"
];

const url = new URLSearchParams(window.location.search);

$("#back").click(() => {
  load("overview");
});

function load (view, data) {
  main.innerHTML = views[view].html;
  views[view].js(load, main, data, overwriteBack);
  if(viewsStateless.indexOf(view)>-1) {
    url.set("v",view);
    history.pushState({}, "", "?" + url.toString());
  }
}

function overwriteBack(title, content, dest) {
    var back = $("#back");
    back.off("click");
    back.click(function() {
        $.confirm({
            title: title,
            content: content,
            buttons: {
                confirm: {
                    text: 'Ja',
                    action: function() {
                        load(dest);
                    }
                },
                cancel: {
                    text: 'Nein',
                }
            }
        });
    });
}

load(viewsStateless.indexOf(url.get("v"))>-1 ? url.get("v") : "overview");

module.exports = load;
