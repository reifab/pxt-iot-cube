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

    export let bufCayenneLPP = [0]
    bufCayenneLPP.pop()

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
}