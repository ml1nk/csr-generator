var $ = require("jquery");

module.exports = function(form) {
  var obj = {};
  $("input, select",form).each(function( index ) {
    var self = $(this);
    var name = self.prop("name");
    if(name !== "") {
      obj[self.prop("name")] = self.val();
    }
  });
  return obj;
};
