


const appUtils = require('./app-utils');

const JSONData = appUtils.getJSONFile();

const bleno = require("bleno");
const FakeCharacteristic = require('./fake-characteristic');
const EventEmitter = require('events');
class Emitter extends EventEmitter {}
const events = new Emitter();


bleno.on("stateChange", (state) => {
	console.log("onStateChange: " + state);
	if (state === "poweredOn") {

  /**
   * @note we need to patch bleno for this one
   * @see https://github.com/noble/noble/pull/865/files
   * @todo monkey patch
   */
  bleno.reset()
		
		/**
		 * STANDARD (Services advertising)
		 */
		// bleno.startAdvertising('adadada', ["A7561523258BD820E0967C7C2190E980"], (error) => {
		// // bleno.startAdvertising(JSONData.name, ["A7561523258BD820E0967C7C2190E980"], (error) => {
		// 	console.log("Advertising cb: " + error);
		// });
		
		/**
		 * EIR FORMAT
		 */
		// let advertisementData = Buffer.from(JSONData.advertisementData);
		// let scanData = Buffer.from(JSONData.scanData);

		// let advertisementData = Buffer.from([3, 25, 0, 0, 2, 1, 5, 3, 3, 10, 24, 19, 9, 79, 67, 80, 67, 99, 54, 32, 35, 49, 57, 57, 57, 56, 56, 56, 48, 48, 48])
				// <Buffer 03 19 00 00 02 01 05 03 03 0a 18 13 09 4f 43 50 43 63 36 20 23 31 39 39 39 38 38 38 30 30 30>
																									 // O	 C	P  C  c  6     #  1  9  9  9  8  8  8  0  0  0
																									 
		let advertisementHeader = Buffer.from([3, 25, 0, 0, 2, 1, 5, 3, 3, 10, 24, 19, 9])
		let completeLocalName = Buffer.from(JSONData.name)
		let advertisementData = Buffer.concat([advertisementHeader, completeLocalName], advertisementHeader.length + completeLocalName.length)

		let scanData = Buffer.from([30, 255, 255, 255, 26, 255, 65, 25, 0, 76, 0, 0, 67, 0, 0, 83, 0, 0, 87, 0, 0, 0, 0, 0, 0, 0, 84, 0, 0, 0, 0])
		// <Buffer 1e ff ff ff 1a ff 41 19 00 4c 00 00 43 00 00 53 00 00 57 00 00 00 00 00 00 00 54 00 00 00 00>

		bleno.startAdvertisingWithEIRData(advertisementData, scanData, () => {
			console.log("Started advertising");
		});
	}
});

bleno.on("advertisingStart", (error) => {
	console.log("Adverising started!: " + error);

	
	let servicesInstances = []

	for(let serviceJSON of JSONData.services) {
		// console.log(serviceJSON.characteristics)
		let service = {
			uuid: serviceJSON.uuid,
			characteristics: []
		}
	
		let characteristics = [];
		for(let characteristicJSON of serviceJSON.characteristics) {
			// console.log(characteristicJSON)
	
			let characteristic = characteristicJSON;
			characteristic.events = events;
			characteristic.JSONData = JSONData;
			
			console.log('Creating char instance for', characteristic.uuid)
			service.characteristics.push(new FakeCharacteristic(characteristic))

			// random raw value from values in JSON (init)
			let rawValue = appUtils.getRandomRawValue(characteristic.notifyValues)

			if(rawValue) {
				console.warn(`Intervals are not set properly for charcateristic ${characteristic.characteristicName}`)
			}

			// random between two intervals (init)
			let interval = getRandomInterval(characteristic.notifyIntervalMin, characteristic.notifyIntervalMax)

			if(rawValue && interval) {
				setControlledinterval(interval * 1000, characteristic)
			}


		}
		console.log('Creating serv instance for', service.uuid)
		
		let finalService = new bleno.PrimaryService(service)
		
		servicesInstances.push(finalService)
	}

	bleno.setServices(servicesInstances, (error) => {
    if (typeof error !== 'undefined') {
      console.error('setServices error!', error);
    }
	});

})

bleno.on("accept", (event) => {
  console.log('accept event!', event);
})

bleno.on("mtuChange", (event) => {
  console.log('mtuChange event!');
})

bleno.on("disconnect", (event) => {
  console.log('disconnect event!', event);
})

bleno.on("advertisingStop", (event) => {
  console.log('advertisingStop event!', event);
})

bleno.on("servicesSet", (event) => {
  console.log('servicesSet event!', event);
})

bleno.on("rssiUpdate", (event) => {
  console.log('rssiUpdate event!', event);
})


bleno.on("advertisingStartError", (error) => {
  console.log('advertisingStartError!', error);
})

bleno.on("servicesSetError", (error) => {
  console.log('servicesSetError error!',  error);
})


function getRandomInterval(min, max, charName) {
	if(min < max) {
		return Math.floor(Math.random() * max) + min  
	} else {
		return null;
	}
}
function setControlledinterval(interval, characteristic) {
	let int = setInterval(() => {
		let rawValue = appUtils.getRandomRawValue(characteristic.notifyValues)
		events.emit(characteristic.characteristicName, { rawValue: Buffer.from(rawValue), characteristicName: characteristic.characteristicName});
			
		let interval = getRandomInterval(characteristic.notifyIntervalMin, characteristic.notifyIntervalMax)
		clearInterval(int)
		setControlledinterval(interval * 1000, characteristic)
	}, interval)
}
