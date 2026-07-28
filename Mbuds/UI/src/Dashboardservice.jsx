
import { useState } from "react";
import { connectoBluetooth } from "./bluetoothservice";

function Dashboard() {
  const [status, setStatus] = useState("Not connected");

  async function handleConnect() {
    try {
      setStatus("Select a Bluetooth device...");
      const device = await connectoBluetooth();
      setStatus(`Connected to ${device.name || "Unnamed device"}`);
    } catch (error) {
      setStatus(
        error.name === "NotFoundError"
          ? "No device selected."
          : error.message
      );
    }
  }
  return (
    <main>
      <h1>MoodBuds Dashboard</h1>
      <button type="button" onClick={handleConnect}>
        Connect to Bluetooth
      </button>
      <p>{status}</p>
    </main>
  );
}

export default Dashboard;