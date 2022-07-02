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
    SEND_CONFIRMED_OK,
    SEND_CONFIRMED_FAILED
}

const strRAK_EVT = ["JOIN FAILED", "JOINED", "SEND CONFIRMED OK", "SEND CONFIRMED FAILED"]


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
    "JOIN"
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
    JOIN
}

enum eSTATUS_MASK {
    SLEEP = 0x01,
    READY = 0x02,

    AUTOJOIN = 0x10,
    JOINED = 0x20,
    OTAA = 0x40,
    ABP = 0x80,

    ALL = 0xFF
}