const $ = require('jquery');

module.exports = function(form) {
  let obj = {};
  $('input, select', form).each(( index, self ) => {
    self = $(self);
    let name = self.prop('name');
    if (name !== '') {
      obj[name] = self.val();
    }
  });
  return obj;
};
