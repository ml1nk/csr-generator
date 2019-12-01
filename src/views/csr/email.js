const $ = require('jquery');
const filedata = require('./../../lib/filedata.js');
const formobject = require('./../../lib/formobject.js');
const api = require('csr-helper');
const views = require('./../../views.js');
const i18next = require('i18next').default;

exports.title = i18next.t('csr.email.title');

exports.load = (main, data) => {
  const privateKey = $('#privateKey');
  const form = $('#form');

  privateKey.fileinput({
    language: 'de',
  });

  const file = filedata(privateKey[0]);

  form.validator().on('submit', (e) => {
    if (e.isDefaultPrevented()) {
      // handle the invalid form...
    } else {
      file.getData((success, privateKey) => {
        if (!success) {
          privateKey.fileinput('clear');
          $.toast({
            heading: i18next.t('csr.email.fileloadheading'),
            text: i18next.t('csr.email.fileloadtext'),
            showHideTransition: 'fade',
            icon: 'error',
            position: 'top-right',
            hideAfter: 10000,
          });
          return;
        }
        submit(privateKey, convertForm(formobject(form)));
      });
      return false;
    }
  });
  help();
};

function convertForm(form) {
  form.emails = [];
  if (form.email1 !== '') {
    form.emails.push(form.email1);
  }
  if (form.email2 !== '') {
    form.emails.push(form.email2);
  }
  if (form.email3 !== '') {
    form.emails.push(form.email3);
  }
  if (form.email4 !== '') {
    form.emails.push(form.email4);
  }
  if (form.OU3 === '') {
    delete form.OU3;
  }
  delete form.email1;
  delete form.email2;
  delete form.email3;
  delete form.email4;
  return form;
}

function submit(privateKey, form) {
  const keypair = api.import.keypair(privateKey, form.password);
  delete form.password;
  if (keypair === false) {
    $.toast({
      heading: i18next.t('csr.email.fileheading'),
      text: i18next.t('csr.email.fileheading'),
      showHideTransition: 'fade',
      icon: 'error',
      position: 'top-right',
      hideAfter: 10000,
    });
    return false;
  }
  views.load('csrsave', {
    title: i18next.t('csr.email.savetitle'),
    type: i18next.t('csr.email.savetype'),
    csr: api.export.csr(api.create.csr.email(form, keypair.privateKey, keypair.publicKey)),
  });
}

function help() {
  $('#privateKey_help').click((e) => {
    $.dialog({
      backgroundDismiss: true,
      title: i18next.t('csr.email.privatekeyhelpheading'),
      content: i18next.t('csr.email.privatekeyhelpcontent'),
      columnClass: 'col-md-8 col-md-offset-2 col-xs-8 col-xs-offset-2',
    });
    e.preventDefault();
  });

  $('#password_help').click((e) => {
    $.dialog({
      backgroundDismiss: true,
      title: i18next.t('csr.email.passwordhelpheading'),
      content: i18next.t('csr.email.passwordhelpcontent'),
      columnClass: 'col-md-8 col-md-offset-2 col-xs-8 col-xs-offset-2',
    });
    e.preventDefault();
  });

  $('#C_help').click((e) => {
    $.dialog({
      backgroundDismiss: true,
      title: i18next.t('csr.email.chelpheading'),
      content: i18next.t('csr.email.chelpcontent'),
      columnClass: 'col-md-8 col-md-offset-2 col-xs-8 col-xs-offset-2',
    });
    e.preventDefault();
  });

  $('#O_help').click((e) => {
    $.dialog({
      backgroundDismiss: true,
      title: i18next.t('csr.email.ohelpheading'),
      content: i18next.t('csr.email.ohelpcontent'),
      columnClass: 'col-md-8 col-md-offset-2 col-xs-8 col-xs-offset-2',
    });
    e.preventDefault();
  });

  $('#OU1_help, #OU2_help, #OU3_help').click((e) => {
    $.dialog({
      backgroundDismiss: true,
      title: i18next.t('csr.email.ouhelpheading'),
      content: i18next.t('csr.email.ouhelpcontent'),
      columnClass: 'col-md-8 col-md-offset-2 col-xs-8 col-xs-offset-2',
    });
    e.preventDefault();
  });

  $('#email1_help').click((e) => {
    $.dialog({
      backgroundDismiss: true,
      title: i18next.t('csr.email.email1helpheading'),
      content: i18next.t('csr.email.email1helpcontent'),
      columnClass: 'col-md-8 col-md-offset-2 col-xs-8 col-xs-offset-2',
    });
    e.preventDefault();
  });
  $('#email1_wdh_help').click((e) => {
    $.dialog({
      backgroundDismiss: true,
      title: i18next.t('csr.email.email1helpheading'),
      content: i18next.t('csr.email.email1helpcontent'),
      columnClass: 'col-md-8 col-md-offset-2 col-xs-8 col-xs-offset-2',
    });
    e.preventDefault();
  });

  $('#email2_help').click((e) => {
    $.dialog({
      backgroundDismiss: true,
      title: i18next.t('csr.email.email2helpheading'),
      content: i18next.t('csr.email.email2helpcontent'),
      columnClass: 'col-md-8 col-md-offset-2 col-xs-8 col-xs-offset-2',
    });
    e.preventDefault();
  });
  $('#email2_wdh_help').click((e) => {
    $.dialog({
      backgroundDismiss: true,
      title: i18next.t('csr.email.email2helpheading'),
      content: i18next.t('csr.email.email2helpcontent'),
      columnClass: 'col-md-8 col-md-offset-2 col-xs-8 col-xs-offset-2',
    });
    e.preventDefault();
  });


  $('#email3_help').click((e) => {
    $.dialog({
      backgroundDismiss: true,
      title: i18next.t('csr.email.email3helpheading'),
      content: i18next.t('csr.email.email3helpcontent'),
      columnClass: 'col-md-8 col-md-offset-2 col-xs-8 col-xs-offset-2',
    });
    e.preventDefault();
  });
  $('#email3_wdh_help').click((e) => {
    $.dialog({
      backgroundDismiss: true,
      title: i18next.t('csr.email.email3helpheading'),
      content: i18next.t('csr.email.email3helpcontent'),
      columnClass: 'col-md-8 col-md-offset-2 col-xs-8 col-xs-offset-2',
    });
    e.preventDefault();
  });


  $('#email4_help').click((e) => {
    $.dialog({
      backgroundDismiss: true,
      title: i18next.t('csr.email.email4helpheading'),
      content: i18next.t('csr.email.email4helpcontent'),
      columnClass: 'col-md-8 col-md-offset-2 col-xs-8 col-xs-offset-2',
    });
    e.preventDefault();
  });
  $('#email4_wdh_help').click((e) => {
    $.dialog({
      backgroundDismiss: true,
      title: i18next.t('csr.email.email4helpheading'),
      content: i18next.t('csr.email.email4helpcontent'),
      columnClass: 'col-md-8 col-md-offset-2 col-xs-8 col-xs-offset-2',
    });
    e.preventDefault();
  });

  $('#firstname_help').click((e) => {
    $.dialog({
      backgroundDismiss: true,
      title: i18next.t('csr.email.firstnamehelpheading'),
      content: i18next.t('csr.email.firstnamehelpcontent'),
      columnClass: 'col-md-8 col-md-offset-2 col-xs-8 col-xs-offset-2',
    });
    e.preventDefault();
  });

  $('#lastname_help').click((e) => {
    $.dialog({
      backgroundDismiss: true,
      title: i18next.t('csr.email.lastnamehelpheading'),
      content: i18next.t('csr.email.lastnamehelpheading'),
      columnClass: 'col-md-8 col-md-offset-2 col-xs-8 col-xs-offset-2',
    });
    e.preventDefault();
  });
}
