var $ = require("jquery");
var api = require("csr-helper");

module.exports = function(views, main, data) {

  $("#csrshow").click(function() {
    views("csrshow");
  });

  $("#csroverview").click(function() {
    views("csroverview");
  });

  if(!api.hasNativeCrypto()) {
    $("#cryptoWarning").show();
    $("#keygen").addClass("disabled");
  } else {
    $("#keygen").click(function() {
      views("keygen");
    });
  }

  $("#p12create").click(function() {
    views("p12create");
  });
};
