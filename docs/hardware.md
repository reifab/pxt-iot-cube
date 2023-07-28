# Hardware

Der IoT-Würfel besteht aus micro:bit, Erweiterungsboard und einem 3D-Druck Gehäuse. Weiter können individuelle Grove Sensoren am Gehäuse befestigt werden. Dieser Teil der Dokumentation dient der Referenz zu IoT-Würfel spezifischen Eigenschaften, welche bei der Verwendung zu berücksichtigen sind.

| Vorderseite                            | Rückseite                            |
| -------------------------------------- | ------------------------------------ |
| ![Front Label](assets/Front Label.png) | ![Rear Label](assets/Rear Label.png) |

### Anschlüsse

Auf der Rückseite befinden sich die Anschlüsse des Erweiterungsboards.

#### Schraubklemme

Die Schraubklemme (grün) hat 4 Anschlüsse für Litzen. 

Von links nach rechts:

| Speisung +   | Speisung - (GND)               | Open Collector 1                                             | Open Collector 2                                             |
| ------------ | ------------------------------ | ------------------------------------------------------------ | ------------------------------------------------------------ |
| Maximal 15 V | Referenzpunkt für die Speisung | Ansteuern von Lasten (z.B. LED Streifen) mit einem höheren Potenzial | Ansteuern von Lasten (z.B. LED Streifen) mit einem höheren Potenzial |

#### Micro USB

Der Micro USB dient zur einfachen Speisung mit 5 V. Die Datenleitungen vom USB werden nicht verwendet und sind für die Speisung optimiert.

#### Debug (optional)

Ein Pin-Socket mit 10 Anschlüssen ermöglicht den Zugriff auf Interne Komponenten und wird nur für Fehlerbehebung und Firmware Update des LoRa Moduls verwendet.

#### QWIIC

Der [qwiic](https://www.sparkfun.com/qwiic) Anschluss ist ein Standard von sparkfun und basiert auf I2C. Über diesen Anschluss können weitere Module angeschlossen werden. Die Speisung mit 3.3 V sowie Clock und Data sind vorhanden



