/**
 * RAK3172 LoRa Module
 * GBS St. Gallen, 2022
 */


enum eRAK_RC {
    OK,                     //command runs correctly without error.
    AT_ERROR,               //generic error.
    AT_PARAM_ERROR,         //a parameter of the command is wrong
    AT_BUSY_ERROR,          // the LoRa® network is busy, so the command has not been completed.
    AT_TEST_PARAM_OVERFLOW, // the parameter is too long.
    AT_NO_CLASSB_ENABLE,    // End-node has not yet switched in Class B.
    AT_NO_NETWORK_JOINED,   // the LoRa® network has not been joined yet.
    AT_RX_ERROR             // error detection during the reception of the command.
}

const strRAK_RC = [
    "OK", "AT_ERROR", "AT_PARAM_ERROR", "AT_BUSY_ERROR", "AT_TEST_PARAM_OVERFLOW", "AT_NO_CLASSB_ENABLE",  "AT_NO_NETWORK_JOINED", "AT_RX_ERROR"
]

enum eRAK_EVT {
    JOIN_FAILED,
    JOINED,
    SEND_CONFIRMED_FAILED,
    SEND_CONFIRMED_OK,
    RX_1,
    RX_2,
    SETUP_FAILED,
    SETUP_SUCCECSS,
}

enum eBool {
    disable,   //disable represents 0
    enable     //enable represents 1
}

enum eBands {
    EU433,
    CN470,
    RU864,
    IN865,
    EU868,
    US915,
    AU915,
    KR920,
    AS923
}

enum Channels {
    //% block="One"    
    One = 1,
    //% block="Two"
    Two = 2,
    //% block="Three"
    Three = 3,
    //% block="Four"
    Four = 4,
    //% block="Five"
    Five = 5,
    //% block="Six"
    Six = 6,
    //% block="Seven"
    Seven = 7,
    //% block="Eight"
    Eight = 8,
    //% block="Nine"
    Nine = 9,
    //% block="Ten"
    Ten = 10,
    //% block="Eleven"
    Eleven = 11,
    //% block="Twelve"
    Twelve = 12,
    //% block="Thirteen"
    Thirteen = 13,
    //% block="Fourteen"
    Fourteen = 14,
    //% block="fifteen"
    Fifteen = 15,
    //% block="Sixteen"
    Sixteen = 16,
    //% block="Seventeen"
    Seventeen = 17,
    //% block="Eighteen"
    Eighteen = 18,
    //% block="Nineteen"
    Nineteen = 19,
    //% block="Twenty"
    Twenty = 20
}

enum eRUI3_CMD {
    VER = "VER",
    SLEEP = "SLEEP",
    JOIN = "JOIN"
}

const strRAK_PARAM = [
    "DEVEUI",
    "APPEUI",
    "APPKEY",
    "DEVADDR",
    "APPSKEY",
    "NWKSKEY",
    "NWM",
    "NJM",
    "NJS",
    "CLASS",
    "BAND",
    "JOIN",
    "RSSI",
    "VER",
    "LTIME",
    "RX1DL",
    "RX2DL",
    "RECV"
]

enum eRUI3_PARAM {
    DEVEUI,
    APPEUI,
    APPKEY,
    DEVADDR,
    APPSKEY,
    NWKSKEY,
    NWM,
    NJM,
    NJS,
    CLASS,
    BAND,
    JOIN,
    RSSI,
    VERSION,
    LTIME,
    RX1DL,
    RX2DL,
    RECV
}

enum eSTATUS_MASK {
    INIT = 0x01,
    SLEEP = 0x02,
    READY = 0x04,
    SETUP = 0x08,

    CONNECT = 0x10,
    AUTOJOIN = 0x20,
    JOINED = 0x40,
    NJM = 0x80,

    ALL = 0xFF
}

