var $ = require("jquery");
var filedata = require("./../../lib/filedata.js");
var formobject = require("./../../lib/formobject.js");
var api = require("csr-helper");


module.exports = function(views, main, data) {
    var privateKey = $("#privateKey");
    var form = $('#form');

    privateKey.fileinput({
        language: "de"
    });

    var file = filedata(privateKey[0]);

    form.validator({
        custom: {
            domain: function($el) {
              return !/^(\*\.)?([\w-]+\.)+[\w-]+$/.test($el.val());
            }
        }
    }).on('submit', function (e) {
      if (e.isDefaultPrevented()) {
        // handle the invalid form...
      } else {
        file.getData(function(success, privateKey){
          if(!success) {
            privateKey.fileinput('clear');
            $.toast({
                heading: 'Error',
                text: 'Es ist ein Fehler beim Auslesen des Privaten Schlüssels aufgetreten.',
                showHideTransition: 'fade',
                icon: 'error',
                position : 'top-right'
            });
            return;
          }
          submit(privateKey, formobject(form), views);
        });
        return false;
      }
    });
};

function submit(privateKey, form, views) {
  var data = api.load(privateKey,form.password);
  delete form.password;
  if(data===false) {
    $.toast({
        heading: 'Error',
        text: 'Die angegebene Datei ist kein Privater Schlüssel oder das eingetragene Passwort ist ungültig.',
        showHideTransition: 'fade',
        icon: 'error',
        position : 'top-right'
    });
    return false;
  }
  views("csrsave",{
    title : "TeleSec ServerPass Standard + Wildcard",
    type : "ServerPassStandard",
    csr : data.csr.ServerPassStandard(form)
  });
}
