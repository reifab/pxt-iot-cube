# Logik

Auf dieser Seite werden einzelne Blöcke der Erweiterung beschrieben.


## Hintergrund Prozesse
Damit das LoRa Modul überwacht werden kann sind mehrere Hintergrundprozesse aktiv.

### Watchdog Process
Im Watchdog geht es darum, das LoRa Modul zu überwachen. Ziel ist es, dass der micro:bit weiss, wie das Modul konfiguriert ist und es in den richtigen Zustand zu bringen.
```typescript
/**
 * Watchdog Process
 * Runs periodically in background to check device status
 */
export function watchdog() {
    if (getStatus(eSTATUS_MASK.INIT)) {
        if (!getStatus(eSTATUS_MASK.SETUP)) {
            if (!getStatus(eSTATUS_MASK.JOINED)) {      // No connection
                setStatus(eSTATUS_MASK.JOINED, parseInt(getParameter(eRUI3_PARAM.NJS)))
            }

            if (getStatus(eSTATUS_MASK.JOINED)) {       // Connection established
                setStatus(eSTATUS_MASK.CONNECT, 0)
                MCP23008.setPin(MCP_Pins.RAK_LED, false)
            }
            else if (getStatus(eSTATUS_MASK.CONNECT)) { // Connecting
                MCP23008.togglePin(MCP_Pins.RAK_LED)
            }
            else {                                      // No connection and not trying to connect
                MCP23008.setPin(MCP_Pins.RAK_LED, false)
            }

            if (getStatus(eSTATUS_MASK.SLEEP)) {        // Module in sleep mode
                MCP23008.setPin(MCP_Pins.RAK_LED, false)
            }
        }
    }
    else {      // Initial setup required
        runDeviceSetup()
    }
}
```

### Device Setup
Im DeviceSetup geht es darum, das LoRa Modul nach dem Start in eine Grundkonfiguration zu bringen. Dabei wird berücksichtigt, welche Einstellungen auf dem Modul gespeichert sind. 
```typescript
/**
 * Device Setup
 * Prepare LoRa Module, function is called by watchdog
 */
export function runDeviceSetup() {
    setStatus(eSTATUS_MASK.NJM, parseInt(getParameter(eRUI3_PARAM.NJM)))    // OTAA oder ABP?
    setStatus(eSTATUS_MASK.JOINED, parseInt(getParameter(eRUI3_PARAM.NJS))) // Netzwerk vebunden?
    let confJoin = getParameter(eRUI3_PARAM.JOIN)
    let strParam = confJoin.split(":")
    let intParam = []
    for (let j = 0; j < strParam.length; j++) {
        intParam[j] = parseInt(strParam[j])
    }
    setStatus(eSTATUS_MASK.AUTOJOIN, intParam[1])   // Verbinden beim Start aktiv?
    setStatus(eSTATUS_MASK.INIT, 1)             // Modul initialisiert
    setStatus(eSTATUS_MASK.READY, 1)            // Modul bereit
    if (getStatus(eSTATUS_MASK.AUTOJOIN)) {             
        setStatus(eSTATUS_MASK.CONNECT, 1)      // Aktiviere connect-Zustand falls Autojoin gesetzt
    }
}
```


### Serial listener
Das RAK Modul wird über UART angesteuert. Dazu werden **AT**-Befehle verwendet. Es gibt mehrere Typen von Nachrichten, die der RAK senden kann.
 - Return Codes werden nach Abschluss eines Befehls oder Anfrage gesendet.
 - Je nach Befehl werden Parameter zurückgegeben. Die Rückgabe des Parameters Erfolgt direkt nach dem Befehl.
 - Events werden selbstständig vom Modul gesendet. Desshalb ist es wichtig diese mit dem micro:bit zu erfassen.

```typescript
/**
 * Serial Listener
 * Runs in background loop to receive serial messages and react on payload
 */
export function serialListener() {
    let rc = -1
    let res = serial.readUntil("\r\n")
    if (res.length > 0) {
        res = res.replace("\r\n", "")
        for (let i = 0; i < strRAK_RC.length; i++) {
            if (res.includes(strRAK_RC[i])) {
                rc = i
            }
        }
        if (rc == -1) {
            if (res.includes("EVT")) {
                evtMessage = res    // Globaly store event message
                if (res.includes("+EVT:JOINED")) {
                    setEvent(eRAK_EVT.JOINED)
                    setStatus(eSTATUS_MASK.CONNECT, 0)
                    setStatus(eSTATUS_MASK.JOINED, 1)
                }
                else if (res.includes("+EVT:JOIN_FAILED")) {
                    setEvent(eRAK_EVT.JOIN_FAILED)
                    setStatus(eSTATUS_MASK.CONNECT, 1)
                    setStatus(eSTATUS_MASK.JOINED, 0)
                }
                else if (res.includes("+EVT:SEND_CONFIRMED_OK")) {
                    setEvent(eRAK_EVT.SEND_CONFIRMED_OK)
                }
                else if (res.includes("+EVT:SEND_CONFIRMED_FAILED")) {
                    setEvent(eRAK_EVT.SEND_CONFIRMED_FAILED)
                }
                else if (res.includes("+EVT:RX_1")) {
                    setEvent(eRAK_EVT.RX_1)
                }
                else if (res.includes("+EVT:RX_2")) {
                    setEvent(eRAK_EVT.RX_2)
                }
            }
            else {
                message = res
            }
        }
        else if (rc == eRAK_RC.OK) {
            if (getStatus(eSTATUS_MASK.SLEEP)) {
                setStatus(eSTATUS_MASK.SLEEP, 0)
                setStatus(eSTATUS_MASK.READY, 1)
            }
        }
    }
}
````

------------------------------------------------



<script src="https://makecode.com/gh-pages-embed.js"></script><script>makeCodeRender("{{ site.makecode.home_url }}", "{{ site.github.owner_name }}/{{ site.github.repository_name }}");</script>
