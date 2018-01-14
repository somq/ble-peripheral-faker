const EventEmitter = require('events');
class Emitter extends EventEmitter {}
const events = new Emitter();

function getRandomBytes(numberOfBytes = 1) {
	/**
	 * can be done with crypto lib
	 * 
			var crypto = require("crypto");
			var id = crypto.randomBytes(20).toString('hex'); // "bb5dc8842ca31d4603d6aa11448d1654"
	 */
  let numberOfBytesx = numberOfBytes * 2;
  
	var byteString = '0x';
  var possible = "ABCDEF0123456789";

  for (var i = 0; i < numberOfBytesx; i++) {
    byteString += possible.charAt(Math.floor(Math.random() * possible.length));
	}
	return byteString;
}
function getRandomRawValue(JSONValues) {
	if(JSONValues) {
		return JSONValues[Math.floor(Math.random() * JSONValues.length)] || null;
	} else {
		return null;
	}
}


function getJSONFile() {
	const JSONdataFileName = process.argv[2];
	if(!JSONdataFileName) {
		console.log(`
	Missing argument!
	
	example: 'node ble-peripheral-faker.js myJsonFile.json'
		`)
		process.exit(-1)
	} else {
		return require('./' + JSONdataFileName);
	}
}

function getRandomInterval(min, max, charName) {
	if(min < max) {
		return Math.floor(Math.random() * max) + min  
	} else {
		return null;
	}
}
function setControlledinterval(interval, characteristic) {
	let int = setInterval(() => {
		let rawValue = getRandomRawValue(characteristic.notifyValues)
		events.emit(characteristic.characteristicName, { rawValue: Buffer.from(rawValue), characteristicName: characteristic.characteristicName});
			
		let interval = getRandomInterval(characteristic.notifyIntervalMin, characteristic.notifyIntervalMax)
		clearInterval(int)
		setControlledinterval(interval * 1000, characteristic)
	}, interval)
}

function getNotifyValuesForChar(charUuid, JSONData) {
	// console.log('getNotifyValueForChar', charUuid, typeof JSONData)
  for(let service of JSONData.services) {

    for(let characteristic of service.characteristics) {
      if(characteristic.uuid.split('-').join('') === charUuid) {
        return characteristic.notifyValues || null
      }
    }
    return null;
  }
}
module.exports = {
	getRandomBytes: getRandomBytes,
	getRandomRawValue: getRandomRawValue,
	// getRandomInterval: getRandomInterval,
	// setControlledinterval: setControlledinterval,
	getJSONFile: getJSONFile,
	getNotifyValuesForChar: getNotifyValuesForChar
}