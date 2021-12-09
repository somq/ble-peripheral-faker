# ble-peripheral-faker

> 📄 ➙ 🥸📡 Feed me with a JSON file and I will mock you a BLE peripheral with fake notifies and reponses to read in no time!

## Table of Contents

- [ble-peripheral-faker](#ble-peripheral-faker)
  - [Table of Contents](#table-of-contents)
  - [Features](#features)
  - [Install](#install)
  - [Usage](#usage)
  - [Todo](#todo)
  - [License](#license)
    - [MIT License](#mit-license)

## Features

**ble-peripheral-faker is build on top of [bleno](https://github.com/sandeepmistry/bleno)**.

> Simply build a JSON file respecting the [described format](#usage) and the module will care of mouting a gatt server as a ble peripheral with random values to read and notifies at random times from your JSON file.

- Ble peripheral
  - Custom services and characteristics from the JSON file
  - Automatic random values to read and notified from an array in the JSON file
  - Notifies are triggered by a random timer using a min and a max value set in the JSON file

## Install

```sh
git clone https://github.com/somq/ble-peripheral-faker.git
cd ble-peripheral-faker
npm i
npm start -- example-peripheral.json
```

Troubleshoot

> Under the hood, this tool uses a [fork](https://github.com/abandonware/bleno) of [Bleno](https://github.com/noble/bleno)  
> In case of dependency build/start issue, please refer to the [Bleno docs](https://github.com/abandonware/bleno#bleno)  
> A good starting point is to install [core dependencies](https://github.com/abandonware/bleno#prerequisites) and rebuild dependencies with `npm rebuild`

## Usage

JSON file must respect the following format:

```json
{
  "name": "PheripheralName",
  "advertising": ["0x01", "0x02"],
  "advertisementData": [3, 25, 0, 0, 2, 1, 5, 3, 3, 10, 24, 19, 9, 79, 67, 80, 67, 99, 54, 32, 35, 49, 57, 57, 57, 56, 56, 56, 48, 48, 48],
  "scanData": [30, 255, 255, 255, 26, 255, 65, 25, 0, 76, 0, 0, 67, 0, 0, 83, 0, 0, 87, 0, 0, 0, 0, 0, 0, 0, 84, 0, 0, 0, 0],
  "services":
  [
    {
        "uuid": "A7561523-258B-D820-E096-7C7C2190E980",
        "characteristics": [
          {
              "uuid": "A7561524-258B-D820-E096-7C7C2190E980",
              "properties": [
                "read",
                "notify"
              ],
              "characteristicName": "BOX_STATUS",
              "notifyValues": ["0x19", "0x1E", "0x54", "0x26", "0x2B", "0x16", "0x47", "0x48", "0x1F", "0x20", "0x21", "0x6F", "0x0E", "0x2E", "0x30", "0x31", "0x32", "0x33", "0x34", "0x35", "0x36", "0xB1", "0xB3", "0xB5", "0x90", "0x91", "0x92", "0xFD", "0xFE"],
              "notifyIntervalMax": 15,
              "notifyIntervalMin": 1
              ...
```

| property                     | value description                                                                                                                                        |
| ---------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| name                         | the name you wish to give to your peripheral                                                                                                             |
| advertising                  | classic advertising values                                                                                                                               |
| advertisementData & scanData | EIR formated advertising data                                                                                                                            |
| services                     | an array of objects each containing service data                                                                                                         |
| uuid                         | uuid of your service                                                                                                                                     |
| characteristics              | an array of objects each containing characteristic data                                                                                                  |
| properties                   | an array of strings containing characteristics properties (refer to [bleno doc.](https://github.com/sandeepmistry/bleno#characteristic))                 |
| characteristicName           | a string identifying a characteristic                                                                                                                    |
| notifyValues                 | an array of strings containing hex-string. This is the values used to notify or respond to read on the characteristic                                    |
| notifyIntervalMax            | a int used to set the max interval time <br> _Notifies are triggered at a random time between one of the notifyIntervalMin and notifyIntervalMax values_ |
| notifyIntervalMin            | a int used to set the min interval time <br> _Notifies are triggered at a random time between one of the notifyIntervalMin and notifyIntervalMax values_ |

## Todo

Implement random automatic response on write when writeWithoutResponse is false.

## License

### MIT License

Copyright (c) 2018 somq

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
