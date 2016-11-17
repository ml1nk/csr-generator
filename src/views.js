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
  keygen : {
    html : require("./views/keygen.html"),
    js : require("./views/keygen.js")
  },
  csroverview : {
    html : require("./views/csroverview.html"),
    js : require("./views/csroverview.js")
  },
  csr_ServerPassStandard : {
    html : require("./views/csr/ServerPassStandard.html"),
    js : require("./views/csr/ServerPassStandard.js")
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

  views[view].js(load, main, data);
}

module.exports = load;
