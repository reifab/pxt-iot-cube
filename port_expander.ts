/**
* IoT-Wuerfel
* GBS St. Gallen, 2022
* 
* Port Expander
* This file defines the class for the MCP23008 port expander.
* The relevant functions are exported to the "IoTCube"-Namespace.
*/

// Enum defines
enum MCP_Defaults {
    I2C_ADDRESS = 0x20,
    IODIR = 0x18,
    GPIO = 0xff,
}

enum MCP_Regs {
    IODIR = 0x00,
    GPPU = 0x06,
    GPIO = 0x09,
    OLAT = 0x0A
}

enum MCP_Pins {
    RAK_RST = 0x01,
    RAK_LED = 0x02,
    LOG_RST = 0x04,
    GP3 = 0x08,
    GP4 = 0x10,
    OC1 = 0x20,
    OC2 = 0x40,
    USR_LED = 0x80
}

namespace IoTCube {
    export class MCP {
        address: number
        regGPIO: number

        //% Port expander setup
        constructor(address: number, iodir: number, gpio: number) {
            this.address = address
            this.write(MCP_Regs.IODIR, iodir)
            this.write(MCP_Regs.GPIO, gpio)
            this.regGPIO = this.read(MCP_Regs.GPIO)
        }

        //% Write to port expander register
        public write(register: MCP_Regs, value: number) {
            pins.i2cWriteNumber(this.address, register, NumberFormat.Int8LE, true)
            pins.i2cWriteNumber(this.address, value, NumberFormat.Int8LE, false)
        }

        //% Read from port expander register
        public read(register: MCP_Regs) {
            pins.i2cWriteNumber(this.address, register, NumberFormat.Int8LE, true)
            let value = pins.i2cReadNumber(this.address, NumberFormat.UInt8LE, false)
            if (register == MCP_Regs.GPIO) {
                this.regGPIO = value
            }
            return value
        }

        //% Get port expander pin value
        public getPin(pin: MCP_Pins) {
            let value = this.read(MCP_Regs.GPIO)
            this.regGPIO = value
            return (value & pin)
        }

        //% Set port expander pin to high / low
        public setPin(pin: MCP_Pins, value: boolean) {
            //let active = read(MCP_Regs.GPIO)
            let newValue = 0
            if (value == true) {
                newValue = this.regGPIO & (~pin)
            }
            else {
                newValue = this.regGPIO | pin
            }
            if (newValue != this.regGPIO) {
                this.write(MCP_Regs.OLAT, newValue)
                this.regGPIO = newValue
            }
        }

        //% Toggle port expander pin
        public togglePin(pin: MCP_Pins) {
            let active = this.read(MCP_Regs.GPIO)
            this.write(MCP_Regs.OLAT, active ^ pin)
            this.regGPIO = active ^ pin
        }
    }   

    //% blockId="MCP_Pin_Set"
    //% block="Set pin %pin to %value"
    //% value.shadow="toggleOnOff"
    //% group="Pins"
    export function setPin(pin: MCP_Pins, value: boolean){
        MCP23008.setPin(pin, value)
    }

    //% blockId="MCP_Pin_Get"
    //% block="Read pin %pin"
    //% group="Pins"
    export function getPin(pin: MCP_Pins) {
        return MCP23008.getPin(pin)
    }

    //% blockId="MCP_Pin_Toggle"
    //% block="Toggle pin %pin"
    //% group="Pins"
    export function togglePin(pin: MCP_Pins) {
        MCP23008.togglePin(pin)
    }
}