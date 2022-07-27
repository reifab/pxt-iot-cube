/**
* IoT-Wuerfel
* GBS St. Gallen, 2022
*/

//% color="#ffb300" icon="\uf2db"
namespace MCP23008 {
    let i2c_addr = MCP_Defaults.I2C_ADDRESS

    //% blockId="MCP_Setup"
    //% block="MCP Setup | Address %address | IO-Config %iodir | IO-Value: %gpio"
    //% advanced=true
    //% group="Device"
    export function setup(address: number, iodir: number, gpio: number) {
        //i2c_addr = address
        i2c_write(MCP_Regs.IODIR, iodir)
        i2c_write(MCP_Regs.GPIO, gpio)
    }

    //% blockId="MCP_Setup_Default"
    //% block="MCP Setup"
    //% advanced=false
    //% group="Device"
    export function setupDefault() {
        i2c_write(MCP_Regs.IODIR, MCP_Defaults.IODIR)
        i2c_write(MCP_Regs.GPIO, MCP_Defaults.GPIO)
    }

    //% blockId="MCP_I2C_Write"
    //% block="MCP I2C Write to %register Data %value"
    //% advanced=true
    //% group="Device"
    export function i2c_write(register: MCP_Regs, value: number) {
        pins.i2cWriteNumber(0x20, register, NumberFormat.Int8LE, true)
        pins.i2cWriteNumber(0x20, value, NumberFormat.Int8LE, false)
    }


    //% blockId="MCP_I2C_Read"
    //% block="MCP read register %register"
    //% advanced=true
    //% group="Device"
    export function i2c_read(register: MCP_Regs) {
        pins.i2cWriteNumber(0x20, register, NumberFormat.Int8LE, true)
        return pins.i2cReadNumber(0x20, NumberFormat.UInt8LE, false)
    }

    //% blockId="MCP_Pin_Get"
    //% block="MCP Read pin %pin"
    //% advanced=false
    //% group="Control"
    export function pin_get(pin: MCP_Pins) {
        let value = i2c_read(MCP_Regs.GPIO)
        return (value & pin)
    }


    //% blockId="MCP_Pin_Set"
    //% block="MCP set pin %pin to %value"
    //% advanced=false
    //% group="Control"
    export function pin_set(pin: MCP_Pins, value: Logic_LV) {
        let active = i2c_read(MCP_Regs.GPIO)
        let newValue = 0
        if (value == Logic_LV.enable) {
            newValue = active & (~pin)
        }
        else {
            newValue = active | pin
        }
        i2c_write(MCP_Regs.GPIO, newValue)
    }

    //% blockId="MCP_Pin_Toggle"
    //% block="MCP toggle pin %pin"
    //% advanced=false
    //% group="Control"
    export function pin_toggle(pin: MCP_Pins) {
        let active = i2c_read(MCP_Regs.GPIO)
        i2c_write(MCP_Regs.GPIO, active ^ pin)
    }


}