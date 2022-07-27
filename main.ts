/**
 * RAK3172 LoRa Module
 * GBS St. Gallen, 2022
 */

//% color="#00796b" icon="\uf1eb"
namespace LoRa {
    let rxStack = [""]
    let eventStack = [""]
    export let message = ""
    export let bufCayenneLPP = [0]
    bufCayenneLPP.pop()
    
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
                        if(res.includes("+EVT:JOINED")){
                            setStatus(eSTATUS_MASK.CONNECT, 0)
                            setStatus(eSTATUS_MASK.JOINED, 1)
                        }
                    }
                    else {
                        rxStack.push(res)
                        message = res
                    }
                }
                else if( rc == eRAK_RC.OK ){
                    if(getStatus(eSTATUS_MASK.SLEEP)){
                        setStatus(eSTATUS_MASK.SLEEP, 0)
                        setStatus(eSTATUS_MASK.READY, 1)
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

    //% blockId=getEVTStack
    //% block="Get EVT-Stack Item"
    //% advanced=true
    export function getEvtStack() {
        return eventStack.pop()
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
    //% advanced=false
    //% group="Device"
    export function setParameter(typ: eRUI3_PARAM, value: string) {
        let command = "AT+" + strRAK_PARAM[typ] + "=" + value
        writeSerial(command)
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

    //% blockId=DeviceReset
    //% block="Reset LoRa Module | Hard-Reset %hardReset"
    //% advanced=false
    //% group="Device"
    export function resetModule(hardReset: boolean) {
        if(hardReset){
            MCP23008.pin_set(MCP_Pins.RAK_RST, Logic_LV.enable)
            basic.pause(100)
            MCP23008.pin_set(MCP_Pins.RAK_RST, Logic_LV.disable)
        }
        else {
            writeSerial("ATZ")
        }
        setStatus(eSTATUS_MASK.ALL, 0)
    }

    //% blockId=DeviceSleep
    //% block="LoRa Module sleep for %time ms"
    //% advanced=false
    //% group="Device"
    export function sleep(time: number) {
        if(!getStatus(eSTATUS_MASK.SLEEP)){
            writeATCommand("SLEEP", time.toString())
            setStatus(eSTATUS_MASK.SLEEP, 1)
            setStatus(eSTATUS_MASK.READY, 0)
        }
    }

    //% blockId=DeviceConfigGet
    //% block="Load Device config"
    //% advanced=false
    //% group="Device"
    export function getDeviceConfig(){
        MCP23008.setupDefault()
        setStatus(eSTATUS_MASK.OTAA, parseInt(getParameter(eRUI3_PARAM.NJM)))
        setStatus(eSTATUS_MASK.JOINED, parseInt(getParameter(eRUI3_PARAM.NJS)))
        let confJoin = getParameter(eRUI3_PARAM.JOIN)
        let strParam = confJoin.split(":")
        let intParam = []
        for(let j=0; j<strParam.length; j++){
            intParam[j] = parseInt(strParam[j])
        }
        setStatus(eSTATUS_MASK.AUTOJOIN, intParam[1])
        setStatus(eSTATUS_MASK.INIT, 1)
        setStatus(eSTATUS_MASK.READY, 1)
        if(getStatus(eSTATUS_MASK.AUTOJOIN)){
            setStatus(eSTATUS_MASK.CONNECT, 1)
        }
    }

    //% blockId=DeviceWatchdog
    //% block="Watchdog"
    //% advanced=false
    //% group="Device"
    export function watchdog() {
        if(getStatus(eSTATUS_MASK.INIT)){
            if (!getStatus(eSTATUS_MASK.JOINED)) {
                setStatus(eSTATUS_MASK.JOINED, parseInt(getParameter(eRUI3_PARAM.NJS)))
            }

            if (getStatus(eSTATUS_MASK.JOINED)) {
                MCP23008.pin_set(MCP_Pins.RAK_LED, Logic_LV.enable)
            }
            else if (getStatus(eSTATUS_MASK.CONNECT)) {
                MCP23008.pin_toggle(MCP_Pins.RAK_LED)
                if (getStatus(eSTATUS_MASK.JOINED)) {
                    setStatus(eSTATUS_MASK.CONNECT, 0)
                }
            }
            else {
                MCP23008.pin_set(MCP_Pins.RAK_LED, Logic_LV.disable)
            }
            if (getStatus(eSTATUS_MASK.SLEEP)) {
                MCP23008.pin_set(MCP_Pins.RAK_LED, Logic_LV.disable)
            }
        }
        else {
            getDeviceConfig()
        }  
    }


    /**
     * Procedures
     */

    //% blockId="OTAASetup"
    //% block="OTAA Setup: AppEUI %AppEUI | DevEUI %DevEUI | AppKey %AppKey"
    //% group="Setup"
    export function OTAA_Setup(AppEUI: string, DevEUI: string, AppKey: string) {
        setParameter(eRUI3_PARAM.NWM, "1")              //Set work mode LoRaWAN
        setParameter(eRUI3_PARAM.NJM, "1")              //Set activation to OTAA
        setParameter(eRUI3_PARAM.CLASS, "A")            //Set class A
        setParameter(eRUI3_PARAM.BAND, eBands.EU868.toString())     //Set band EU868
        setParameter(eRUI3_PARAM.DEVEUI, DevEUI)
        setParameter(eRUI3_PARAM.APPEUI, AppEUI)
        setParameter(eRUI3_PARAM.APPKEY, AppKey)
        basic.pause(300)
        resetModule(false)
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
    export function LoRa_SendStr(data: string, chanNum: Channels,) {
        writeATCommand("SEND", chanNum + ":" + data)
    }

    //% blockId="LoRa_Send_Number"
    //% block="LoRa Send | number %data on channel %chanNum"
    //% group="Send"
    export function LoRa_SendInt(data: number, chanNum: Channels,) {
        writeATCommand("SEND", chanNum + ":" + data)
    }

    //% blockId="LoRa_Send_Buffer"
    //% block="LoRa Send | Buffer %data on channel %chanNum"
    //% group="Send"
    export function LoRa_SendBuffer(data: Buffer, chanNum: Channels,) {
        writeATCommand("SEND", chanNum + ":" + data.toHex())
    }

    /**
     * Payload CayenneLPP
     */

    //% blockId="CayenneLPP Buffer"
    //% block="Get CayenneLPP Buffer"
    //% group="Payload"
    export function getCayenneLPPBuffer(){
        return Buffer.fromArray(bufCayenneLPP)
    }

    //% blockId="CayenneLPP Clear Buffer"
    //% block="Clear CayenneLPP Buffer"
    //% group="Payload"
    export function clearCayenneLPPBuffer() {
        bufCayenneLPP = [0]
        bufCayenneLPP.pop()
    }

    //% blockId="CayenneLPP Buffer Add"
    //% block="Add %data to CayenneLPP Buffer"
    //% group="Payload"
    export function addCayenneLPPBuffer(data: Buffer){
        let newData = data.toArray(NumberFormat.Int8BE)
        for(let i=0; i<newData.length; i++){
            bufCayenneLPP.insertAt(bufCayenneLPP.length, newData[i])
        }     
    }

    //% blockId="CayenneLPP"
    //% block="CayenneLPP %channel %cType %data"
    //% group="Payload"
    export function formatCayenne(channel: Channels, cType: eCAYENNE_TYPES, data: number) {
        let frame = []
        frame.push(channel & 0xff)
        frame.push(cType & 0xff)
        switch (cType) {
            case eCAYENNE_TYPES.DigitalInput:
            case eCAYENNE_TYPES.DigitalOutput:
            case eCAYENNE_TYPES.Presence:
                frame.push(data & 0xff)
                break

            case eCAYENNE_TYPES.AnalogInput:
            case eCAYENNE_TYPES.AnalogOutput:
            case eCAYENNE_TYPES.Illuminance:
                data = data * 100
                frame.push((data & 0xff00) >> 8)
                frame.push(data & 0xff)
                break

            case eCAYENNE_TYPES.Temperature:
                data = parseTemperature(data)
                frame.push((data & 0xff00) >> 8)
                frame.push(data & 0xff)
                break
            case eCAYENNE_TYPES.Humidity:
                data = parseHumidity(data)
                frame.push(data & 0xff)
                break

            default:
        }
        return Buffer.fromArray(frame)
    }

    function parseTemperature(data: number): number {
        let temp = 0
        if (data < 0) {
            data = -data
            temp = temp | 0x8000
        }
        temp = temp | (data * 10)
        return temp
    }

    function parseHumidity(data: number): number {
        return (data * 2) & 0xff
    }

}
