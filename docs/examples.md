# Beispiele

Auf dieser Seite werden Beispiele gezeigt und beschrieben.

## Verbindungsaufbau benachrichtigung
```blocks
loops.everyInterval(1000, function () {
    if (IoTCube.checkEvent(eRAK_EVT.JOINED)) {
        music.playTone(988, music.beat(BeatFraction.Eighth))
        basic.showIcon(IconNames.Yes)
    } else if (IoTCube.checkEvent(eRAK_EVT.JOIN_FAILED)) {
        basic.showIcon(IconNames.No)
    } else {
        basic.showIcon(IconNames.Diamond)
        basic.pause(500)
        basic.showIcon(IconNames.SmallDiamond)
    }
})
```

## Sendeschleife für Sensoren
Dieses Beispiel zeigt eine Routine, welche alle 5 Minuten bei einer erfolgreichen Verbindung mehrere Sensorwerte übermittelt. 
```blocks
loops.everyInterval(300000, function () {
    if (IoTCube.getStatus(eSTATUS_MASK.JOINED)) {
        IoTCube.addAnalogInput(pins.analogReadPin(AnalogPin.P0), 1)
        IoTCube.addIlluminance(pins.analogReadPin(AnalogPin.P1), 5)
        IoTCube.addTemperature(input.temperature(), 3)
        IoTCube.addIlluminance(input.lightLevel(), 4)
        IoTCube.SendBuffer(IoTCube.getCayenne())
    }
})
```



## Downlink

Der Block **Downlink Event** ermöglicht auf Nachrichten zu reagieren. In diesem Beispiel wird die LED rechts neben dem micro:bit gesteuert. Dazu wird das CayenneLPP Format verwendet.

```blocks
IoTCube.DownlinkEvent(function (channel, value) {
    if (channel == 10) {
        if (value > 0) {
            IoTCube.setPin(MCP_Pins.USR_LED, true)
        } else {
            IoTCube.setPin(MCP_Pins.USR_LED, false)
        }
    }
})
```



Für das einschalten der LED ist folgende Nachricht notwendig:

```json
{
    "value_10": 1
}
```




<script src="https://makecode.com/gh-pages-embed.js"></script><script>makeCodeRender("{{ site.makecode.home_url }}", "{{ site.github.owner_name }}/{{ site.github.repository_name }}");</script>
