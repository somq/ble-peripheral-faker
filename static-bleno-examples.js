function getJSONFile() {
  const JSONdataFileName = process.argv[2];
  if (!JSONdataFileName) {
    console.log(`
	Missing argument!
	
	example: 'npm start my-json-file.json'
		`);
  } else {
    return require('./' + JSONdataFileName);
  }
}

const JSONdata = getJSONFile();
console.log(`🚀 / JSONdata`, JSONdata.name);
// const JSONdata = require('./CITCC');

const bleno = require('bleno');
console.log(`🚀 / bleno`, bleno);
const FakeCharacteristic = require('./fake-characteristic');
const EventEmitter = require('events');
class Emitter extends EventEmitter {}
const events = new Emitter();

bleno.on('stateChange', (state) => {
  console.log('onStateChange: ' + state);
  if (state === 'poweredOn') {
    /**
     * STANDARD (Services advertising)
     */
    // bleno.startAdvertising('adadada', ["A7561523258BD820E0967C7C2190E980"], (error) => {
    // // bleno.startAdvertising(JSONdata.name, ["A7561523258BD820E0967C7C2190E980"], (error) => {
    // 	console.log("Advertising cb: " + error);
    // });

    /**
     * EIR FORMAT
     */
    var advertisementData = Buffer.from(JSONdata.advertisementData);
    var scanData = Buffer.from(JSONdata.scanData);

    var advertisementData = Buffer.from([
      3,
      25,
      0,
      0,
      2,
      1,
      5,
      3,
      3,
      10,
      24,
      19,
      9,
      79,
      67,
      80,
      67,
      99,
      54,
      32,
      35,
      49,
      57,
      57,
      57,
      56,
      56,
      56,
      48,
      48,
      48,
    ]);
    var scanData = Buffer.from([
      30,
      255,
      255,
      255,
      26,
      255,
      65,
      25,
      0,
      76,
      0,
      0,
      67,
      0,
      0,
      83,
      0,
      0,
      87,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      84,
      0,
      0,
      0,
      0,
    ]);

    bleno.startAdvertisingWithEIRData(advertisementData, scanData, () => {
      console.log('Started advertising');
    });
  }
});

bleno.on('advertisingStart', (error) => {
  console.log('Adverising started!: ' + error);

  /**
   *  static
   **/
  var char = {
    uuid: 'A7561525-258B-D820-E096-7C7C2190E980',
    properties: ['read', 'write'],
    characteristicName: 'CMD_REQ',
    events: events,
  };
  var characteristic = new FakeCharacteristic(char);
  var service = {
    uuid: 'A7561523-258B-D820-E096-7C7C2190E980',
    characteristics: [characteristic],
  };

  bleno.setServices([new bleno.PrimaryService(service)], (error) => {
    console.log('setServices: ', error);
  });

  /**
   *  super static
   */
  // bleno.setServices([ new bleno.PrimaryService({
  // 	uuid: "91bad492b9504226aa2b4ede9fa42f59",
  // 	characteristics: [ new bleno.Characteristic({
  // 		uuid: "4fafc2011fb5459e8fccc5c9c331914b",
  // 		properties: ["read", "write", "writeWithoutResponse", "notify", "indicate"],
  // 		value: null
  // 	})]

  // })], (error) => {
  // 	console.log("setServices: " + error);
  // });
});
