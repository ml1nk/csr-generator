var main = window.document.getElementById("main");
var $ = require("jquery");

var views = {
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

function load (view, data) {
  main.innerHTML = views[view].html;

  $("#back").click(function() {
    load("overview");
  });

  views[view].js(load, main, data, overwriteBack);
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

module.exports = load;
