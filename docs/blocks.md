# Blöcke

Auf dieser Seite werden einzelne Blöcke der Erweiterung beschrieben.
 - [LoRa Netzwerk](#lora_netzwerk)
 - [GPIO](#gpio)
 - [weitere](#weitere)

## LoRa Netzwerk
### LoRa Konfiguration
Um eine Verbindung zum LoRa Netzwerk herzustellen, muss zuerst das LoRa Modul mit den notwendigen Parametern konfiguriert werden. Der Block dazu befindet sich in **IoT Cube -> Konfiguration -> OTAA Setup**. Mit diesem Block werden DevEUI, AppKey etc. auf das Modul geschrieben und über einen Stromzyklus gespeichert.
```blocks
IoTCube.OTAA_Setup(
"11111111111",
"2222222222",
"3333333333",
eBands.EU868,
"A"
)
``` 

### LoRa Verbindungsaufbau
Wenn die Konfiguration erfolgreich gespeichert wurde, kann ein Verbindungsaufbau gestartet werden. Der Verbindungsversuch kann mit den Parametern konfiguriert werden. So kann die Anzahl Neuversuche und Wartezeit zwischen Versuchen eingestellt werden. Das Modul kann so konfiguriert werden, dass beim Starten direkt ein Verbindungsaufbau initiert wird.
```blocks
IoTCube.LoRa_Join(eBool.enable,eBool.enable,10,8)
```

### LoRa Modulsteuerung
Für die spezifische Steuerung des LoRa Moduls sind eigene Blöcke implementiert. So kann Beispielsweise ein Reset oder Sleep ausgeführt werden. Um die volle Funktionalität des Moduls anzubieten, können Paramater gezielt gesetzt werden.

| Name  | Block                       | Beschreibung                                 |
|-------|-----------------------------|----------------------------------------------|
| Reset | IoTCube.resetModule(false)  | LoRa reset (Software oder Hardware)          |
| Sleep | IoTCube.sleep(500)          | Aktiviere Low-Power-Modus für bestimmte Zeit |
| Set parameter | IoTCube.setParameter(eRUI3_PARAM.CLASS, "B") |                               |
| Get parameter | IoTCube.getParameter(eRUI3_PARAM.RSSI) | Auslesen der Register im LoRa Modul |

## GPIO
Der IoT-Würfel besitzt eine Benutzer-LED sowie zwei Open-Collector Ausgänge. Für die Ansteuerung dieser Komponenten befinden sich die Blöcke in **IoT Cube** in der Gruppe **Pins**. 
```blocks
IoTCube.togglePin(MCP_Pins.USR_LED)
IoTCube.setPin(MCP_Pins.OC1, true)
IoTCube.setPin(MCP_Pins.OC2, false)
```

## Weitere
### Event
```blocks
let event = IoTCube.checkEvent(eRAK_EVT.JOINED)
```

| Typ     | Bit          | Referenz              | Beschreibung                             |
|---------|--------------|-----------------------|------------------------------------------|
| Event   | 9 (0x0100)   | JOIN_FAILED           | Verbindungsversuch fehlgeschlagen        |
| Event   | 10 (0x0200)  | JOINED                | Verbindungsversuch erfolgreich           |
| Event   | 11 (0x0400)  | SEND_CONFIRMED_FAILED | Sendebestätigung fehlgeschlagen          |
| Event   | 12 (0x0800)  | SEND_CONFIRMED_OK     | Sendebestätigung erfolgreich             |



[Beispiele](https://paeber.github.io/lora-at-interface/docs/examples)


<script src="https://makecode.com/gh-pages-embed.js"></script><script>makeCodeRender("{{ site.makecode.home_url }}", "{{ site.github.owner_name }}/{{ site.github.repository_name }}");</script>
