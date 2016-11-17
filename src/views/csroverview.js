var $ = require("jquery");

module.exports = function(views, main, data) {

  $("#ServerPassStandard").click(function() {
    views("csr_ServerPassStandard");
  });

};
