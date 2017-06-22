require("./src/thirdparty/webcrypto-shim.js");

window.$ = window.jquery = window.jQuery = require("jquery");
require("./node_modules/bootstrap/dist/css/bootstrap.min.css");
require("./node_modules/bootstrap-fileinput/css/fileinput.min.css");
require("./node_modules/jquery-toast-plugin/dist/jquery.toast.min.css");
require("./node_modules/jquery-confirm/dist/jquery-confirm.min.css");

require("./src/css/index.css");

require("bootstrap");
require("bootstrap-fileinput");
require("./node_modules/bootstrap-fileinput/js/locales/de.js");
require("bootstrap-validator");

require("jquery-toast-plugin");
require("./node_modules/jquery-confirm/dist/jquery-confirm.min.js");
require("./node_modules/pwstrength-bootstrap/dist/pwstrength-bootstrap.min.js");

require("./src/views.js");
