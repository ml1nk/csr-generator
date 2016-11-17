var $ = require("jquery");

module.exports = function(views, main, data) {

  $("#csrshow").click(function() {
    views("csrshow");
  });

  $("#csroverview").click(function() {
    views("csroverview");
  });

  $("#keygen").click(function() {
    views("keygen");
  });

  $("#p12create").click(function() {
    views("p12create");
  });
};
