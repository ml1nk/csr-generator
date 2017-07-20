const $ = require('jquery');
const filedata = require('./../lib/filedata.js');
const formobject = require('./../lib/formobject.js');
const download = require('./../lib/download.js');
const api = require('csr-helper');
const views = require('./../views.js');
const t = require('i18next').t;
const bulk = require('./../csv/bulk-template.csv');

exports.title = t('bulkwork.title');
exports.load = (main, data) => {
    let bulkfile = $('#bulkfile');
    bulkfile.fileinput({
        language: 'de',
    });

    $('#downloadBULK').click(() => {
        download(
            'bulk-template.csv',
            'text/csv',
            bulk,
            false
        );
    });

    let file = filedata(bulkfile[0]);

    $('#form').validator().on('submit', (e) => {
        if (e.isDefaultPrevented()) {
            // handle the invalid form...
        } else {
          file.getData((success, data) => {
              if (!success) {
                  bulkfile.fileinput('clear');
                  $.toast({
                      heading: t('bulkwork.fileloadheading'),
                      text: t('bulkwork.fileloadtext'),
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
                      heading: t('bulkwork.filecolumnsheading'),
                      text: t('bulkwork.filecolumnstext', {line: e.line+1}),
                      showHideTransition: 'fade',
                      icon: 'error',
                      position: 'top-right',
                      hideAfter: 10000,
                  });
                } else if (e.code==='rows') {
                  $.toast({
                      heading: t('bulkwork.filerowsheading'),
                      text: t('bulkwork.filerowstext'),
                      showHideTransition: 'fade',
                      icon: 'error',
                      position: 'top-right',
                      hideAfter: 10000,
                  });
                } else if (typeof e.code === 'number') {
                  $.toast({
                      heading: t('bulkwork.filenumberheading'),
                      text: (
                            e.code===0
                            ? t('bulkwork.filenumbertext_a')
                            : t('bulkwork.filenumbertext_b')
                            )
                            + t(
                                'bulkwork.filenumbertext_end',
                                {line: e.line+1, data: e.data}
                            ),
                      showHideTransition: 'fade',
                      icon: 'error',
                      position: 'top-right',
                      hideAfter: 10000,
                  });
                } else {
                  $.toast({
                      heading: t('bulkwork.fileunknownheading'),
                      text: t('bulkwork.fileunknowntext'),
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

  let content = await api.export.bulk(bulk, 'base64');

  views.confirm(
      t('bulkwork.confirmtitle'),
      t('bulkwork.confirmtext')
  );
  let time = Math.floor(new Date().getTime() / 1000);
  $('#downloadZip').click(() => {
      download(
        'bulk_' + time + '.zip',
        'application/zip',
        content,
        false
    );
  });
  wait.hide();
  $('#zipDownload').show();
}


function help() {
    $('#bulkfile_help').click((e) => {
        $.dialog({
            backgroundDismiss: true,
            title: t('bulkwork.filehelptitle'),
            content: t('bulkwork.filehelpcontent'),
            columnClass: 'col-md-8 col-md-offset-2 col-xs-8 col-xs-offset-2',
        });
        e.preventDefault();
    });

    $('#OU1_help, #OU2_help').click((e) => {
        $.dialog({
            backgroundDismiss: true,
            title: t('bulkwork.ouhelptitle'),
            content: t('bulkwork.ouhelptext'),
            columnClass: 'col-md-8 col-md-offset-2 col-xs-8 col-xs-offset-2',
        });
        e.preventDefault();
    });
}
