const bleno = require("bleno");
const util = require("util");
const EventEmitter = require('events');

const appUtils = require('./app-utils');


var FakeCharacteristic = function(params) {
	console.log('FakeCharacteristic', params)
	FakeCharacteristic.super_.call(this, {
			uuid: params.uuid,
			properties: params.properties
	});

	this._appEvents = params.events;
	this.JSONData = params.JSONData;
	
	this._appEvents.on(params.characteristicName, this.onValueChange.bind(this));
};

util.inherits(FakeCharacteristic, bleno.Characteristic);

FakeCharacteristic.prototype.onValueChange = function(value) {
	console.log(`Characteristic publish: ${value.characteristicName} 0x${Buffer.from([value.rawValue]).toString('hex').toUpperCase()}`);

	if (this.updateValueCallback) {
			this.updateValueCallback(Buffer.from([value.rawValue]));
	}
};

FakeCharacteristic.prototype.onReadRequest = function(offset, callback) {
	let notifyValues = appUtils.getNotifyValuesForChar(this.uuid, this.JSONData);
	let value = appUtils.getRandomRawValue(notifyValues)

	callback(this.RESULT_SUCCESS, Buffer.from([value]));
	console.log(`Responded to a read on characteristic ${this.uuid} with a random value from it's array: ${value}`);
};

FakeCharacteristic.prototype.onWriteRequest = function(data, offset, withoutResponse, callback) {
	// console.log(data, offset, withoutResponse, callback, this.uuid)
	// var value = data.readUInt8(0); // is to decimal. eg. 0x64 => logs 100
	console.log(`A central wrote value ${data} on characteristic ${this.uuid} (WithoutReponse: ${withoutResponse})`)
	
	callback(this.RESULT_SUCCESS);
};

module.exports = FakeCharacteristic;