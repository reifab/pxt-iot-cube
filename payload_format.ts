/**
 * IoT-Würfel
 * Payload formatters
 * GBS St. Gallen, 2022
 */

//% color="#03a9f4" icon="\uf1dd"
namespace CayenneLPP {
    /**
     * Buffer CayenneLPP
     */

    let CyBuffer = Buffer.create(32)
    let CyIndexW = 0


    function writeBuffer(value: number){
        CyBuffer.setUint8(CyIndexW, value)
        CyIndexW++
    }

    function clearBuffer(){
        CyBuffer.fill(0, 0, CyBuffer.length)
        CyIndexW = 0
    }

    //% blockId=Cayenne_getBuffer
    //% block="Get Buffer"
    export function getBuffer(): Buffer{
        let retBuf = CyBuffer.chunked(CyIndexW)[0]
        clearBuffer()
        return retBuf
    }

    /**
     * Payload CayenneLPP
     */

    //% blockId="CayenneLPP_DigitalInput"
    //% block="Add Digital Input %data on Channel %channel"
    //% group="Payload"
    export function addDigitalInput(data: number, channel: Channels) {
        writeBuffer(channel)
        writeBuffer(cCayenne.DigitalInput.code)
        writeBuffer(data)
    }

    //% blockId="CayenneLPP_DigitalOutput"
    //% block="Add Digital Output %data on Channel %channel"
    //% group="Payload"
    export function addDigitalOutput(data: number, channel: Channels) {
        writeBuffer(channel)
        writeBuffer(cCayenne.DigitalOutput.code)
        writeBuffer(data)
    }

    //% blockId="CayenneLPP_AnalogInput"
    //% block="Add Analog Input %data on Channel %channel"
    //% group="Payload"
    export function addAnalogInput(data: number, channel: Channels) {
        writeBuffer(channel)
        writeBuffer(cCayenne.AnalogInput.code)
        data = data << 2 // cCayenne.AnalogInput.factor
        writeBuffer(data >> 8)
        writeBuffer(data)
    }

    //% blockId="CayenneLPP_AnalogOutput"
    //% block="Add Analog Output %data on Channel %channel"
    //% group="Payload"
    export function addAnalogOutput(data: number, channel: Channels) {
        writeBuffer(channel)
        //writeBuffer(cCayenne.AnalogOutput.code)
        data = data << 2 // cCayenne.AnalogOutput.factor
        writeBuffer(data >> 8)
        writeBuffer(data)
    }

    //% blockId="CayenneLPP_Temperature"
    //% block="Add Temperature %data on Channel %channel"
    //% group="Payload"
    export function addTemperature(data: number, channel: Channels){
        let temp = 0
        if (data < 0) {
            data = -data
            temp = temp | 0x8000
        }
        temp = temp | (data * 10)
        writeBuffer(channel)
        writeBuffer(cCayenne.Temperature.code)
        writeBuffer(temp >> 8)
        writeBuffer(temp)
    }

    //% blockId="CayenneLPP_Humidity"
    //% block="Add Humidity %data on Channel %channel"
    //% group="Payload"
    export function addHumidity(data: number, channel: Channels) {
        writeBuffer(channel)
        writeBuffer(cCayenne.Humidity.code)
        data = (data * cCayenne.Humidity.factor)
        writeBuffer(data)
    }

    //% blockId="CayenneLPP_Illuminance"
    //% block="Add Illuminance %data on Channel %channel"
    //% group="Payload"
    export function addIlluminance(data: number, channel: Channels) {
        writeBuffer(channel)
        writeBuffer(cCayenne.Illuminance.code)
        data = data * cCayenne.Illuminance.factor
        writeBuffer(data >> 8)
        writeBuffer(data)
    }

    //% blockId="CayenneLPP_Presence"
    //% block="Add Presence %data on Channel %channel"
    //% group="Payload"
    export function addPresence(data: number, channel: Channels) {
        writeBuffer(channel)
        writeBuffer(cCayenne.Presence.code)
        writeBuffer(data)
    }

    //% blockId="CayenneLPP_Accelerometer"
    //% block="Add Accelerometer %data on Channel %channel"
    //% group="Payload"
    export function addAccelerometer(x: number, y: number, z: number, channel: Channels) {
        writeBuffer(channel)
        writeBuffer(cCayenne.Accelerometer.code)
        x = x * 1000
        writeBuffer(x >> 8)
        writeBuffer(x)
        y = y * 1000
        writeBuffer(y >> 8)
        writeBuffer(y)
        z = z * 1000
        writeBuffer(z >> 8)
        writeBuffer(z)
    }

    //% blockId="CayenneLPP_Barometer"
    //% block="Add Barometer %data on Channel %channel"
    //% group="Payload"
    export function addBarometer(data: number, channel: Channels) {
        writeBuffer(channel)
        writeBuffer(cCayenne.Barometer.code)
        writeBuffer(data >> 8)
        writeBuffer(data)
    }
}