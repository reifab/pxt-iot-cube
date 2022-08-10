/**
 * RAK3172 LoRa Module
 * GBS St. Gallen, 2022
 */

input.onLogoEvent(TouchButtonEvent.Pressed, function () {
    IoTCube.MCP23008.togglePin(MCP_Pins.USR_LED)
    IoTCube.resetModule(false)
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
loops.everyInterval(300000, function () {
    if (IoTCube.getStatus(eSTATUS_MASK.JOINED)) {
        CayenneLPP.addAnalogInput(pins.analogReadPin(AnalogPin.P1), Channels.One)
        CayenneLPP.addTemperature(input.temperature(), Channels.One)
        IoTCube.LoRa_SendBuffer(CayenneLPP.getBuffer(), Channels.One)
    }
})
