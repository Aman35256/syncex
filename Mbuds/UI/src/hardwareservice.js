export async function hardWareData(server) {
  const services = await server.getPrimaryServices();

  console.log("Getting characteristics");
  console.log(services);

  const serviceMap = {};
  for (const service of services) {
    const characteristics = await service.getCharacteristics();

    serviceMap[service.uuid] = {};

    for (const characteristic of characteristics) {
      serviceMap[service.uuid][characteristic.uuid] = {
        characteristic,
        properties: getSupportedProperties(characteristic),
      };
    }
  }

  return serviceMap;
}

function getSupportedProperties(characteristic) {
  const properties = characteristic.properties;

  return {
    broadcast: properties.broadcast,
    read: properties.read,
    writeWithoutResponse: properties.writeWithoutResponse,
    write: properties.write,
    notify: properties.notify,
    indicate: properties.indicate,
    authenticatedSignedWrites:
      properties.authenticatedSignedWrites,
    reliableWrite: properties.reliableWrite,
    writableAuxiliaries:
      properties.writableAuxiliaries,
  };
}