const $ = require('jquery');
const filedata = require('./../lib/filedata.js');
const formobject = require('./../lib/formobject.js');
const download = require('./../lib/download.js');
const api = require('csr-helper');
const views = require('./../views.js');
const i18next = require('i18next').default;
const bulk = require('./../csv/bulk-template.csv');

exports.title = i18next.t('bulkwork.title');
exports.load = (main, data) => {
  const bulkfile = $('#bulkfile');
  bulkfile.fileinput({
    language: 'de',
  });

  $('#downloadBULK').click(() => {
    download(
        'bulk-template.csv',
        'text/csv',
        bulk,
        false,
    );
  });

  const file = filedata(bulkfile[0]);

  $('#form').validator().on('submit', (e) => {
    if (e.isDefaultPrevented()) {
      // handle the invalid form...
    } else {
      file.getData((success, data) => {
        if (!success) {
          bulkfile.fileinput('clear');
          $.toast({
            heading: i18next.t('bulkwork.fileloadheading'),
            text: i18next.t('bulkwork.fileloadtext'),
            showHideTransition: 'fade',
            icon: 'error',
            position: 'top-right',
            hideAfter: 10000,
          });
          return;
        }
        const form = formobject(form);
        try {
          submit(api.import.bulk(data, form.OU1, form.OU2));
        } catch (e) {
          bulkfile.fileinput('clear');

          if (e.code==='columns') {
            $.toast({
              heading: i18next.t('bulkwork.filecolumnsheading'),
              text: i18next.t('bulkwork.filecolumnstext', {line: e.line+1}),
              showHideTransition: 'fade',
              icon: 'error',
              position: 'top-right',
              hideAfter: 10000,
            });
          } else if (e.code==='rows') {
            $.toast({
              heading: i18next.t('bulkwork.filerowsheading'),
              text: i18next.t('bulkwork.filerowstext'),
              showHideTransition: 'fade',
              icon: 'error',
              position: 'top-right',
              hideAfter: 10000,
            });
          } else if (typeof e.code === 'number') {
            $.toast({
              heading: i18next.t('bulkwork.filenumberheading'),
              text: (
                            e.code===0 ?
                            i18next.t('bulkwork.filenumbertext_a') :
                            i18next.t('bulkwork.filenumbertext_b')
              ) +
                            i18next.t(
                                'bulkwork.filenumbertext_end',
                                {line: e.line+1, data: e.data},
                            ),
              showHideTransition: 'fade',
              icon: 'error',
              position: 'top-right',
              hideAfter: 10000,
            });
          } else {
            $.toast({
              heading: i18next.t('bulkwork.fileunknownheading'),
              text: i18next.t('bulkwork.fileunknowntext'),
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
  const wait = $('#zipWait');
  $('#bulkworkForm').hide();
  wait.show();

  const content = await api.export.bulk(bulk, 'base64');

  views.confirm(
      i18next.t('bulkwork.confirmtitle'),
      i18next.t('bulkwork.confirmtext'),
  );
  const time = Math.floor(new Date().getTime() / 1000);
  $('#downloadZip').click(() => {
    download(
        'bulk_' + time + '.zip',
        'application/zip',
        content,
        false,
    );
  });
  wait.hide();
  $('#zipDownload').show();
}


function help() {
  $('#bulkfile_help').click((e) => {
    $.dialog({
      backgroundDismiss: true,
      title: i18next.t('bulkwork.filehelptitle'),
      content: i18next.t('bulkwork.filehelpcontent'),
      columnClass: 'col-md-8 col-md-offset-2 col-xs-8 col-xs-offset-2',
    });
    e.preventDefault();
  });

  $('#OU1_help, #OU2_help').click((e) => {
    $.dialog({
      backgroundDismiss: true,
      title: i18next.t('bulkwork.ouhelptitle'),
      content: i18next.t('bulkwork.ouhelptext'),
      columnClass: 'col-md-8 col-md-offset-2 col-xs-8 col-xs-offset-2',
    });
    e.preventDefault();
  });
}
