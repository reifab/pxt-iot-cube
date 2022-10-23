/**
 * RAK3172 LoRa Module
 * GBS St. Gallen, 2022
 */

input.onLogoEvent(TouchButtonEvent.Pressed, function () {
    IoTCube.togglePin(MCP_Pins.USR_LED)
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
        IoTCube.addAnalogInput(pins.analogReadPin(AnalogPin.P1), Channels.One)
        IoTCube.addTemperature(input.temperature(), Channels.One)
        IoTCube.SendBuffer(IoTCube.getCayenne(), Channels.One)
    }
})
