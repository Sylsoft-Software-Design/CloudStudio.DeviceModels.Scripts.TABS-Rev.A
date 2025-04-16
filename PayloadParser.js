/* Decoder in javascript for the family of tabs sensors from BROWAN for The Things Stack V3
 *
 * GNU Affero General Public License v3.0 - look into the LICENSE file please
 *
 * Created by Caspar Armster (dasdigidings e.V. / The Things Network Rhein-Sieg) - www.dasdigidings.de
 * This function is based on the work from Cameron Sharp at Sensational Systems - cameron@sensational.systems
 */

//function parseUplink(device, payload) {
    // create the object to collect the data for returning the decoded payload
 //   var data = {
 //       "bytes": payload.bytes, // original payload
 //       "port" : payload.fPort  // lorawan port
 //   };
//var bytes = payload.asBytes();
    // Every device transmits the battery status and the temperature
    // Battery measurement
 //   battery = bytes[2] & 0x0f;
 //   battery = (25 + battery) / 10;
 //   capacity = bytes[1] >> 4;
 //   capacity = (capacity / 15) * 100;

    // Temperature measurement
 //   temperature = bytes[2] & 0x7f;
 //   temperature = temperature - 32;

 //   data.battery = battery;
 //   data.capacity = capacity;
 //   data.temperature = temperature;

    // depending on the lorawan port we know which tabs sensor is delivering the data
  //  if (payload.fPort === 136) { // Object Locator
        // GNSS Fix?
 //       if ((bytes[0] & 0x8) === 0) {
 //           positionGnssFix = true;
 //       } else {
 //           positionGnssFix = false;
 //       }

        // Accuracy Measurement
 //       positionAccuracy = bytes[10] >> 5;
 //       positionAccuracy = Math.pow(2, parseInt(positionAccuracy) + 2);

        // Mask off end of accuracy byte, so longitude doesn't get affected
//        bytes[10] &= 0x1f;

 //       if ((bytes[10] & (1 << 4)) !== 0) {
 //         bytes[10] |= 0xe0;
 //       }

        // Mask off end of latitude byte, RFU
 //       bytes[6] &= 0x0f;

        // Latitude and Longitude Measurement
 //       positionLatitude = ((bytes[6] << 24 | bytes[5] << 16) | bytes[4] << 8 ) | bytes[3];
 //       positionLongitude = ((bytes[10] << 24 | bytes[9] << 16) | bytes[8] << 8 ) | bytes[7];
 //       positionLatitude = positionLatitude / 1000000;
 //       positionLongitude = positionLongitude / 1000000;

     //   data.positionGnssFix = positionGnssFix;
     //   data.positionLatitude = positionLatitude;
     //   data.positionLongitude = positionLongitude;
     //   data.positionAccuracy = positionAccuracy;
 //   }

 //   return {
 //       data: data,
 //temperature: [],
  //      warnings: [],
   //     errors: []
 //   };
//}



function parseUplink(device, payload)
{
	// This function allows you to parse the received payload, and store the 
	// data in the respective endpoints. Learn more at https://wiki.cloud.studio/page/200

	// The parameters in this function are:
	// - device: object representing the device that produced the payload. 
	//   You can use "device.endpoints" to access the collection 
	//   of endpoints contained within the device. More information
	//   at https://wiki.cloud.studio/page/205
	// - payload: object containing the payload received from the device. More
	//   information at https://wiki.cloud.studio/page/208.

	// This example is written assuming a temperature and humidity sensor that 
	// sends a binary payload with temperature in the first byte, humidity 
	// in the second byte, and battery percentage in the third byte.

//*  
	// Payload is binary, so it's easier to handle as an array of bytes
	var bytes = payload.asBytes();
	
	// Verify payload contains exactly 3 bytes
//	if (bytes.length != 3)
//		return;


	// Parse and store temperature
	var temperatureSensor = device.endpoints.byType(endpointType.temperatureSensor);
	if (temperatureSensor != null)
	{
//		var temperature = bytes[0] & 0x7f;
//		if (bytes[0] & 0x80)  // Negative temperature?
//			temperature -= 128;
    var temperature = bytes[2] & 0x7f;
    temperature = temperature - 32;
		temperatureSensor.updateTemperatureSensorStatus(temperature);
	}


	// Parse and store location
	var locationTracker = device.endpoints.byType(endpointType.locationTracker);
	if (locationTracker != null)
//	{
       var positionLatitude = (bytes[3] | bytes[4] << 8 | bytes[5] << 16 | bytes[6] << 28 >> 4);
       var positionLongitude = (bytes[7] | bytes[8] << 8 | bytes[9] << 16 | bytes[10] << 27 >> 3);
        positionLatitude = positionLatitude / 1000000;
        positionLongitude = positionLongitude / 1000000;
		locationTracker.updateLocationTrackerStatus(positionLatitude, positionLongitude);
//	}




	// Parse and store humidity
//	var humiditySensor = device.endpoints.byType(endpointType.humiditySensor);
//	if (humiditySensor != null)
//	{
//		var humidity = bytes[1];
//		humiditySensor.updateHumiditySensorStatus(humidity);
//	}	  
	
	// Parse and store battery percentage
//	var batteryPercentage = bytes[2];
//	device.updateDeviceBattery({ percentage: batteryPercentage });
/*/

//}

//function buildDownlink(device, endpoint, command, payload) 
//{ 
	// This function allows you to convert a command from the platform 
	// into a payload to be sent to the device.
	// Learn more at https://wiki.cloud.studio/page/200

	// The parameters in this function are:
	// - device: object representing the device to which the command will
	//   be sent. 
	// - endpoint: endpoint object representing the endpoint to which the 
	//   command will be sent. May be null if the command is to be sent to 
	//   the device, and not to an individual endpoint within the device.
	// - command: object containing the command that needs to be sent. More
	//   information at https://wiki.cloud.studio/page/1195.

	// This example is written assuming a device that contains a single endpoint, 
	// of type appliance, that can be turned on, off, and toggled. 
	// It is assumed that a single byte must be sent in the payload, 
	// which indicates the type of operation.

/*
	 payload.port = 25; 	 	 // This device receives commands on LoRaWAN port 25 
	 payload.buildResult = downlinkBuildResult.ok; 

	 switch (command.type) { 
	 	 case commandType.onOff: 
	 	 	 switch (command.onOff.type) { 
	 	 	 	 case onOffCommandType.turnOn: 
	 	 	 	 	 payload.setAsBytes([30]); 	 	 // Command ID 30 is "turn on" 
	 	 	 	 	 break; 
	 	 	 	 case onOffCommandType.turnOff: 
	 	 	 	 	 payload.setAsBytes([31]); 	 	 // Command ID 31 is "turn off" 
	 	 	 	 	 break; 
	 	 	 	 case onOffCommandType.toggle: 
	 	 	 	 	 payload.setAsBytes([32]); 	 	 // Command ID 32 is "toggle" 
	 	 	 	 	 break; 
	 	 	 	 default: 
	 	 	 	 	 payload.buildResult = downlinkBuildResult.unsupported; 
	 	 	 	 	 break; 
	 	 	 } 
	 	 	 break; 
	 	 default: 
	 	 	 payload.buildResult = downlinkBuildResult.unsupported; 
	 	 	 break; 
	 }
//*/

}