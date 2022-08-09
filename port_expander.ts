/**
* IoT-Wuerfel
* GBS St. Gallen, 2022
*/

//% color="#ffb300" icon="\uf2db"
namespace MCP23008 {
    let i2c_addr = MCP_Defaults.I2C_ADDRESS
    let regGPIO = 0x00

    //% blockId="MCP_Setup"
    //% block="MCP Setup | Address %address | IO-Config %iodir | IO-Value: %gpio"
    //% advanced=true
    //% group="Device"
    export function setup(address: number, iodir: number, gpio: number) {
        i2c_addr = address
        i2c_write(MCP_Regs.IODIR, iodir)
        i2c_write(MCP_Regs.GPIO, gpio)
        regGPIO = i2c_read(MCP_Regs.GPIO)
    }

    //% blockId="MCP_Setup_Default"
    //% block="MCP Setup"
    //% advanced=false
    //% group="Device"
    export function setupDefault() {
        i2c_write(MCP_Regs.IODIR, MCP_Defaults.IODIR)
        i2c_write(MCP_Regs.GPIO, MCP_Defaults.GPIO)
        regGPIO = i2c_read(MCP_Regs.GPIO)
    }

    //% blockId="MCP_I2C_Write"
    //% block="MCP I2C Write to %register Data %value"
    //% advanced=true
    //% group="Device"
    export function i2c_write(register: MCP_Regs, value: number) {
        pins.i2cWriteNumber(i2c_addr, register, NumberFormat.Int8LE, true)
        pins.i2cWriteNumber(i2c_addr, value, NumberFormat.Int8LE, false)
    }


    //% blockId="MCP_I2C_Read"
    //% block="MCP read register %register"
    //% advanced=true
    //% group="Device"
    export function i2c_read(register: MCP_Regs) {
        pins.i2cWriteNumber(i2c_addr, register, NumberFormat.Int8LE, true)
        let value = pins.i2cReadNumber(i2c_addr, NumberFormat.UInt8LE, false)
        if (register == MCP_Regs.GPIO){
            regGPIO = value
        }
        return value
    }

    //% blockId="MCP_Pin_Get"
    //% block="MCP Read pin %pin"
    //% advanced=false
    //% group="Control"
    export function pin_get(pin: MCP_Pins) {
        let value = i2c_read(MCP_Regs.GPIO)
        regGPIO = value
        return (value & pin)
    }


    //% blockId="MCP_Pin_Set"
    //% block="MCP set pin %pin to %value"
    //% value.shadow="toggleOnOff"
    //% advanced=false
    //% group="Control"
    export function pin_set(pin: MCP_Pins, value: boolean) {
        //let active = i2c_read(MCP_Regs.GPIO)
        let newValue = 0
        if (value == true) {
            newValue = regGPIO & (~pin)
        }
        else {
            newValue = regGPIO | pin
        }
        if(newValue != regGPIO){
            i2c_write(MCP_Regs.OLAT, newValue)
            regGPIO = newValue
        }
    }

    //% blockId="MCP_Pin_Toggle"
    //% block="MCP toggle pin %pin"
    //% advanced=false
    //% group="Control"
    export function pin_toggle(pin: MCP_Pins) {
        let active = i2c_read(MCP_Regs.GPIO)
        i2c_write(MCP_Regs.OLAT, active ^ pin)
        regGPIO = active ^ pin
    }
}