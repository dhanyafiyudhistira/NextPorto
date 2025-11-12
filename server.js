// Custom server to run WebSocket alongside Next.js
const { createServer } = require("http");
const { parse } = require("url");
const next = require("next");
const { WebSocketServer } = require("ws");

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3000;

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true);
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error("Error occurred handling", req.url, err);
      res.statusCode = 500;
      res.end("internal server error");
    }
  });

  // WebSocket server
  const wss = new WebSocketServer({ noServer: true });

  wss.on("connection", (ws) => {
    console.log("New WebSocket client connected");

    ws.on("message", (message) => {
      console.log("Received:", message.toString());
    });

    ws.on("close", () => {
      console.log("WebSocket client disconnected");
    });

    // Send periodic updates
    const interval = setInterval(() => {
      if (ws.readyState === 1) { // WebSocket.OPEN
        const mockData = {
          type: "telemetry",
          payload: {
            timestamp: new Date().toISOString(),
            value: Math.random() * 1000,
            type: "ACTIVE_POWER"
          }
        };
        ws.send(JSON.stringify(mockData));
      }
    }, 2000);

    ws.on("close", () => {
      clearInterval(interval);
    });
  });

  server.on("upgrade", (request, socket, head) => {
    const { pathname } = parse(request.url);

    if (pathname === "/api/ws") {
      wss.handleUpgrade(request, socket, head, (ws) => {
        wss.emit("connection", ws, request);
      });
    } else {
      socket.destroy();
    }
  });

  server.listen(port, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://${hostname}:${port}`);
    console.log(`> WebSocket server ready on ws://${hostname}:${port}/api/ws`);
  });
});
