var $ = require("jquery");

module.exports = function(views, main, data) {

  $("#ServerPass").click(function() {
    views("csr_ServerPass");
  });

};