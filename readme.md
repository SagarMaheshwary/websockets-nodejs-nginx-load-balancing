# Websocket Nginx Load Balancing

This is an example project that demonstrates basic round robin load balancing of websocket servers using nginx reverse. We are using redis pub/sub as a medium to push messages to all the servers.

After cloning the project, build the docker image for our nodejs server:

```bash
docker build -t ws-server .
```

Now we are ready to start the containers:

```bash
docker compose up
```
