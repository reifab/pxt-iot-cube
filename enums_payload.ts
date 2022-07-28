// Gib deinen Code hier ein

enum eCAYENNE_TYPES {
    //% block="Digital Input"   // 1 byte
    DigitalInput = 0,          
    //% block="Digital Output"  // 1 byte
    DigitalOutput = 1,
    //% block="Analog Input"    // 2 bytes, 0.01 signed
    AnalogInput = 2,
    //% block="Analog Output"   // 2 bytes, 0.01 signed
    AnalogOutput = 3,

    //% block="Illuminance"     // 2 bytes, 1 lux unsigned
    Illuminance = 101,
    //% block="Presence"        // 1 byte, 1
    Presence = 102,
    //% block="Temperature"     // 2 bytes, 0.1°C signed
    Temperature = 103,
    //% block="Humidity"        // 1 byte, 0.5% unsigned
    Humidity = 104,

    //% block="Accelerometer"   // 2 bytes per axis, 0.001G
    Accelerometer = 113,
    //% block="Barometer"       // 2 bytes 0.1 hPa Unsigned
    Barometer = 115,
    //% block="Gyrometer"       // 2 bytes per axis, 0.01 °/s
    Gyrometer = 134,
    //% block="GPS_Location"    // 3 byte lon/lat 0.0001 °, 3 bytes alt 0.01m
    GPS_Location = 136,
}

const cCayenne = {
    DigitalInput: {code: 0, size: 1, factor: 1},
    DigitalOutput: { code: 1, size: 1, factor: 1 },
    AnalogInput: { code: 2, size: 2, factor: 0.01 },
    AnalogOutput: { code: 3, size: 2, factor: 0.01 },

    Illuminance: { code: 101, size: 2, factor: 1 },
    Presence: { code: 102, size: 1, factor: 1 },
    Temperature: {code: 103, size: 2, factor: 10},
    Humidity: {code: 104, size: 1, factor: 2},

    Accelerometer: { code: 113, size: 6, factor: 1000},
    Barometer: { code: 115, size: 2, factor: 10},

}


enum eCAYENNE_SIZE {
    // Data ID + Data Type + Data Size
    LPP_DIGITAL_INPUT_SIZE =     3,
    LPP_DIGITAL_OUTPUT_SIZE =    3,
    LPP_ANALOG_INPUT_SIZE =      4,
    LPP_ANALOG_OUTPUT_SIZE =     4,
    LPP_LUMINOSITY_SIZE =        4,
    LPP_PRESENCE_SIZE =          3,
    LPP_TEMPERATURE_SIZE =       4,
    LPP_RELATIVE_HUMIDITY_SIZE =   3,
        LPP_ACCELEROMETER_SIZE   =    8,
    LPP_BAROMETRIC_PRESSURE_SIZE = 4,
    LPP_GYROMETER_SIZE   =        8,
    LPP_GPS_SIZE          =       11
}