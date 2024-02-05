/**
 * RAK3172 LoRa Module
 * Smartfeld, 2024
 */

input.onLogoEvent(TouchButtonEvent.Pressed, function () {
    IoTCube.togglePin(MCP_Pins.LED1)
    IoTCube.resetModule()
})
basic.showString("Test")
loops.everyInterval(1000, function () {
    if (IoTCube.checkEvent(eRAK_EVT.JOINED)) {
        music.playTone(988, music.beat(BeatFraction.Eighth))
        basic.showIcon(IconNames.Yes)
    } else if (IoTCube.checkEvent(eRAK_EVT.JOIN_FAILED)) {
        basic.showIcon(IconNames.No)
    } else {
        basic.showIcon(IconNames.Diamond)
        basic.pause(500)
        basic.showIcon(IconNames.SmallDiamond)
    }
})
loops.everyInterval(60000, function () {
    if (IoTCube.getStatus(eSTATUS_MASK.JOINED)) {
        IoTCube.addAnalogInput(pins.analogReadPin(AnalogPin.P1), 1)
        IoTCube.addTemperature(input.temperature(), 1)
        IoTCube.SendBuffer(IoTCube.getCayenne(), 1)
    }
})

IoTCube.DownlinkEvent(function (channel, value) {
    music.playTone(988, music.beat(BeatFraction.Whole))
    if (channel == 10) {
        if (value > 0) {
            IoTCube.setPin(MCP_Pins.LED1, true)
        } else {
            IoTCube.setPin(MCP_Pins.LED1, false)
        }
    }
})
