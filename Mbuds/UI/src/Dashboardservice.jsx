import { useState } from "react";
import { connectToBluetooth } from "./bluetoothservice.js";
import "./Dashboard.css";

function Dashboard() {
  const [status, setStatus] = useState("Not connected");
  const [device, setDevice] = useState(null);
  const [receivedData, setReceivedData] = useState([]);
  const [isConnecting, setIsConnecting] = useState(false);

  async function handleConnect() {
    try {
      setIsConnecting(true);
      setStatus("Select a Bluetooth device...");

      const connection = await connectToBluetooth((packet) => {
        // This callback runs whenever the BLE device sends data.
        setReceivedData((previousData) => [
          packet,
          ...previousData.slice(0, 49),
        ]);
      });

      setDevice(connection.device);

      setStatus(
        `Connected to ${connection.device.name || "Unnamed device"}`
      );

      connection.device.addEventListener(
        "gattserverdisconnected",
        handleDisconnect
      );
    } catch (error) {
      setStatus(
        error.name === "NotFoundError"
          ? "No device selected."
          : error.message
      );
    } finally {
      setIsConnecting(false);
    }
  }

  function handleDisconnect() {
    setDevice(null);
    setStatus("Device disconnected");
  }

  return (
    <main className="dashboard">
      <header className="dashboard-header">
        <div>
          <p className="eyebrow">MOODBUDS</p>
          <h1>Bluetooth Sensor Dashboard</h1>
          <p className="description">
            Connect your wearable and inspect live data packets.
          </p>
        </div>

        <button
          type="button"
          className="connect-button"
          
          onClick={handleConnect}
          disabled={isConnecting || Boolean(device)}
        >
          {isConnecting
            ? "Connecting..."
            : device
              ? "Connected"
              : "Connect Bluetooth"}
        </button>
      </header>

      <section className="connection-card">
        <span
          className={`status-indicator ${device ? "connected" : ""}`}
        />

        <div>
          <p className="label">CONNECTION STATUS</p>
          <h2>{status}</h2>

          {device && (
            <p className="device-id">
              Device ID: {device.id}
            </p>
          )}
        </div>

        {device && <span className="live-badge">● LIVE</span>}
      </section>

      <section className="stats-grid">
        <article className="stat-card">
          <p className="label">DEVICE</p>
          <strong>{device?.name || "--"}</strong>
        </article>

        <article className="stat-card">
          <p className="label">PACKETS RECEIVED</p>
          <strong>{receivedData.length}</strong>
        </article>

        <article className="stat-card">
          <p className="label">LATEST PACKET SIZE</p>
          <strong>
            {receivedData[0]
              ? `${receivedData[0].bytes.length} bytes`
              : "--"}
          </strong>
        </article>
      </section>

      <section className="data-panel">
        <div className="panel-header">
          <div>
            <p className="label">LIVE BLE STREAM</p>
            <h2>Incoming device data</h2>
          </div>

          <button
            type="button"
            className="clear-button"
            onClick={() => setReceivedData([])}
            disabled={receivedData.length === 0}
          >
            Clear
          </button>
        </div>

        {receivedData.length === 0 ? (
          <div className="empty-state">
            <div className="bluetooth-icon">ᛒ</div>
            <h3>No data received yet</h3>
            <p>
              Connect a device that supports Bluetooth notifications.
            </p>
          </div>
        ) : (
          <div className="packet-list">
            {receivedData.map((packet, index) => (
              <article
                className="packet"
                key={`${packet.timestamp}-${index}`}
              >
                <div className="packet-details">
                  <span className="packet-number">
                    Packet #{receivedData.length - index}
                  </span>

                  <span>{packet.timestamp}</span>

                  <span>
                    Characteristic: {packet.characteristicUuid}
                  </span>
                </div>

                <code>{packet.bytes.join(" ")}</code>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

export default Dashboard;