

import { hardWareData } from "./hardwareservice";
export async function connectToBluetooth() {
    if (!navigator.bluetooth) {
        throw new Error("Web Bluetooth is not supported in this browser");
    }
    const device = await navigator.bluetooth.requestDevice({
        acceptAllDevices: true,
        optionalServices: ["battery_service"]
    });

    const server = await device.gatt.connect();
    const hardwareInfo = await hardWareData(server);

    console.log("Discovered hardware:", hardwareInfo);

    for (const serviceUuid in hardwareInfo) {
        const serviceCharacteristics = hardwareInfo[serviceUuid];

        for (const characteristicUuid in serviceCharacteristics) {
            const characteristicInfo =
                serviceCharacteristics[characteristicUuid];

            const { characteristic, properties } = characteristicInfo;

            if (!properties.notify && !properties.indicate) {
                continue;
            }

            await characteristic.startNotifications();

            characteristic.addEventListener(
                "characteristicvaluechanged",
                handleNotifications
            );

            console.log(
                `Listening to characteristic: ${characteristicUuid}`
            );
        }
    }

    return {
        device,
        server,
        hardwareInfo
    };
}
function handleNotifications(event) {
    const value = event.target.value;
    const bytes = [];
    for (let i = 0; i < value.byteLength; i++) {
        const hexadecimalByte = value
            .getUint8(i)
            .toString(16)
            .padStart(2, "0");

        bytes.push(`0x${hexadecimalByte}`);
    }
    console.log("Received bytes:", bytes.join(" "));
    return {
        device,
        server,
        hardwareInfo
    };

}
module.exports = {
    connectoBluetooth
}