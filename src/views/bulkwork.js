var $ = require("jquery");
var filedata = require("./../lib/filedata.js");
var formobject = require("./../lib/formobject.js");
var windows1252 = require("windows-1252");
var jszip = require("jszip");
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
                  bulkfile.fileinput('clear');
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
              var form = formobject(form);
              var result = api.import.bulk(windows1252.decode(data),form.OU1,form.OU2);
              if(result===false) {
                bulkfile.fileinput('clear');
                $.toast({
                    heading: 'Error',
                    text: 'Die Bulk Datei enthält unvollständige Zeilen, bitte kontrollieren Sie die Anzahl der Spalten in jeder Zeile.',
                    showHideTransition: 'fade',
                    icon: 'error',
                    position: 'top-right',
                    hideAfter: 10000
                });
                return;
              }
              if(typeof result === "string") {
                var error = result.split(":");
                bulkfile.fileinput('clear');
                $.toast({
                    heading: 'Error',
                    text: (error[0]==1 ? 'Die Bulk Datei enthält zwei identische ID\'s (erste Spalte): ' : 'Eines der Passwörter ist zu kurz (siebte Spalte): ') + error[1],
                    showHideTransition: 'fade',
                    icon: 'error',
                    position: 'top-right',
                    hideAfter: 10000
                });
                return;
              }
              submit(result, overwriteBack);
          });
          return false;
        }
    });

    help();
};

function submit(result, overwriteBack) {
  var wait = $("#zipWait");
  $("#bulkworkForm").hide();
  wait.show();

  var zip = new jszip();
  var promises = api.create.bulk(result);
  var running = [];

  for(var key in result) {
      (function(folder, key){
        folder.file("password.txt", result[key].password);
        promises[key].then(function(data){
          folder.file("request.csr",api.export.csr(data.csr));
          folder.file("privateKey.pem",api.export.keypair.privateKey(data.keypair.privateKey,result[key].password));
        });
        running.push(promises[key]);
      }(zip.folder(key),key));
  }

  Promise.all(running).then(function(){
    zip.generateAsync({type:"blob"}).then(function(content) {
      overwriteBack("Downloadbereich verlassen","Wurde das Ergebnis der Bulk Verarbeitung gesichert?","overview");
      var time = Math.floor(new Date().getTime() / 1000);
      $("#downloadZip").click(function() {
          window.saveAs(content, "bulk_" + time + ".zip");
      });
      wait.hide();
      $("#zipDownload").show();
    });
  });
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
