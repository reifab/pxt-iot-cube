# Blöcke

Auf dieser Seite werden einzelne Blöcke der Erweiterung beschrieben.
 - [LoRa Netzwerk](#lora_netzwerk)
 - [Cayenne LPP](#cayenne_lpp)
 - [GPIO](#gpio)
 - [weitere](#weitere)

---------------------------------------------
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

### LoRa Uplink
Bei einer Verbindung mit dem LoRa Netzwerk, können Daten übermittelt werden. Im Normalfall wird ein Buffer mit den Daten vorbereitet und anschliessend mit dem Block *SendBuffer* gesendet. Über das Dropdown-Menu kann der Kanal ausgewählt werden.
```blocks
IoTCube.SendBuffer(IoTCube.getCayenne(), Channels.Five)
```

### LoRa Downlink
Die Erweiterung prüft im Hintergrund, ob ein Downlink empfangen worden ist. Bei einem Class-A Gerät ist dies nach einem Uplink möglich, sprich ein Downlink kann nur kurz nach einem Uplink empfangen werden. 
Wird ein Downlink Event ausgelöst, dann wird der Ablauf innerhalb dieses Blocks ausgeführt. Die Nachricht ist bereits in den Variablen aufbereitet nach dem Cayenne LPP Standard. *Channel* entspricht dem value-Index und *value* ist der zugewiesene Wert.
```blocks
IoTCube.DownlinkEvent(function(channel: number, value: number) {
    
})
```
Ein Downlink kann Beispielsweise über die TTN-Konsole oder per MQTT geplant werden.

### LoRa Modulsteuerung
Für die spezifische Steuerung des LoRa Moduls sind eigene Blöcke implementiert. So kann Beispielsweise ein Reset oder Sleep ausgeführt werden. Um die volle Funktionalität des Moduls anzubieten, können Paramater gezielt gesetzt werden.

| Name  | Block                       | Beschreibung                                 |
|-------|-----------------------------|----------------------------------------------|
| Reset | IoTCube.resetModule(false)  | LoRa reset (Software oder Hardware)          |
| Sleep | IoTCube.sleep(500)          | Aktiviere Low-Power-Modus für bestimmte Zeit |
| Set parameter | IoTCube.setParameter(eRUI3_PARAM.CLASS, "B") |                               |
| Get parameter | IoTCube.getParameter(eRUI3_PARAM.RSSI) | Auslesen der Register im LoRa Modul |

---------------------------------------------
## Cayenne LPP
Das Cayenne LPP ist ein Protkoll welches für IoT-Kommunikation ausgelegt wurde. Das Ziel von Cayenne ist es, Daten möglichst sparsam und gleichzeitig Informativ zu übermitteln. Um das zu erreichen werden Codes zu einzelnen Datentypen zugewiesen, welche dem Sender und Empfänger bekannt sind. Weitere Dokumentation: [Cayenne-LPP](https://docs.mydevices.com/docs/lorawan/cayenne-lpp).
### Analog Input
Ein analoger Eingang kann Werte von *-327.68* bis *+327.67* annehmen. Die ist Aufgrund des Cayenne Standards.
```blocks
IoTCube.addAnalogInput(26.53, Channels.One)
```

Für den Micro:bit sind die analogen Werte im Bereich von *0* bis *1023*. Die Skalierung von micro:bit zu cayenne kann im Block aktiviert werden. Die Option ist hinter dem *+* versteckt und Normalerweise deaktiviert.
```blocks
IoTCube.addAnalogInput(26.53, Channels.One, True)
```

---------------------------------------------
## GPIO
Der IoT-Würfel besitzt eine Benutzer-LED sowie zwei Open-Collector Ausgänge. Für die Ansteuerung dieser Komponenten befinden sich die Blöcke in **IoT Cube** in der Gruppe **Pins**. 
```blocks
IoTCube.togglePin(MCP_Pins.USR_LED)
IoTCube.setPin(MCP_Pins.OC1, true)
IoTCube.setPin(MCP_Pins.OC2, false)
```

---------------------------------------------
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
