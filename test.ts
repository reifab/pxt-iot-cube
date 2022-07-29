// Hier kann man Tests durchführen; diese Datei wird nicht kompiliert, wenn dieses Paket als Erweiterung verwendet wird.

basic.showString("Test")

input.onLogoEvent(TouchButtonEvent.Pressed, function () {
    MCP23008.pin_toggle(MCP_Pins.USR_LED)
    LoRa.resetModule(false)
})
loops.everyInterval(2000, function () {
    LoRa.watchdog()
    if (LoRa.checkEvent(eRAK_EVT.JOINED)) {
        music.playTone(988, music.beat(BeatFraction.Eighth))
        basic.showIcon(IconNames.Yes)
    } else if (LoRa.checkEvent(eRAK_EVT.JOIN_FAILED)) {
        basic.showIcon(IconNames.No)
    } else {
        basic.clearScreen()
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

