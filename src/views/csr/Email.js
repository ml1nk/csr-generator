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

    form.validator().on('submit', function(e) {
        if (e.isDefaultPrevented()) {
            // handle the invalid form...
        } else {
            file.getData(function(success, privateKey) {
                if (!success) {
                    privateKey.fileinput('clear');
                    $.toast({
                        heading: 'Error',
                        text: 'Es ist ein Fehler beim Auslesen des Privaten Schlüssels aufgetreten.',
                        showHideTransition: 'fade',
                        icon: 'error',
                        position: 'top-right',
                        hideAfter: 10000
                    });
                    return;
                }
                submit(privateKey, convertForm(formobject(form)), views);
            });
            return false;
        }
    });
    help();
};

function convertForm(form) {
  form.emails = [];
  if(form.email1 !== "") {
    form.emails.push(form.email1);
  }
  if(form.email2 !== "") {
    form.emails.push(form.email2);
  }
  if(form.email3 !== "") {
    form.emails.push(form.email3);
  }
  if(form.email4 !== "") {
    form.emails.push(form.email4);
  }
  if(form.OU3 === "") {
    delete form.OU3;
  }
  delete form.email1;
  delete form.email2;
  delete form.email3;
  delete form.email4;
  return form;
}

function submit(privateKey, form, views) {
    var keypair = api.import.keypair(privateKey, form.password);
    delete form.password;
    if (keypair === false) {
        $.toast({
            heading: 'Error',
            text: 'Die angegebene Datei ist kein Privater Schlüssel oder das eingetragene Schlüsselpasswort ist ungültig.',
            showHideTransition: 'fade',
            icon: 'error',
            position: 'top-right',
            hideAfter: 10000
        });
        return false;
    }
    views("csrsave", {
        title: "Benutzer-CSR",
        type: "Benutzer-CSR",
        csr: api.export.csr(api.create.csr.Email(form,keypair.privateKey, keypair.publicKey))
    });
}

function help() {
    $("#privateKey_help").click(function(e) {
        $.dialog({
            backgroundDismiss: true,
            title: 'Privater Schlüssel',
            content: 'Mit dem angegeben privaten Schlüssel wird der CSR Unterschrieben.',
            columnClass: 'col-md-8 col-md-offset-2 col-xs-8 col-xs-offset-2'
        });
        e.preventDefault();
    });

    $("#password_help").click(function(e) {
        $.dialog({
            backgroundDismiss: true,
            title: 'Schlüsselpasswort',
            content: 'Falls der private Schlüssel mit einem Passwort geschützt wird, muss dies hier angegeben werden.',
            columnClass: 'col-md-8 col-md-offset-2 col-xs-8 col-xs-offset-2'
        });
        e.preventDefault();
    });

    $("#C_help").click(function(e) {
        $.dialog({
            backgroundDismiss: true,
            title: 'Geschäftssitz',
            content: 'Es muss das Land ausgewählt werden, in dem die Organisation ihren Geschäftssitz hat.',
            columnClass: 'col-md-8 col-md-offset-2 col-xs-8 col-xs-offset-2'
        });
        e.preventDefault();
    });

    $("#O_help").click(function(e) {
        $.dialog({
            backgroundDismiss: true,
            title: 'Organisationsname',
            content: 'Dieses Feld enthält den Organisationsnamen (z.B. Firma, Institution, Behörde) des Zertifikatsinhabers. Es ist ' +
                     'erforderlich, dass der Organisationsname im Zertifikat die offizielle Schreibweise der Organisation aufweist, also ' +
                     'identisch mit dem jeweiligen Registereintrag (Handelsregister o.ä.) ist.<br/>' +
                     'Beispiel: O=Musterfirma GmbH<br/>' +
                     'Diese Angaben werden anhand des Handelsregisterauszugs „HR-Auszug“ oder gleichwertiger ' +
                     'Verzeichnisse/Dokumente verifiziert.',
            columnClass: 'col-md-8 col-md-offset-2 col-xs-8 col-xs-offset-2'
        });
        e.preventDefault();
    });

    $("#OU1_help, #OU2_help, #OU3_help").click(function(e) {
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

    $("#email1_help").click(function(e) {
        $.dialog({
            backgroundDismiss: true,
            title: 'E-Mail1',
            content: 'leer',
            columnClass: 'col-md-8 col-md-offset-2 col-xs-8 col-xs-offset-2'
        });
        e.preventDefault();
    });
    $("#email1_wdh_help").click(function(e) {
        $.dialog({
            backgroundDismiss: true,
            title: 'E-Mail1 Wdh',
            content: 'leer',
            columnClass: 'col-md-8 col-md-offset-2 col-xs-8 col-xs-offset-2'
        });
        e.preventDefault();
    });

    $("#email2_help").click(function(e) {
        $.dialog({
            backgroundDismiss: true,
            title: 'E-Mail2',
            content: 'leer',
            columnClass: 'col-md-8 col-md-offset-2 col-xs-8 col-xs-offset-2'
        });
        e.preventDefault();
    });
    $("#email2_wdh_help").click(function(e) {
        $.dialog({
            backgroundDismiss: true,
            title: 'E-Mail2 Wdh',
            content: 'leer',
            columnClass: 'col-md-8 col-md-offset-2 col-xs-8 col-xs-offset-2'
        });
        e.preventDefault();
    });


    $("#email3_help").click(function(e) {
        $.dialog({
            backgroundDismiss: true,
            title: 'E-Mail3',
            content: 'leer',
            columnClass: 'col-md-8 col-md-offset-2 col-xs-8 col-xs-offset-2'
        });
        e.preventDefault();
    });
    $("#email3_wdh_help").click(function(e) {
        $.dialog({
            backgroundDismiss: true,
            title: 'E-Mail3 Wdh',
            content: 'leer',
            columnClass: 'col-md-8 col-md-offset-2 col-xs-8 col-xs-offset-2'
        });
        e.preventDefault();
    });


    $("#email4_help").click(function(e) {
        $.dialog({
            backgroundDismiss: true,
            title: 'E-Mail4',
            content: 'leer',
            columnClass: 'col-md-8 col-md-offset-2 col-xs-8 col-xs-offset-2'
        });
        e.preventDefault();
    });
    $("#email4_wdh_help").click(function(e) {
        $.dialog({
            backgroundDismiss: true,
            title: 'E-Mail4 Wdh',
            content: 'leer',
            columnClass: 'col-md-8 col-md-offset-2 col-xs-8 col-xs-offset-2'
        });
        e.preventDefault();
    });

    $("#firstname_help").click(function(e) {
        $.dialog({
            backgroundDismiss: true,
            title: 'Vorname',
            content: 'leer',
            columnClass: 'col-md-8 col-md-offset-2 col-xs-8 col-xs-offset-2'
        });
        e.preventDefault();
    });

    $("#lastname_help").click(function(e) {
        $.dialog({
            backgroundDismiss: true,
            title: 'Nachname',
            content: 'leer',
            columnClass: 'col-md-8 col-md-offset-2 col-xs-8 col-xs-offset-2'
        });
        e.preventDefault();
    });

}
