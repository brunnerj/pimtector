
const DEVICE_NAME = 'PIMtector';
let device = null;

const CHAR_VALUE_CHANGED_EVENT = 'characteristicvaluechanged';

const BATTERY_SERVICE_UUID	= 'battery_service';
const BATTERY_CHAR_UUID	= 'battery_level';
let batteryLevelCharacteristic = null;
let batteryCallback = null;

const RECEIVER_SERVICE_UUID	= '00010000-8d54-11e9-b475-0800200c9a66';
const RECEIVER_DATA_CHAR_UUID = '00010001-8d54-11e9-b475-0800200c9a66';
let receiverDataCharacteristic = null;
let receiverCallback = null;


function handleBatteryLevelNotification(event) {

	if (!batteryCallback) return;

	const level = event.target.value.getUint8(0);

	batteryCallback(level);
}

function handleReceiverDataNotification(event) {

	if (!receiverCallback) return;

	const data = event.target.value.getInt16(0, true);

	receiverCallback(data);
}

const connect = async ({ batteryFn, receiverFn }) => {
	if (device) return; // already connected

	if (!batteryFn || typeof batteryFn != 'function') 
		throw Error('Must supply a battery level callback when connecting to receiver.');
	batteryCallback = batteryFn;

	if (!receiverFn || typeof receiverFn != 'function') 
		throw Error('Must supply a receiver data callback when connecting to receiver.');
	receiverCallback = receiverFn;

	try {

		const isBTAvailable = await navigator.bluetooth.getAvailability();
		if (!isBTAvailable) throw Error('Bluetooth is not available or not supported by this device.');

		console.log('[Receiver.js] Requesting PIMtector device...');
		device = await navigator.bluetooth.requestDevice({
			filters: [{ name: DEVICE_NAME }],
			optionalServices: [ BATTERY_SERVICE_UUID, RECEIVER_SERVICE_UUID ]
		});
		console.log('[Receiver.js] > Name:             ' + device.name);
		console.log('[Receiver.js] > Id:               ' + device.id);

		console.log('[Receiver.js] Connecting to device GATT server...');
		const server = await device.gatt.connect();

		// Battery Service 

		console.log('[Receiver.js] Getting device battery service...');
		const batteryService = await server.getPrimaryService(BATTERY_SERVICE_UUID);

		console.log('[Receiver.js] Getting device battery level characteristic...');
		batteryLevelCharacteristic = await batteryService.getCharacteristic(BATTERY_CHAR_UUID);

		console.log('[Receiver.js] Reading device battery level...');
		const level = await batteryLevelCharacteristic.readValue();

		console.log(`[Receiver.js] > Battery level is ${level.getUint8(0)}%`);
		batteryCallback(level.getUint8(0));

		console.log('[Receiver.js] Subscribing to battery level notifications...');
		batteryLevelCharacteristic.addEventListener(CHAR_VALUE_CHANGED_EVENT, handleBatteryLevelNotification);

		console.log('[Receiver.js] Starting battery level notifications...');
		await batteryLevelCharacteristic.startNotifications();

		// Receiver Service

		console.log('[Receiver.js] Getting device receiver service...');
		const receiverService = await server.getPrimaryService(RECEIVER_SERVICE_UUID);

		console.log('[Receiver.js] Getting device receiver data characteristic...');
		receiverDataCharacteristic = await receiverService.getCharacteristic(RECEIVER_DATA_CHAR_UUID);

		console.log('[Receiver.js] Subscribing to receiver data notifications...');
		receiverDataCharacteristic.addEventListener(CHAR_VALUE_CHANGED_EVENT, handleReceiverDataNotification);

	} catch (e) {

		disconnect();
		throw e;
	}
}

const disconnect = async () => {
	if (!device) return;

	let errors = [];

	if (batteryLevelCharacteristic && batteryLevelCharacteristic.stopNotifications) {
		try {
			console.log('[Receiver.js] Stopping battery level notifications...');
			await batteryLevelCharacteristic.stopNotifications();
			batteryLevelCharacteristic.removeEventListener(CHAR_VALUE_CHANGED_EVENT, handleBatteryLevelNotification);
		} catch (e) {
			errors.push(e.message);
		}
	}

	if (receiverDataCharacteristic && receiverDataCharacteristic.stopNotifications) {
		try {
			console.log('[Receiver.js] Stopping receiver data notifications...');
			await receiverDataCharacteristic.stopNotifications();
			receiverDataCharacteristic.removeEventListener(CHAR_VALUE_CHANGED_EVENT, handleReceiverDataNotification);
		} catch (e) {
			errors.push(e.message);
		}
	}

	device = null;

	batteryLevelCharacteristic = null;
	batteryCallback = null;
	
	receiverDataCharacteristic = null;
	receiverCallback = null;

	if (errors.length > 0)
		throw Error(errors.join(', '));
}

const play = async () => {
	if (!device || !receiverDataCharacteristic) return; // receiver is not connected

	console.log('[Receiver.js] Starting receiver data notifications...');
	await receiverDataCharacteristic.startNotifications();
}

const pause = async () => {
	if (!device) return; // receiver is not connected

	console.log('[Receiver.js] Stopping receiver data notifications...');
	await receiverDataCharacteristic.stopNotifications();
}

const Receiver = {
	connect,
	disconnect,
	play,
	pause
}

export default Receiver;
