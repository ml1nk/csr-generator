var $ = require("jquery");
var filedata = require("./../lib/filedata.js");
var formobject = require("./../lib/formobject.js");
var windows1252 = require('windows-1252');
var api = require("csr-helper");

module.exports = function(views, main, data, overwriteBack) {

    var bulkfile = $("#bulkfile");
    bulkfile.fileinput({
        language: "de"
    });

    var file = filedata(bulkfile[0]);

    $("#form").validator().on('submit', function(e) {
        if (e.isDefaultPrevented()) {
            // handle the invalid form...
        } else {
          file.getData(function(success, data) {
              if (!success) {
                  data.fileinput('clear');
                  $.toast({
                      heading: 'Error',
                      text: 'Es ist ein Fehler beim Auslesen der Bulk Datei aufgetreten.',
                      showHideTransition: 'fade',
                      icon: 'error',
                      position: 'top-right',
                      hideAfter: 10000
                  });
                  return;
              }
              submit(windows1252.decode(data), formobject(form), views);
          });
          return false;
        }
    });

    help();
};

function submit(data,form,views) {
  console.log(api.import.bulk(data,form.OU1,form.OU2));
}


function help() {
    $("#bulkfile_help").click(function(e) {
        $.dialog({
            backgroundDismiss: true,
            title: 'Bulk Datei',
            content: 'Text fehlt.',
            columnClass: 'col-md-8 col-md-offset-2 col-xs-8 col-xs-offset-2'
        });
        e.preventDefault();
    });

    $("#OU1_help, #OU2_help").click(function(e) {
        $.dialog({
            backgroundDismiss: true,
            title: 'Untereinheiten',
            content: 'Dieses Feld ist optional und enthält eine Organisation, Einheit (Abteilung, Bereich) bzw. '+
                     'Abteilung/Unterabteilung oder Gruppe, Team. Sollten OU-Felder genutzt werden, so ist darauf zu achten, dass '+
                     'eine Verbindung zur Organisation (O) hergestellt werden kann.<br/>'+
                     'Beispiele: OU1=Einkauf, OU2= Niederlassung Musterstadt',
            columnClass: 'col-md-8 col-md-offset-2 col-xs-8 col-xs-offset-2'
        });
        e.preventDefault();
    });
}
