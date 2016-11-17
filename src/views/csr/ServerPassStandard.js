var $ = require("jquery");

module.exports = function(views, main, data) {
    privateKey = $("#privateKey");

    privateKey.fileinput({
        language: "de"
    });

    $('#form').validator({
        custom: {
            domain: function($el) {
              return !/^(\*\.)?([\w-]+\.)+[\w-]+$/.test($el.val());
            }
        }
    });

    //  $("#submit").click(function() {
    //    console.log("test");
    //    return false;
    //  });
};
