[![npm version](https://badge.fury.io/js/csr-generator.svg)](https://badge.fury.io/js/csr-generator)

<p align="center">
<a target="_blank" href="https://github.com/ml1nk/csr-generator"><img src="https://rawgit.com/ml1nk/csr-generator/master/build/icons/256x256.png"/></a>
</p>

Mit dieser App können Sie einen CSR (Certificate Signing Request) sowohl für TLS/SSL Zertifkate als auch Benutzer (E-Mail) Zertifikate erzeugen. Die so erzeugten CSR können für die Ausstellung von TLS/SSL Zertifikaten über die Webseite <a target="_blank" href="https://www.telesec.de/serverpass">https://www.telesec.de/serverpass</a> genutzt werden.

Der CSR für Benutzer (E-Mail) Zertifikate kann wenn Sie Kunde der TeleSec SBCA sind, zur Zertifikatsbeantragung eingereicht werden. Informationen zur SBCA finden Sie unter <a target="_blank" href="https://www.telesec.de/sbca">https://www.telesec.de/sbca</a>.

Um einen CSR Erzeugen zu können benötigen Sie neben den Domain Namen auch das dementsprechende Schlüsselmaterial. Die App ermöglicht Ihnen im ersten Schritt die Erzeugung eines RSA Schlüsselpaares mit mindestens 2048 Bit Schlüssellänge. Mit dem so erzeugten Schlüsselpaar können Sie über die Auswahl CSR erzeugen entweder einen CSR für TLS/SSL Zertifikate (Auswahl: TeleSec ServerPass Standard) oder ein Benutzer (E-Mail) Zertifikat (Auswahl Benutzer CSR) erzeugen.

Vor allem bei Benutzer Zertifikaten kann es notwendig sein eine „P12“ zu erzeugen. Diesen P12 File können Sie z.B. in unterschiedliche Betriebssysteme/Zertifikatsspeicher importieren. Voraussetzung zur Erzeugung eines P12 Files ist, das Sie von Ihrem Zertifizierungsstelle eine PKCS#7 Datei zurückerhalten.

Zusätzlich ermöglicht Ihnen der Punkt CSR Anzeigen, die Anzeige der Inhalte eines CSR. Dieser kann von Ihnen mit Hilfe der App erzeugt sein, oder es kann auch jeder beliebige andere CSR dekodiert  und angezeigt werden.

<a target="_blank" href="https://rawgit.com/ml1nk/csr-generator/online/index.html">Online-Version</a>
