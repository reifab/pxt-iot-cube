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
    class CayenneLPP {
        _buffer: Buffer
        _cursor: number

        constructor(){
            this._buffer = Buffer.create(32)
            this._cursor = 0
        }
        
        public add(value: number){
            this._buffer.setUint8(this._cursor, value)
            this._cursor++
        }

        public clear() {
            this._buffer.fill(0, 0, this._buffer.length)
            this._cursor = 0
        }

        public get(): Buffer {
            let retBuf = this._buffer.chunked(this._cursor)[0]
            this.clear()
            return retBuf
        }

    }
    
    
    /**
     * Payload CayenneLPP
     */
    
    let Payload = new CayenneLPP()

    //% blockId="CayenneLPP_GetBuffer"
    //% block="Cayenne Buffer" 
    //% subcategory="CayenneLPP" group="Payload" weight=150
    export function getCayenne() {
        return Payload.get()
    }

    //% blockId="CayenneLPP_DigitalInput"
    //% block="Add Digital Input %data on Channel %channel"
    //% subcategory="CayenneLPP" group="Payload" weight=120
    export function addDigitalInput(data: number, channel: Channels) {
        Payload.add(channel)
        Payload.add(cCayenne.DigitalInput.code)
        Payload.add(data)
    }

    //% blockId="CayenneLPP_DigitalOutput"
    //% block="Add Digital Output %data on Channel %channel"
    //% subcategory="CayenneLPP" group="Payload" 
    export function addDigitalOutput(data: number, channel: Channels) {
        Payload.add(channel)
        Payload.add(cCayenne.DigitalOutput.code)
        Payload.add(data)
    }

    //% blockId="CayenneLPP_AnalogInput"
    //% block="Add Analog Input %data on Channel %channel"
    //% subcategory="CayenneLPP" group="Payload" weight=120
    export function addAnalogInput(data: number, channel: Channels) {
        Payload.add(channel)
        Payload.add(cCayenne.AnalogInput.code)
        data = data << 2 // cCayenne.AnalogInput.factor
        Payload.add(data >> 8)
        Payload.add(data)
    }

    //% blockId="CayenneLPP_AnalogOutput"
    //% block="Add Analog Output %data on Channel %channel"
    //% subcategory="CayenneLPP" group="Payload"
    export function addAnalogOutput(data: number, channel: Channels) {
        Payload.add(channel)
        //Payload.add(cCayenne.AnalogOutput.code)
        data = data << 2 // cCayenne.AnalogOutput.factor
        Payload.add(data >> 8)
        Payload.add(data)
    }

    //% blockId="CayenneLPP_Temperature"
    //% block="Add Temperature %data on Channel %channel"
    //% subcategory="CayenneLPP" group="Payload" weight=90
    export function addTemperature(data: number, channel: Channels){
        let temp = 0
        if (data < 0) {
            data = -data
            temp = temp | 0x8000
        }
        temp = temp | (data * 10)
        Payload.add(channel)
        Payload.add(cCayenne.Temperature.code)
        Payload.add(temp >> 8)
        Payload.add(temp)
    }

    //% blockId="CayenneLPP_Humidity"
    //% block="Add Humidity %data on Channel %channel"
    //% subcategory="CayenneLPP" group="Payload" weight=90
    export function addHumidity(data: number, channel: Channels) {
        Payload.add(channel)
        Payload.add(cCayenne.Humidity.code)
        data = (data * cCayenne.Humidity.factor)
        Payload.add(data)
    }

    //% blockId="CayenneLPP_Illuminance"
    //% block="Add Illuminance %data on Channel %channel"
    //% subcategory="CayenneLPP" group="Payload"
    export function addIlluminance(data: number, channel: Channels) {
        Payload.add(channel)
        Payload.add(cCayenne.Illuminance.code)
        data = data * cCayenne.Illuminance.factor
        Payload.add(data >> 8)
        Payload.add(data)
    }

    //% blockId="CayenneLPP_Presence"
    //% block="Add Presence %data on Channel %channel"
    //% subcategory="CayenneLPP" group="Payload"
    export function addPresence(data: number, channel: Channels) {
        Payload.add(channel)
        Payload.add(cCayenne.Presence.code)
        Payload.add(data)
    }

    //% blockId="CayenneLPP_Accelerometer"
    //% block="Add Accelerometer %data on Channel %channel"
    //% subcategory="CayenneLPP" group="Payload" weight=50
    export function addAccelerometer(x: number, y: number, z: number, channel: Channels) {
        Payload.add(channel)
        Payload.add(cCayenne.Accelerometer.code)
        x = x * 1000
        Payload.add(x >> 8)
        Payload.add(x)
        y = y * 1000
        Payload.add(y >> 8)
        Payload.add(y)
        z = z * 1000
        Payload.add(z >> 8)
        Payload.add(z)
    }

    //% blockId="CayenneLPP_Barometer"
    //% block="Add Barometer %data on Channel %channel"
    //% subcategory="CayenneLPP" group="Payload"
    export function addBarometer(data: number, channel: Channels) {
        Payload.add(channel)
        Payload.add(cCayenne.Barometer.code)
        Payload.add(data >> 8)
        Payload.add(data)
    }
}