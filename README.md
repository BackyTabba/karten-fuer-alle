# karten-fuer-alle
 Bachelorarbeit

## Backend
- [x] Create GitHub and branches
- [x] Cleaner code
- [x] Update index.html/input.txt
- [ ]  ~~Builded Build-docker-image~~
- [x] Ci/cd to aws
- [x] überarbeitung der internen Datenstruktur (parameterorder serverside, content-array clientside (+server-side) )
- [x] Domain operations before saving
- [x] Create docker composes
- [x] Ports and compose storage

- [x] View database data + recently changed
- [x] geöffnete Dateien an Server senden
- [x] downzuloadene Dateien vom Server bekommen
- [ ] Autogenerate Docker-Version
- [x] Write EnvVariables
- [ ] Export

- [ ] Mongodb persistent data
- [ ] Render sites
- [ ] Loglevel

## Frontend
- [ ] Fix frontend
    - [x] fix bug with double rectangle
    - [x] fix popups
    - [ ] marker color
- [x] Struktur der Datenbank definieren
- [x] Struktur der Datenbank umsetzen
- [x] Store each element of Frontend in mongo (events)
- [x] Datenbankmodell aus den Attributen generieren
- [x] Schema und Datenbankmodell als Variable abspeichern (Schema mit Tool.Schema (array) und Daten mit Tool.getDataKeys() (array))
- [x] Popup aus Variablen schmieden
- [x] Popup für die Erstellung schmieden
- [x] Popup irgendwie öffnen
- [x] Popup Datenbankverbindung push(Historie)
- [x] in Popup Historie anzeigen Datenbankverbindung pull

- [ ] ~~Popup bei der Erstellung öffnen~~

- [x] Popup so machen, dass es Sinn ergibt (wo und wann öffnet es sich)
- [x] Popup css anpassen
- [ ] ~~Übersetzungen generieren~~
- [x] Funktionen und envVars auslagern

- [x] Das in die Enddatei einpflegen
    - [x] Parameter in index.js wählbar machen
        - [x] basemaps
        - [x] neue variante Shapetypen zu wählen
        - [x] Struktur und Kopierfunktion anpassen
    - [x] input.txt anpassen

- [x] Daten hochladen mit DB verknüpfen
- [x] Daten runterladen mit DB verknüpfen

- [x] Neues Tool einrichten mit DB verknüpfen und Ports variable (Name = Identifikation)
- [x] Tool server_template.js zusammenstellen
- [x] node packages und packages-json zusammenstellen
- [x] den buildprozess manuell testen (npm start und schauen)
- [x] dockerfile lokal builden und testen ( attachen und anschauen )
- [ ] docker(-compose) testen (herausfinden wie man builded und zu dockerhub uploaded)
Docker Befehle: 
docker login
docker build -t leem01/karten-fuer-alle:Template /var/app/current/build/
docker image push leem01/karten-fuer-alle

- [x] CreateDockerImage() bauen und lokal testen
- [x] Docker-Compose in image reinkopieren und lokal testen
- [ ] mit manueller SSH-Verbindung CerateDockerImage() und Compose start auf Server testen
- [x] SSH-Verbindung mit Zertifikat aufbauen 
- [ ] mit SSH-Verbindung CreateDockerImage() und Compose start auf Server testen


- [ ] Zusammenkopieren von 
    - [x] Tool:server.js
    - [x] Tool:index.html (=output.html)
    - [x] Tool:node package.json
    - [ ] ~~Tool:node json.lock~~
    - [x] docker-compose nur(and only) in image nötig?

- [x] Check testdata
- [ ] ~~Advanced geospatial tool~~
- [ ] shorten testdata?

### Optional/Lowpriority
- [x] Parameter in Datenbank
- [x] Datenbankrouten anlegen
- [x] Aus Parameter und Datentyp autogenerate Auswahl-HTML-Datei
- [ ] hübsche datei evtl header mit bootstrap?
- [x] Anzahl der Farben ändern
- [ ] Marker Farboption fixen
- [x] besserer Auswahlprozess beim zusammenkopieren (Redundanzen reduzieren)