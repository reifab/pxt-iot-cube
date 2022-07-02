namespace LoRa {
    let rxStack = [""]
    let eventStack = [""]
    export let message = ""

    let status = 0
    let FLAG_MSG_REQ = 0

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

    //% blockId=SerialListener
    //% block="Serial Listener"
    //% advanced=true
    export function serialListener(){
        let rc = -1
        if (FLAG_MSG_REQ == 0) {
            let res = serial.readUntil("\r\n")
            if (res.length > 0) {
                res = res.replace("\r\n", "")
                for(let i=0; i<strRAK_RC.length; i++){
                    if(res.includes(strRAK_RC[i])){
                        rc = i
                    }
                }
                if( rc == -1){
                    if (res.includes("EVT")) {
                        eventStack.push(res)
                    }
                    else {
                        rxStack.push(res)
                        message = res
                    }
                }
            }
        }
    }

    //% blockId=getRxStack
    //% block="Get RX-Stack Item"
    //% advanced=true
    export function getRxStack(){
        return rxStack.pop()
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
    //% advanced=false
    export function getParameter(typ: eRUI3_PARAM) {
        let command = "AT+" + strRAK_PARAM[typ] + "=?"       
        writeSerial(command)
        basic.pause(100)
        return message.replace("AT+" + strRAK_PARAM[typ] + "=", "")
    }

    //% blockId=setParameter
    //% block="Set | Parameter %typ to %value"
    //% advanced=false
    export function setParameter(typ: eRUI3_PARAM, value: string) {
        let command = "AT+" + strRAK_PARAM[typ] + "=" + value
        writeSerial(command)
    }

    /**
     * Device Control
     */
    //% blockId=DeviceStatusSet
    //% block="Set Device Status Bit %mask to %state"
    //% advanced=false
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
    //% advanced=true
    export function getStatus(mask: eSTATUS_MASK) {
        return (status & mask)
    }

    //% blockId=DeviceReset
    //% block="Reset LoRa Module"
    //% advanced=true
    export function resetModule() {
        writeSerial("ATZ")
    }

    //% blockId=DeviceSleep
    //% block="LoRa Module sleep for %time ms"
    //% advanced=true
    export function sleep(time: number) {
        writeATCommand("SLEEP", time.toString())
    }

    //% blockId=DeviceConfigGet
    //% block="Load Device config"
    //% advanced=false
    export function getDeviceConfig(){
        setStatus(eSTATUS_MASK.OTAA, parseInt(getParameter(eRUI3_PARAM.NJM)))
        setStatus(eSTATUS_MASK.JOINED, parseInt(getParameter(eRUI3_PARAM.NJS)))
        let confJoin = getParameter(eRUI3_PARAM.JOIN)
        let strParam = confJoin.split(":")
        let intParam = []
        for(let i=0; i<strParam.length; i++){
            intParam[i] = parseInt(strParam[i])
        }
        setStatus(eSTATUS_MASK.AUTOJOIN, intParam[1])
    }


    /**
     * Procedures
     */

    //% blockId="OTAASetup"
    //% block="OTAA Setup: AppEUI %AppEUI | DevEUI %DevEUI | AppKey %AppKey"
    export function OTAA_Setup(AppEUI: string, DevEUI: string, AppKey: string) {
        setParameter(eRUI3_PARAM.NWM, "1")              //Set work mode LoRaWAN
        setParameter(eRUI3_PARAM.NJM, "1")              //Set activation to OTAA
        setParameter(eRUI3_PARAM.CLASS, "A")            //Set class A
        setParameter(eRUI3_PARAM.BAND, eBands.EU868.toString())     //Set band EU868
        setParameter(eRUI3_PARAM.DEVEUI, DevEUI)
        setParameter(eRUI3_PARAM.APPEUI, AppEUI)
        setParameter(eRUI3_PARAM.APPKEY, AppKey)
        basic.pause(300)
        resetModule()
    }
    
    //% blockId="Network_Join"
    //% block="LoRa Network Join | Join: %join | On Power-up: %auto_join"
    export function LoRa_Join(join: eBool, auto_join: eBool) {
        writeATCommand("JOIN", join + ":" + auto_join + ":10:8")
    }

    //% blockId="LoRa_Send"
    //% block="LoRa Send | data %data on channel %chanNum"
    export function LoRa_Send(data: string, chanNum: Channels,) {
        writeATCommand("SEND", chanNum + ":" + data)
    }
}
