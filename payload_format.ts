/**
 * IoT-Würfel
 * Payload formatters
 * GBS St. Gallen, 2022
 */

//% color="#03a9f4" icon="\uf1dd"
namespace CayenneLPP {
    /**
     * Payload CayenneLPP
     */

    let CyBuffer = Buffer.create(32)
    let CyIndexR = 0
    let CyIndexW = 0
    export let bufCayenneLPP = [0]
    bufCayenneLPP.pop()

    function writeBuffer(value: number){
        CyBuffer.setUint8(CyIndexW, value)
        CyIndexW++
    }

    function clearBuffer(){
        CyBuffer.fill(0, 0, CyBuffer.length)
        CyIndexW = 0
        CyIndexR = 0
    }

    //% blockId=Cayenne_getBuffer
    //% block="Get Buffer"
    export function getBuffer(): Buffer{
        let retBuf = CyBuffer.chunked(CyIndexW)[0]
        clearBuffer()
        return retBuf
    }


    //% blockId="CayenneLPP Buffer"
    //% block="Get CayenneLPP Buffer"
    //% group="Payload"
    export function getCayenneLPPBuffer() {
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
    export function addCayenneLPPBuffer(data: Buffer) {
        let newData = data.toArray(NumberFormat.Int8BE)
        for (let i = 0; i < newData.length; i++) {
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

    //% blockId="CayenneLPP_DigitalInput"
    //% block="Add Digital Input %data on Channel %channel"
    //% group="Payload"
    export function addDigitalInput(data: number, channel: Channels) {
        writeBuffer(channel)
        writeBuffer(cCayenne.DigitalInput.code)
        writeBuffer(data & 0xff)
    }

    //% blockId="CayenneLPP_AnalogInput"
    //% block="Add Analog Input %data on Channel %channel"
    //% group="Payload"
    export function addAnalogInput(data: number, channel: Channels) {
        writeBuffer(channel)
        writeBuffer(cCayenne.AnalogInput.code)
        data = data * cCayenne.AnalogInput.factor
        writeBuffer(((data >> 8) & 0xff))
        writeBuffer(data & 0xff)
    }

    //% blockId="CayenneLPP_Temperature"
    //% block="Add Temperature %data on Channel %channel"
    //% group="Payload"
    export function addTemperature(data: number, channel: Channels){
        writeBuffer(channel)
        writeBuffer(cCayenne.Temperature.code)
        data = parseTemperature(data)
        writeBuffer(((data >> 8) & 0xff))
        writeBuffer(data & 0xff)
    }

    //% blockId="CayenneLPP_Humidity"
    //% block="Add Humidity %data on Channel %channel"
    //% group="Payload"
    export function addHumidity(data: number, channel: Channels) {
        writeBuffer(channel)
        writeBuffer(cCayenne.Humidity.code)
        data = parseHumidity(data)
        writeBuffer(data & 0xff)
    }

    //% blockId="CayenneLPP_Illuminance"
    //% block="Add Illuminance %data on Channel %channel"
    //% group="Payload"
    export function addIlluminance(data: number, channel: Channels) {
        writeBuffer(channel)
        writeBuffer(cCayenne.Illuminance.code)
        data = data * cCayenne.Illuminance.factor
        writeBuffer(((data >> 8) & 0xff))
        writeBuffer(data & 0xff)
    }
}