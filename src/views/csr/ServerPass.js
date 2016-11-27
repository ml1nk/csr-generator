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
    }).on('submit', function(e) {
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
                submit(privateKey, formobject(form), views);
            });
            return false;
        }
    });
    help();
};

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
        title: "TeleSec ServerPass Standard",
        type: "TeleSec_ServerPass",
        csr: api.export.csr(api.create.csr.ServerPass(form,keypair.privateKey, keypair.publicKey))
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

    $("#CN_help").click(function(e) {
        $.dialog({
            backgroundDismiss: true,
            title: 'Schlüsselpasswort',
            content: 'Dieses Feld muss einen einzelnen FQDN (Fully Qualified Domain Name), also den vollständigen Namen einer öffentlich auflösbaren Domain.<br/>' +
                'Beispiel: CN=www.example.de<br/>' +
                'Der Common Name darf die folgenden Zeichen enthalten: A-Z,a-z,0-9,\',(,),+,,,-,.,/,:,=,space, *<br/>' +
                'Das Wildcard-Zeichen (*, Sternchen, Asterisk) wird nur ganz links im FQDN akzeptiert. Wildcard-Zeichen in Verbindung mit Zeichen und/oder Buchstaben (z.B. h*l.example.com) sowie mehr als ein Wildcard-Zeichen (z.B. *.*.example.com) pro FQDN werden nicht akzeptiert.<br/>',
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

    $("#L_help").click(function(e) {
        $.dialog({
            backgroundDismiss: true,
            title: 'Stadtname',
            content: 'Dieses Feld enthält den Namen der Stadt, in dem die Organisation (z.B. Firma, Institution, Behörde) ansässig ist.',
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

    $("#OU1_help, #OU2_help, #OU3_help, #OU4_help, #OU5_help").click(function(e) {
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

    $("#streetAddress_help").click(function(e) {
        $.dialog({
            backgroundDismiss: true,
            title: 'Straßenname',
            content: 'Dieses Feld ist optional und enthält den Straßennamen, an dem die Organisation (z.B. Firma, Institution, Behörde) ansässig ist.<br/>'+
                     'Beispiel: street address=Musterstraße 17',
            columnClass: 'col-md-8 col-md-offset-2 col-xs-8 col-xs-offset-2'
        });
        e.preventDefault();
    });

    $("#postalCode_help").click(function(e) {
        $.dialog({
            backgroundDismiss: true,
            title: 'Postleitzahl',
            content: 'Dieses Feld ist optional und enthält die Postleitzahl der Stadt, in dem die Organisation (z.B. Firma, Institution, Behörde) ansässig ist.<br/>'+
                     'Beispiel: postal code=12345',
            columnClass: 'col-md-8 col-md-offset-2 col-xs-8 col-xs-offset-2'
        });
        e.preventDefault();
    });
}
