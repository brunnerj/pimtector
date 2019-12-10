
const DEVICE_NAME = 'PIMtector';
let device = null;

const CHAR_VALUE_CHANGED_EVENT = 'characteristicvaluechanged';
const GATT_SERVER_DISCONNECTED = 'gattserverdisconnected';

const BATTERY_SERVICE_UUID	= 'battery_service';
const BATTERY_CHAR_UUID		= 'battery_level';

let batteryLevelCharacteristic = null;
let batteryCallback = null;


const RECEIVER_SERVICE_UUID				= '00010000-8d54-11e9-b475-0800200c9a66';
const RECEIVER_INFO_CHAR_UUID			= '00010001-8d54-11e9-b475-0800200c9a66';
const RECEIVER_DATA_CHAR_UUID			= '00010002-8d54-11e9-b475-0800200c9a66';
const RECEIVER_CENTER_FREQ_CHAR_UUID	= '00010003-8d54-11e9-b475-0800200c9a66';
const RECEIVER_SAMPLE_RATE_CHAR_UUID	= '00010004-8d54-11e9-b475-0800200c9a66';


let receiverInfoCharacteristic = null;
let receiverDataCharacteristic = null;
let receiverCenterFreqCharacteristic = null;
let receiverSampleRateCharacteristic = null;

let receiverCallback = null;

let decoder = new TextDecoder('utf-8');

// Buffer receiver data
let running = false;
let overflow = false;
let buffer = [];
const MAX_BUFFER_LENGTH = 32;

// Convert receiver data into trace
// and hold in traces buffer
let traces = [];
const MAX_TRACES = 16;

// Receiver parameters
let Fo_Hz = 650e6; // center frequency, Hz
let Fs_Hz; // sample rate, Hz (read-only)

// Plot loop control
let plotTmo;
let plotRate = 50; // ms
const plotRateMax = 100;
const plotRateMin = 50;
const speedUpAt = 0.6; // buffer 60% full
const slowDownAt = 0.4; // buffer at 40% full
const rateBump = 10; // ms

// This runs when the receiver notifies that
// new data is available.
function handleReceiverDataNotification(event) {

	if (!receiverCallback || !running) return;

	// event.target.value is a DataView()
	const data = new Uint8Array(event.target.value.buffer);

	if (buffer.length < MAX_BUFFER_LENGTH) {
		buffer.push(data);
		overflow = false;
	} else {
		overflow = true;
	}

	// Kick off the plotData routine which will use the receiverCallback as
	// the main reducer function to update the UI elements
	if (!plotTmo) plotData();
}

function plotData() {

	const bpc = buffer.length / MAX_BUFFER_LENGTH;

	if (receiverCallback && running && buffer.length > 0) {

		// each array in buffer is a DataView of UInt8Array
		// values are 0..255 representing -130..-80 dBm
		const y_values =  Array.from(new Uint8Array(buffer.shift()));
		const N = y_values.length;
		const scale = 50/255; // convert y-value into power

		// loop through the data points and build an
		// array of [ x, y ] points to plot
		const trace = y_values.map((v, i) => {

			const freq = Fo_Hz + (i * (Fs_Hz / (N - 1)) - Fs_Hz / 2); // frequency in Hz
			const power = (v * scale) - 130; // dBm

			return [ freq / 1e6, power ];
		});

		// Add trace to 0th position of traces array (traces go from
		// newest at 0 to oldest at MAX_TRACES - 1).
		traces.unshift({ data: trace });

		if (traces.length >= MAX_TRACES)
			traces.pop();

		// This updates the UI state with the traces buffer
		receiverCallback(traces);
	}

	if (running) {
		if (bpc > speedUpAt) {
			plotRate = Math.max(plotRateMin, plotRate - rateBump);
		} else if (bpc < slowDownAt) {
			plotRate = Math.min(plotRateMax, plotRate + rateBump);
		}

	} else {

		plotRate = plotRateMax;
	}
	
	if (plotTmo) clearTimeout(plotTmo);
	plotTmo = setTimeout(plotData, plotRate);
}

function handleBatteryLevelNotification(event) {

	if (!batteryCallback) return;

	const level = event.target.value.getUint8(0);

	batteryCallback(level);
}

const connect = async ({ batteryFn, receiverFn }) => {
	if (device) return; // already connected

	if (!batteryFn || typeof batteryFn != 'function') 
		throw Error('Must supply a battery level callback when connecting to receiver.');

	batteryCallback = batteryFn;

	if (!receiverFn || typeof receiverFn != 'function') 
		throw Error('Must supply a receiver data callback when connecting to receiver.');

	receiverCallback = receiverFn;

	const isBTAvailable = await navigator.bluetooth.getAvailability();

	if (!isBTAvailable) 
		throw Error('Bluetooth is not available or not supported by this device.');

	console.log(`[Receiver.js] Requesting ${DEVICE_NAME} device...`);
	device = await navigator.bluetooth.requestDevice({
		filters: [{ name: DEVICE_NAME }],
		optionalServices: [ BATTERY_SERVICE_UUID, RECEIVER_SERVICE_UUID ]
	});
	console.log('[Receiver.js] > Connected:             ' + device.name);

	device.addEventListener(GATT_SERVER_DISCONNECTED, async () => {
		await disconnect();

		throw new Error(`[Receiver.js] ${DEVICE_NAME} has disconnected.`);
	});

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

	console.log('[Receiver.js] Getting device receiver characteristics...');
	receiverInfoCharacteristic = await receiverService.getCharacteristic(RECEIVER_INFO_CHAR_UUID);
	receiverDataCharacteristic = await receiverService.getCharacteristic(RECEIVER_DATA_CHAR_UUID);
	receiverCenterFreqCharacteristic = await receiverService.getCharacteristic(RECEIVER_CENTER_FREQ_CHAR_UUID);
	receiverSampleRateCharacteristic = await receiverService.getCharacteristic(RECEIVER_SAMPLE_RATE_CHAR_UUID);

	// Read the receiver information characteristic value - this should throw if there's
	// a receiver problem, and the connect will fail at this point with an error message.
	console.log('[Receiver.js] Getting receiver information...');
	const info = await receiverInfoCharacteristic.readValue();
	const msg = decoder.decode(info);
	console.log(`[Receiver.js] > ${msg}`);

	// If the receiver doesn't return valid info, it should return an
	// error string flagged with 'ERROR' at the beginning. If so, we
	// just throw here and disconnect.
	if (msg.startsWith('ERROR')) {
		throw new Error(msg);
	}

	const Fs_buf = await receiverSampleRateCharacteristic.readValue();
	const Fs_val = Fs_buf.getUint16(0, true); // kHz * 10
	Fs_Hz = Fs_val * 100;
	console.log(`[Receiver.js] Getting sample rate => ${Fs_Hz * 1e3} kHz`);

	console.log(`[Receiver.js] Setting center frequency => ${Fo_Hz / 1e6} MHz...`);
	await receiverCenterFreqCharacteristic.writeValue(Uint16Array.of(Fo_Hz / 1e5)); // MHz * 10

	const Fo_buf = await receiverCenterFreqCharacteristic.readValue();
	const Fo_val = Fo_buf.getUint16(0, true); // MHz * 10
	const Fo_MHz_read = Fo_val / 10;
	console.log(`[Receiver.js] Getting center frequency => ${Fo_MHz_read} MHz`);
	
	// Check that our written values are read back properly
	if (Fo_Hz !== Fo_MHz_read * 1e6) {
		throw new Error('Error setting receiver frequency');
	}

	console.log('[Receiver.js] Subscribing to receiver data notifications...');
	receiverDataCharacteristic.addEventListener(CHAR_VALUE_CHANGED_EVENT, handleReceiverDataNotification);
}

const disconnect = async () => {

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

	running = false;
	overflow = false;
	buffer.length = 0;
	
	receiverDataCharacteristic = null;
	receiverCenterFreqCharacteristic = null;
	receiverSampleRateCharacteristic = null;

	receiverCallback = null;

	if (errors.length > 0) {
		throw Error(errors.join(', '));
	}
}

const play = async () => {
	if (!device || !receiverDataCharacteristic) return; // receiver is not connected

	console.log('[Receiver.js] Starting receiver data notifications...');
	running = true;
	buffer.length = 0;
	await receiverDataCharacteristic.startNotifications();
}

const pause = async () => {
	if (!device) return; // receiver is not connected

	console.log('[Receiver.js] Stopping receiver data notifications...');
	running = false;
	await receiverDataCharacteristic.stopNotifications();
}

const Receiver = {
	connect,
	disconnect,
	play,
	pause,
	overflow
}

export default Receiver;
