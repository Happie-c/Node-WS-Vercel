import WebSocket from "ws";

const SOCKET_URL = "wss://sportsbet.io/graphql";   // <-- put your WebSocket URL here

function start() {
    console.log(`Connecting to ${SOCKET_URL} ...`);

    const ws = new WebSocket(SOCKET_URL);

    // When connected
    ws.on("open", () => {
        console.log("✔ Connected");

        // If your server requires an init message, you can send here:
        // ws.send(JSON.stringify({ type: "connection_init" }));
    });

    // On incoming data
    ws.on("message", (data) => {
        const text = data.toString();
        console.log("📥 Received:", text);

        // If server sends JSON, you can auto-parse:
        try {
            const json = JSON.parse(text);
            console.log("📦 Parsed JSON:", json);
        } catch {}
    });

    // On error
    ws.on("error", (err) => {
        console.log("❌ Error:", err.message);
    });

    // On close
    ws.on("close", () => {
        console.log("🔌 Connection closed");
    });
}

start();
