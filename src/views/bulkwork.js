const $ = require('jquery');
const filedata = require('./../lib/filedata.js');
const formobject = require('./../lib/formobject.js');
const api = require('csr-helper');
const views = require('./../views.js');

exports.title = 'Bulk Datei Verarbeiten';
exports.load = (main, data) => {
    let bulkfile = $('#bulkfile');
    bulkfile.fileinput({
        language: 'de',
    });

    let file = filedata(bulkfile[0]);

    $('#form').validator().on('submit', function(e) {
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
                      hideAfter: 10000,
                  });
                  return;
              }
              let form = formobject(form);
              try {
                submit(api.import.bulk(data, form.OU1, form.OU2));
              } catch (e) {
                bulkfile.fileinput('clear');

                if (e.code==='columns') {
                  $.toast({
                      heading: 'Error',
                      text: 'Im Eintrag '+(e.line+1)+' in der Bulk Datei gibt es zu wenig Spalten.',
                      showHideTransition: 'fade',
                      icon: 'error',
                      position: 'top-right',
                      hideAfter: 10000,
                  });
                } else if (e.code==='rows') {
                  $.toast({
                      heading: 'Error',
                      text: 'Die Bulk Datei besitzt keine Einträge.',
                      showHideTransition: 'fade',
                      icon: 'error',
                      position: 'top-right',
                      hideAfter: 10000,
                  });
                } else if (typeof e.code === 'number') {
                  $.toast({
                      heading: 'Error',
                      text: (e.code===0 ? 'Die Bulk Datei enthält zwei identische ID\'s (erste Spalte): ' : 'Eines der Passwörter ist zu kurz (siebte Spalte): ') + 'Eintrag '+(e.line+1)+', '+e.data,
                      showHideTransition: 'fade',
                      icon: 'error',
                      position: 'top-right',
                      hideAfter: 10000,
                  });
                } else {
                  $.toast({
                      heading: 'Error',
                      text: 'Es ist ein unbekannter Fehler beim Verarbeiten der Bulk Datei aufgetreten.',
                      showHideTransition: 'fade',
                      icon: 'error',
                      position: 'top-right',
                      hideAfter: 10000,
                  });
                }
              }
          });
          return false;
        }
    });

    help();
};

async function submit(bulk) {
  let wait = $('#zipWait');
  $('#bulkworkForm').hide();
  wait.show();

  let content = await api.export.bulk(bulk, 'blob');

  views.confirm(
      'Downloadbereich verlassen',
      'Wurde das Ergebnis der Bulk Verarbeitung gesichert?'
  );
  let time = Math.floor(new Date().getTime() / 1000);
  $('#downloadZip').click(function() {
      window.saveAs(content, 'bulk_' + time + '.zip');
  });
  wait.hide();
  $('#zipDownload').show();
}


function help() {
    $('#bulkfile_help').click(function(e) {
        $.dialog({
            backgroundDismiss: true,
            title: 'Bulk Datei',
            content: 'Text fehlt.',
            columnClass: 'col-md-8 col-md-offset-2 col-xs-8 col-xs-offset-2',
        });
        e.preventDefault();
    });

    $('#OU1_help, #OU2_help').click(function(e) {
        $.dialog({
            backgroundDismiss: true,
            title: 'Untereinheiten',
            content: 'Dieses Feld ist optional und enthält eine Organisation, Einheit (Abteilung, Bereich) bzw. '+
                     'Abteilung/Unterabteilung oder Gruppe, Team. Sollten OU-Felder genutzt werden, so ist darauf zu achten, dass '+
                     'eine Verbindung zur Organisation (O) hergestellt werden kann.<br/>'+
                     'Beispiele: OU1=Einkauf, OU2= Niederlassung Musterstadt',
            columnClass: 'col-md-8 col-md-offset-2 col-xs-8 col-xs-offset-2',
        });
        e.preventDefault();
    });
}
