/**
 * RAK3172 LoRa Module
 * GBS St. Gallen, 2022
 */

input.onLogoEvent(TouchButtonEvent.Pressed, function () {
    MCP23008.pin_toggle(MCP_Pins.USR_LED)
    LoRa.resetModule(false)
})
basic.showString("Test")
loops.everyInterval(1000, function () {
    LoRa.watchdog()
    if (LoRa.checkEvent(eRAK_EVT.JOINED)) {
        music.playTone(988, music.beat(BeatFraction.Eighth))
        basic.showIcon(IconNames.Yes)
    } else if (LoRa.checkEvent(eRAK_EVT.JOIN_FAILED)) {
        basic.showIcon(IconNames.No)
    } else {
        basic.showIcon(IconNames.Diamond)
        basic.pause(500)
        basic.showIcon(IconNames.SmallDiamond)
    }
})
loops.everyInterval(300000, function () {
    if (LoRa.getStatus(eSTATUS_MASK.JOINED)) {
        CayenneLPP.addAnalogInput(pins.analogReadPin(AnalogPin.P1), Channels.One)
        CayenneLPP.addTemperature(input.temperature(), Channels.One)
        LoRa.LoRa_SendBuffer(CayenneLPP.getBuffer(), Channels.One)
    }
})
basic.forever(function () {
    LoRa.serialListener()
})
