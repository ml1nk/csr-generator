const $ = require('jquery');
const filedata = require('./../../lib/filedata.js');
const formobject = require('./../../lib/formobject.js');
const api = require('csr-helper');
const views = require('./../../views.js');
const t = require('i18next').t;

exports.title = t('csr.serverpass.title');
exports.load = (main, data) => {
    let privateKey = $('#privateKey');
    let form = $('#form');

    privateKey.fileinput({
        language: 'de',
    });

    let file = filedata(privateKey[0]);

    form.validator({
        custom: {
            domain: ($el) => {
                return !/^(\*\.)?([\w-]+\.)+[\w-]+$/.test($el.val());
            },
        },
    }).on('submit', (e) => {
        if (e.isDefaultPrevented()) {
            // handle the invalid form...
        } else {
            file.getData(function(success, privateKey) {
                if (!success) {
                    privateKey.fileinput('clear');
                    $.toast({
                        heading: t('csr.serverpass.fileloadheading'),
                        text: t('csr.serverpass.fileloadtext'),
                        showHideTransition: 'fade',
                        icon: 'error',
                        position: 'top-right',
                        hideAfter: 10000,
                    });
                    return;
                }
                submit(privateKey, formobject(form));
            });
            return false;
        }
    });
    help();
};

function submit(privateKey, form) {
    let keypair = api.import.keypair(privateKey, form.password);
    delete form.password;
    if (keypair === false) {
        $.toast({
            heading: t('csr.serverpass.fileloadheading'),
            text: t('csr.serverpass.fileloadtext'),
            showHideTransition: 'fade',
            icon: 'error',
            position: 'top-right',
            hideAfter: 10000,
        });
        return false;
    }
    views.load('csrsave', {
        title: t('csr.serverpass.savetitle'),
        type: t('csr.serverpass.savetype'),
        csr: api.export.csr(
            api.create.csr.serverpass(
                form, 
                keypair.privateKey,
                keypair.publicKey)
                ),
    });
}

function help() {
    $('#privateKey_help').click((e) => {
        $.dialog({
            backgroundDismiss: true,
            title: t('csr.serverpass.privatekeyhelptitle'),
            content: t('csr.serverpass.privatekeyhelpcontent'),
            columnClass: 'col-md-8 col-md-offset-2 col-xs-8 col-xs-offset-2',
        });
        e.preventDefault();
    });

    $('#password_help').click((e) => {
        $.dialog({
            backgroundDismiss: true,
            title: t('csr.serverpass.passwordhelptitle'),
            content: t('csr.serverpass.passwordhelpcontent'),
            columnClass: 'col-md-8 col-md-offset-2 col-xs-8 col-xs-offset-2',
        });
        e.preventDefault();
    });

    $('#CN_help').click((e) => {
        $.dialog({
            backgroundDismiss: true,
            title: t('csr.serverpass.cnhelptitle'),
            content: t('csr.serverpass.cnhelpcontent'),
            columnClass: 'col-md-8 col-md-offset-2 col-xs-8 col-xs-offset-2',
        });
        e.preventDefault();
    });


    $('#C_help').click((e) => {
        $.dialog({
            backgroundDismiss: true,
            title: t('csr.serverpass.chelptitle'),
            content: t('csr.serverpass.chelpcontent'),
            columnClass: 'col-md-8 col-md-offset-2 col-xs-8 col-xs-offset-2',
        });
        e.preventDefault();
    });

    $('#L_help').click((e) => {
        $.dialog({
            backgroundDismiss: true,
            title: t('csr.serverpass.lhelptitle'),
            content: t('csr.serverpass.lhelpcontent'),
            columnClass: 'col-md-8 col-md-offset-2 col-xs-8 col-xs-offset-2',
        });
        e.preventDefault();
    });

    $('#O_help').click((e) => {
        $.dialog({
            backgroundDismiss: true,
            title: t('csr.serverpass.ohelptitle'),
            content: t('csr.serverpass.ohelpcontent'),
            columnClass: 'col-md-8 col-md-offset-2 col-xs-8 col-xs-offset-2',
        });
        e.preventDefault();
    });

    $('#OU1_help, #OU2_help, #OU3_help, #OU4_help, #OU5_help').click((e) => {
        $.dialog({
            backgroundDismiss: true,
            title: t('csr.serverpass.ouhelptitle'),
            content: t('csr.serverpass.ouhelpcontent'),
            columnClass: 'col-md-8 col-md-offset-2 col-xs-8 col-xs-offset-2',
        });
        e.preventDefault();
    });

    $('#streetAddress_help').click((e) => {
        $.dialog({
            backgroundDismiss: true,
            title: t('csr.serverpass.streethelptitle'),
            content: t('csr.serverpass.streethelpcontent'),
            columnClass: 'col-md-8 col-md-offset-2 col-xs-8 col-xs-offset-2',
        });
        e.preventDefault();
    });

    $('#postalCode_help').click((e) => {
        $.dialog({
            backgroundDismiss: true,
            title: t('csr.serverpass.plzhelptitle'),
            content: t('csr.serverpass.plzhelpcontent'),
            columnClass: 'col-md-8 col-md-offset-2 col-xs-8 col-xs-offset-2',
        });
        e.preventDefault();
    });
}
