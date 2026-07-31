import { hardWareData } from "./hardwareservice.js";
async function pingagain(device, retries) {
    let lasterr;
    for (let i = 1; i <= retries; i++) {
        try {
            const server = await device.gatt.connect();
            if (server) {
                return server;
            }
        }
        catch (err) {
            lasterr = err;
            await new Promise((x) => setTimeout(x, 600 * i));
        }
    }
    throw new Error("Couldnt establish the connection", { cause: lasterr });
}
export async function connectToBluetooth(onDataReceived) {
    if (!navigator.bluetooth) {
        throw new Error(
            "Web Bluetooth is not supported in this browser"
        );
    }
    const device = await navigator.bluetooth.requestDevice({
        acceptAllDevices: true,
        optionalServices: ["battery_service"],
    });
    let server;
    try {
        server = await device.gatt.connect();
    }
    catch (error) {
        await new Promise((resolve) => {
            setTimeout(resolve, 600);
        })
        server = await pingagain(device, 3);
    }
    device.addEventListener('gattserverdisconnected', async () => {
        console.warn('Device Disconnected'.device.name);
        try {
            server = await device.gatt.connect();
        }
        catch (error) {
            await new Promise((resolve) => {
                setTimeout(resolve, 600);
            })
            server = await pingagain(device, 3);
        }
    })
    const hardwareInfo = await hardWareData(server);
    console.log("Discovered hardware:", hardwareInfo);
    let notificationCount = 0;

    for (const serviceUuid in hardwareInfo) {
        const serviceCharacteristics = hardwareInfo[serviceUuid];

        for (const characteristicUuid in serviceCharacteristics) {
            const characteristicInfo =
                serviceCharacteristics[characteristicUuid];

            const { characteristic, properties } = characteristicInfo;

            if (!properties.notify && !properties.indicate) {
                continue;
            }

            const handleNotifications = (event) => {
                const value = event.target.value;
                const bytes = [];

                for (let index = 0; index < value.byteLength; index++) {
                    const hexadecimalByte = value
                        .getUint8(index)
                        .toString(16)
                        .padStart(2, "0");

                    bytes.push(`0x${hexadecimalByte}`);
                }

                const packet = {
                    serviceUuid,
                    characteristicUuid,
                    bytes,
                    timestamp: new Date().toLocaleTimeString(),
                };

                console.log("Received packet:", packet);

                if (typeof onDataReceived === "function") {
                    onDataReceived(packet);
                }
            };

            await characteristic.startNotifications();

            characteristic.addEventListener(
                "characteristicvaluechanged",
                handleNotifications
            );

            notificationCount++;

            console.log(
                `Listening to characteristic: ${characteristicUuid}`
            );
        }
    }

    if (notificationCount === 0) {
        console.warn(
            "The device has no accessible notification characteristics."
        );
    }

    return {
        device,
        server,
        hardwareInfo,
        notificationCount,
    };
}