/**
* IoT-Wuerfel
* GBS St. Gallen, 2022
*
* CayenneLPP
* This file implements the CayenneLPP format for the data transmission.
*/

namespace IoTCube {
    /**
     * Buffer CayenneLPP
     */

    let CyBuffer = Buffer.create(32)
    let CyIndexW = 0


    function writeCayenneBuffer(value: number){
        CyBuffer.setUint8(CyIndexW, value)
        CyIndexW++
    }

    function clearCayenneBuffer(){
        CyBuffer.fill(0, 0, CyBuffer.length)
        CyIndexW = 0
    }

    //% blockId=Cayenne_getBuffer
    //% block="Cayenne Buffer"
    //% subcategory="CayenneLPP"
    export function getCayenneBuffer(): Buffer{
        let retBuf = CyBuffer.chunked(CyIndexW)[0]
        clearCayenneBuffer()
        return retBuf
    }

    /**
     * Payload CayenneLPP
     */

    //% blockId="CayenneLPP_DigitalInput"
    //% block="Add Digital Input %data on Channel %channel"
    //% subcategory="CayenneLPP" group="Payload"
    export function addDigitalInput(data: number, channel: Channels) {
        writeCayenneBuffer(channel)
        writeCayenneBuffer(cCayenne.DigitalInput.code)
        writeCayenneBuffer(data)
    }

    //% blockId="CayenneLPP_DigitalOutput"
    //% block="Add Digital Output %data on Channel %channel"
    //% subcategory="CayenneLPP" group="Payload"
    export function addDigitalOutput(data: number, channel: Channels) {
        writeCayenneBuffer(channel)
        writeCayenneBuffer(cCayenne.DigitalOutput.code)
        writeCayenneBuffer(data)
    }

    //% blockId="CayenneLPP_AnalogInput"
    //% block="Add Analog Input %data on Channel %channel"
    //% subcategory="CayenneLPP" group="Payload"
    export function addAnalogInput(data: number, channel: Channels) {
        writeCayenneBuffer(channel)
        writeCayenneBuffer(cCayenne.AnalogInput.code)
        data = data << 2 // cCayenne.AnalogInput.factor
        writeCayenneBuffer(data >> 8)
        writeCayenneBuffer(data)
    }

    //% blockId="CayenneLPP_AnalogOutput"
    //% block="Add Analog Output %data on Channel %channel"
    //% subcategory="CayenneLPP" group="Payload"
    export function addAnalogOutput(data: number, channel: Channels) {
        writeCayenneBuffer(channel)
        //writeCayenneBuffer(cCayenne.AnalogOutput.code)
        data = data << 2 // cCayenne.AnalogOutput.factor
        writeCayenneBuffer(data >> 8)
        writeCayenneBuffer(data)
    }

    //% blockId="CayenneLPP_Temperature"
    //% block="Add Temperature %data on Channel %channel"
    //% subcategory="CayenneLPP" group="Payload"
    export function addTemperature(data: number, channel: Channels){
        let temp = 0
        if (data < 0) {
            data = -data
            temp = temp | 0x8000
        }
        temp = temp | (data * 10)
        writeCayenneBuffer(channel)
        writeCayenneBuffer(cCayenne.Temperature.code)
        writeCayenneBuffer(temp >> 8)
        writeCayenneBuffer(temp)
    }

    //% blockId="CayenneLPP_Humidity"
    //% block="Add Humidity %data on Channel %channel"
    //% subcategory="CayenneLPP" group="Payload"
    export function addHumidity(data: number, channel: Channels) {
        writeCayenneBuffer(channel)
        writeCayenneBuffer(cCayenne.Humidity.code)
        data = (data * cCayenne.Humidity.factor)
        writeCayenneBuffer(data)
    }

    //% blockId="CayenneLPP_Illuminance"
    //% block="Add Illuminance %data on Channel %channel"
    //% subcategory="CayenneLPP" group="Payload"
    export function addIlluminance(data: number, channel: Channels) {
        writeCayenneBuffer(channel)
        writeCayenneBuffer(cCayenne.Illuminance.code)
        data = data * cCayenne.Illuminance.factor
        writeCayenneBuffer(data >> 8)
        writeCayenneBuffer(data)
    }

    //% blockId="CayenneLPP_Presence"
    //% block="Add Presence %data on Channel %channel"
    //% subcategory="CayenneLPP" group="Payload"
    export function addPresence(data: number, channel: Channels) {
        writeCayenneBuffer(channel)
        writeCayenneBuffer(cCayenne.Presence.code)
        writeCayenneBuffer(data)
    }

    //% blockId="CayenneLPP_Accelerometer"
    //% block="Add Accelerometer %data on Channel %channel"
    //% subcategory="CayenneLPP" group="Payload"
    export function addAccelerometer(x: number, y: number, z: number, channel: Channels) {
        writeCayenneBuffer(channel)
        writeCayenneBuffer(cCayenne.Accelerometer.code)
        x = x * 1000
        writeCayenneBuffer(x >> 8)
        writeCayenneBuffer(x)
        y = y * 1000
        writeCayenneBuffer(y >> 8)
        writeCayenneBuffer(y)
        z = z * 1000
        writeCayenneBuffer(z >> 8)
        writeCayenneBuffer(z)
    }

    //% blockId="CayenneLPP_Barometer"
    //% block="Add Barometer %data on Channel %channel"
    //% subcategory="CayenneLPP" group="Payload"
    export function addBarometer(data: number, channel: Channels) {
        writeCayenneBuffer(channel)
        writeCayenneBuffer(cCayenne.Barometer.code)
        writeCayenneBuffer(data >> 8)
        writeCayenneBuffer(data)
    }
}