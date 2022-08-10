/**
 * RAK3172 LoRa Module
 * GBS St. Gallen, 2022
 */

/**
 * Loops for background tasks
 */
basic.forever(function() {
    LoRa.serialListener()
})

loops.everyInterval(1500, function() {
    LoRa.watchdog()
})

//% color="#00796b" icon="\uf1eb"
namespace LoRa {
    let message = ""
    let status = 0

    serial.redirect(SerialPin.P8, SerialPin.P13, BaudRate.BaudRate115200)
    serial.setRxBufferSize(32)

    /**
     * Communication
     */

    function writeSerial(command: string) {
        serial.writeString(command + "\r\n")
    }

    function readSerial(command: string) {
        return serial.readString()
    }

    //% blockId=GetLatestMessage
    //% block="Get serial message"
    //% advanced=true
    export function getSerialMessage() {
        return message
    }

    //% blockId=writeATCommand
    //% block="AT | Command %typ Paramter %value"
    //% advanced=true
    export function writeATCommand(typ: string, value: string){
        let command = "AT+" + typ + "=" + value
        writeSerial(command)
    }

    //% blockId=getParameter
    //% block="Get | Parameter %typ"
    //% advanced=true
    //% group="Device"
    export function getParameter(typ: eRUI3_PARAM) {
        let command = "AT+" + strRAK_PARAM[typ] + "=?"       
        basic.pause(30)
        writeSerial(command)
        basic.pause(70)
        return message.replace("AT+" + strRAK_PARAM[typ] + "=", "")
    }


    //% blockId=setParameter
    //% block="Set | Parameter %typ to %value"
    //% advanced=true
    //% group="Device"
    export function setParameter(typ: eRUI3_PARAM, value: string) {
        let command = "AT+" + strRAK_PARAM[typ] + "=" + value
        writeSerial(command)
    }

    /**
     * Background Processes
     */

    //% blockId=LoRaDeviceSetup
    //% block="Prepare LoRa Device"
    //% advanced=true
    //% group="Device"
    export function runDeviceSetup() {
        MCP23008.setup(MCP_Defaults.I2C_ADDRESS, MCP_Defaults.IODIR, MCP_Defaults.GPIO)
        setStatus(eSTATUS_MASK.NJM, parseInt(getParameter(eRUI3_PARAM.NJM)))
        setStatus(eSTATUS_MASK.JOINED, parseInt(getParameter(eRUI3_PARAM.NJS)))
        let confJoin = getParameter(eRUI3_PARAM.JOIN)
        let strParam = confJoin.split(":")
        let intParam = []
            for (let j = 0; j < strParam.length; j++) {
            intParam[j] = parseInt(strParam[j])
        }
        setStatus(eSTATUS_MASK.AUTOJOIN, intParam[1])
        setStatus(eSTATUS_MASK.INIT, 1)
        setStatus(eSTATUS_MASK.READY, 1)
        if (getStatus(eSTATUS_MASK.AUTOJOIN)) {
            setStatus(eSTATUS_MASK.CONNECT, 1)
        }
    }

    //% blockId=DeviceWatchdog
    //% block="Watchdog"
    //% advanced=true
    //% group="Handler"
    export function watchdog() {
        if (getStatus(eSTATUS_MASK.INIT)) {
            if(!getStatus(eSTATUS_MASK.SETUP)){
                if (!getStatus(eSTATUS_MASK.JOINED)) {
                    setStatus(eSTATUS_MASK.JOINED, parseInt(getParameter(eRUI3_PARAM.NJS)))
                }

                if (getStatus(eSTATUS_MASK.JOINED)) {
                    MCP23008.pin_set(MCP_Pins.RAK_LED, true)
                }
                else if (getStatus(eSTATUS_MASK.CONNECT)) {
                    MCP23008.pin_toggle(MCP_Pins.RAK_LED)
                    if (getStatus(eSTATUS_MASK.JOINED)) {
                        setStatus(eSTATUS_MASK.CONNECT, 0)
                    }
                }
                else {
                    MCP23008.pin_set(MCP_Pins.RAK_LED, false)
                }
                if (getStatus(eSTATUS_MASK.SLEEP)) {
                    MCP23008.pin_set(MCP_Pins.RAK_LED, false)
                }
            }
        }
        else {
            runDeviceSetup()
        }
    }

    //% blockId=SerialListener
    //% block="Serial Listener"
    //% advanced=true
    //% group="Handler"
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
                    if (res.includes("+EVT:JOINED")) {
                        setEvent(eRAK_EVT.JOINED)
                        setStatus(eSTATUS_MASK.CONNECT, 0)
                        setStatus(eSTATUS_MASK.JOINED, 1)
                    }
                    if (res.includes("+EVT:JOIN_FAILED")) {
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

    /**
     * Device Control
     */

    //% blockId=DeviceStatusSet
    //% block="Set Device Status Bit %mask to %state"
    //% advanced=true
    //% group="Device"
    export function setStatus(mask: eSTATUS_MASK, state: number){
        if (state){
            status = status | mask
        }
        else {
            status = status & (~mask)
        }
    }

    //% blockId=DeviceStatusGet
    //% block="Get Device Status Bit %mask"
    //% advanced=false
    //% group="Device"
    export function getStatus(mask: eSTATUS_MASK): boolean {
        if (status & mask){
            return true
        }
        return false
    }

    function setEvent(event: eRAK_EVT) {
        status = status | (0x01 << (event + 8))
    }

    function clearEvent(event: eRAK_EVT) {
        status = status & (~(0x01 << (event + 8)))
    }

    //% blockId="checkRAKEvent"
    //% block="Is event %event set?"
    //% group="Device"
    export function checkEvent(event: eRAK_EVT): boolean {
        if (status & (0x01 << (event + 8))) {
            clearEvent(event)
            return true
        }
        return false
    }

    //% blockId=DeviceReset
    //% block="Reset LoRa || Hard-Reset %hardReset"
    //% hardReset.shadow="toggleOnOff"
    //% hardReset.defl=false
    //% advanced=false
    //% group="Device"
    export function resetModule(hardReset?: boolean) {
        if(hardReset){
            MCP23008.pin_set(MCP_Pins.RAK_RST, true)
            basic.pause(100)
            MCP23008.pin_set(MCP_Pins.RAK_RST, false)
        }
        else {
            writeSerial("ATZ")
        }
        setStatus(eSTATUS_MASK.ALL, 0)
    }

    //% blockId=DeviceSleep
    //% block="LoRa sleep for %time ms"
    //% time.shadow=timePicker
    //% advanced=false
    //% group="Device"
    export function sleep(time: number) {
        if(!getStatus(eSTATUS_MASK.SLEEP)){
            writeATCommand("SLEEP", time.toString())
            setStatus(eSTATUS_MASK.SLEEP, 1)
            setStatus(eSTATUS_MASK.READY, 0)
        }
    }


    /**
     * Procedures
     */

    //% blockId="OTAASetup"
    //% block="OTAA Setup | AppEUI %AppEUI | DevEUI %DevEUI | AppKey %AppKey"
    //% group="Setup"
    export function OTAA_Setup(AppEUI: string, DevEUI: string, AppKey: string) {
        setStatus(eSTATUS_MASK.SETUP, 1)
        setParameter(eRUI3_PARAM.NWM, "1")              //Set work mode LoRaWAN
        basic.pause(50)
        setParameter(eRUI3_PARAM.NJM, "1")              //Set activation to OTAA
        basic.pause(50)
        setParameter(eRUI3_PARAM.CLASS, "A")            //Set class A
        basic.pause(50)
        setParameter(eRUI3_PARAM.BAND, eBands.EU868.toString())     //Set band EU868
        basic.pause(50)
        setParameter(eRUI3_PARAM.DEVEUI, DevEUI)
        basic.pause(50)
        setParameter(eRUI3_PARAM.APPEUI, AppEUI)
        basic.pause(50)
        setParameter(eRUI3_PARAM.APPKEY, AppKey)
        basic.pause(300)
        resetModule(false)
        setStatus(eSTATUS_MASK.SETUP, 0)
    }

    //% blockId="ABPSetup"
    //% block="ABP Setup | Device Address %DEVADDR | Application Session Key %APPSKEY | Network Session Key %NWKSKEY"
    //% group="Setup"
    export function ABP_Setup(DEVADDR: string, APPSKEY: string, NWKSKEY: string) {
        setStatus(eSTATUS_MASK.SETUP, 1)
        setParameter(eRUI3_PARAM.NWM, "1")              //Set work mode LoRaWAN
        basic.pause(50)
        setParameter(eRUI3_PARAM.NJM, "0")              //Set activation to ABP
        basic.pause(50)
        setParameter(eRUI3_PARAM.CLASS, "A")            //Set class A
        basic.pause(50)
        setParameter(eRUI3_PARAM.BAND, eBands.EU868.toString())     //Set band EU868
        basic.pause(50)
        setParameter(eRUI3_PARAM.DEVADDR, DEVADDR)
        basic.pause(50)
        setParameter(eRUI3_PARAM.APPSKEY, APPSKEY)
        basic.pause(50)
        setParameter(eRUI3_PARAM.NWKSKEY, NWKSKEY)
        basic.pause(300)
        resetModule(false)
        setStatus(eSTATUS_MASK.SETUP, 0)
    }
    
    //% blockId="Network_Join"
    //% block="LoRa Network Join | Join: %join | On Power-up: %auto_join"
    //% group="Setup"
    export function LoRa_Join(join: eBool, auto_join: eBool) {
        writeATCommand("JOIN", join + ":" + auto_join + ":10:8")
        setStatus(eSTATUS_MASK.CONNECT, 1)
    }

    //% blockId="LoRa_Send_String"
    //% block="LoRa Send | string %data on channel %chanNum"
    //% group="Send"
    //% data.shadowOptions.toString=true
    export function LoRa_SendStr(data: string, chanNum: Channels,) {
        writeATCommand("SEND", chanNum + ":" + data)
    }

    //% blockId="LoRa_Send_Buffer"
    //% block="LoRa Send | Buffer %data on channel %chanNum"
    //% group="Send"
    export function LoRa_SendBuffer(data: Buffer, chanNum: Channels,) {
        writeATCommand("SEND", chanNum + ":" + data.toHex())
    }

}
