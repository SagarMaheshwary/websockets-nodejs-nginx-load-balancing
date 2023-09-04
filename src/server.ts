import { Server } from "http";
import {
  server as WebSocketServer,
  connection as WebSocketConnection,
} from "websocket";
import { createClient } from "redis";

const connections: WebSocketConnection[] = [];

async function run() {
  const server = new Server();

  const port = process.env.APP_PORT;
  const appId = process.env.APP_ID;

  server.listen(port, () => {
    console.log(`Server ${appId} started listening on ${port}`);
  });

  const subscriber = createClient({
    url: "redis://redis:6379",
  });

  await subscriber.connect();

  const publisher = createClient({
    url: "redis://redis:6379",
  });

  await publisher.connect();

  subscriber.on("subscribe", (channel, count) => {
    console.log(`Server ${appId} subscribed to redis pub/sub`);
  });

  await subscriber.subscribe("message", (message, channel) => {
    connections.forEach((connection) => connection.send(message));
  });

  const ws = new WebSocketServer({
    httpServer: server,
  });

  ws.on("request", (request) => {
    //this is just an example server so passing null for origin
    const connection = request.accept(null, request.origin);

    console.log(`Connection Received on Server: ${appId}`);

    connection.on("message", async (data) => {
      console.log(data);

      if (data.type === "utf8") {
        await publisher.publish("message", data.utf8Data);
      }
    });

    connection.on("close", () => {
      console.log(`Connection Closed on Server: ${appId}`);
    });

    connections.push(connection);

    console.log(`CONNECTIONS COUNT on ${appId}: ${connections.length}`);
  });
}

run();
