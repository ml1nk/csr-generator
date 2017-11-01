require('./src/thirdparty/webcrypto-shim.js');

window.$ = window.jquery = window.jQuery = require('jquery');
require('bootstrap/dist/css/bootstrap.min.css');
require('bootstrap-fileinput/css/fileinput.min.css');
require('jquery-toast-plugin/dist/jquery.toast.min.css');
require('jquery-confirm/dist/jquery-confirm.min.css');

require('./src/css/index.css');

require('bootstrap');
require('bootstrap-fileinput');
require('bootstrap-fileinput/js/locales/de.js');
require('bootstrap-validator');

require('jquery-toast-plugin');
require('jquery-confirm/dist/jquery-confirm.min.js');
require('pwstrength-bootstrap/dist/pwstrength-bootstrap.min.js');

if (!String.prototype.endsWith) {
  String.prototype.endsWith = function(searchString, position) {
      var subjectString = this.toString();
      if (typeof position !== 'number' || !isFinite(position) || Math.floor(position) !== position || position > subjectString.length) {
        position = subjectString.length;
      }
      position -= searchString.length;
      var lastIndex = subjectString.indexOf(searchString, position);
      return lastIndex !== -1 && lastIndex === position;
  };
}

require('./src/lang.js');
require('./src/views.js');
