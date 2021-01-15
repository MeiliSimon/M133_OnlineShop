#Dorfladen von Simon Meili

##Anforderungen
Um den Web Shop zu starten, muss [Deno](https://deno.land/) installiert sein.

##Online Shop starten
In der Projektmappe folgenden Befehl ausführen:
```
start.sh
```
Fals dies nicht geht diese Befehle ausführen:
```
deno run --allow-read --allow-write --unstable ./tools/builder.ts
deno run --allow-net --allow-read app.ts
```
Fals dies auch nicht geht, befinden Sie sich sehr wahrscheinlich im falschen Verzeichnis.
Wenn der Shop gestartet ist, einfach auf http://localhost:8000/ gehen.
