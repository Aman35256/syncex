import { IntelligenceConfigurationReference } from 'twilio/lib/rest/intelligence/v3/operatorResult';
import { server } from './bluetoothservice';

export async function hardWareData(server) {
    const services = await server.getPrimaryServices();
    console.log('Getting characteristics');
    console.log(services);
    const serviceMap={};
    for (const service in services) {
        const characteristics = await service.getCharacteristics();
        serviceMap[service.uuid]={};
        for (let characteristic in characteristics) {
            serviceMap[service.uuid][characteristic.uuid] = getSupportedProperties(characteristic);

        }
    }
    return serviceMap;
}

module.exports={
    hardWareData
}