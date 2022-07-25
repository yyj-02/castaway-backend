# Castaway Media Server Documentation

## Description

This service is achieved using [Socket.io](https://socket.io/), [Docker](https://www.docker.com/) and [Google Compute Engine](https://cloud.google.com/compute). The media server is used to run a WebSocket instance for sustained connection between the server and the clients such that audio streams can be transferred between them in real time. The streamer will record the audio in few seconds chunks and send it to the server at an interval, which will be sent to the listeners in the room. For example, a streamer can choose to upload a 5 seconds mp3 file to the server every 5 seconds recording the audio stream, these packets will be stitched together again when received by the listeners.

## Usage

1. Clone this repository.

```bash
## using ssh
git clone git@github.com:yyj-02/castaway-backend.git

##using https
git clone https://github.com/yyj-02/castaway-backend.git
```

2. Enter the media server directory.

```bash
cd media_server/
```

3. [Install Docker](https://docs.docker.com/get-docker/)

4. Copy your Firebase keys into a `.env` file, the identity server api key should be the same as the one `functions/` directory.

```.env
# media_server/.env
IDENTITY_SERVER_API_KEY="AIzaSyA4hEJCieDb6y_hHH2fejenvc5GbTyRcsk8"
PROJECT_ID="castaway-91137"
PRIVATE_KEY='\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC1K9c98cJ/d0AF\nRogj9c1BZ4/CVp58O0TBATObQIA1uIoAF3iQAAFQwcNW3tHQSXHvnM/+KEQmZVBd\nMBkIvImGWyGagRpmJABbUXUF6bCnELh4K6pykduAfDs+3UpRgPz/wxKTc+VObbYj\nE71MGT3YTr8sB+JMpEiqRaI5LZVEUR1raz/qd2CHXwhwzR9g9BZP38/2VjlbmIRm\n+VLV6bE7I+Fps2Yo/q11BLV+nZM4E3EJbOvYAc80+wqgkqM7REwcb9yeLPt9Ig4I\n4XcuUH4hbfhehejkdjc9iendhciendklN+Gg4EQBytKOr4DauhFGdifcpYt2kEHSfpRmC\nvubqsFcZAgMBAAECggEAJD0Zt81E/2QmDSgXkUHYha2mZtQWrXjZftWzselL+/Lm\nv6/yMLOfj7zCSv0U8NnQDYLLY+ZAA4IeehVl3IaB57sQ1KvgUPAAlkOL6dvdtv00\nOO1bEcG1K1UuMJvpAraPZMVrUM1M38w4M3n+Ult2MG9H9BG7pWLzGgQFt/QzOE+/\nL8sgoXaP7m70tXjmfZwEJfbcnczvsuOIXwgldDkJ9uJyGDYk/dRgfbdLo+gUyHTQ\nHQRk7qZx70tL6Y5QLyl9cnguBJoLane3vbZEYFLX2eISiF4xyO7KOIT6mcIjAVXA\nCM5+byoypgFyxGUKq2XbCtwl1jK5+jqaE951ohJtdfefefefeeX79cOxy72JRPeKlLZ\nPd91OE2UbUaCqlRXEm9FcwuWeA4wSUFwACSLqJ8LN5vnmLeR53uow/kP794Sxmhz\njpQmPJyavcL8+TI/PUphuZzvBigkyjjIYaUh+XeZegdVcApuB3dOU0GwrTgMACjN\nUr/67XO/c/iolZIMV95JQBhEOwKBgQDWyMToTePz8Xqx5JGrf/fUUN4q9lUbwZZy\nI0wyIbruEAnvpPYbf6s81/tTPA5yuav3d++zYt0W4VZRzb1+y4exQCC8tzAhdiWf\n3Bd2gFYNcpopL4WhMgUT/igM4Y1L/TMZ6bOMAn7OguwIbli5Ebxdgu+rr2OBf+sD\nCuEOI/uAuwKBgFW6x9P7Kl7Y+5lRjlDnaqccMljCRaMswo1LKVgWQ7x6b4+mFc/E\njr3PtUz7x+7bx82qbILlQyWborwrf16ZdaH0oGwi+J38xYEr8TL5QR/4fsmUa5TK\nh4gEhgIthfeienxckedheikcnienekche3ro5oVV7oVNIqSztScnX34Pb1LvAoGAHrb/\nUakx3ATAYwgovLnEGxylaMdpTFrWxOO/Vbv1G243vYl9mFkdh8nrKu//sPBUY0NH\niAOvUkJPMcuWObepY/OjutkHjQF0R/QVduDLbYjh+tnM5kxc5YsG9zCaIC/JSv9c\nqb0BnU6jqmD9VxnuMgEzfP3L4Q0F8phfueilwefuiioerwhiofewahioEWIAy1J4wyuYqi08x\nfnQ77LYX17DtOGE1fu4emBemUPrn3PPY8no8kVoG/B+2CEnJ4EXe9uF8YmNxg1su\nBfWM+dLbX58Ek1tI2XQpEfjFD9tzPqrY9bwY0R09Cqglp+5Hyqbm0lhGrtMNFCV+\n9S7Yi5aJQ4gYUm7NavSXSv0=\n'
CLIENT_EMAIL="firebase-adminsdk-2gemi@castaway-91137.iam.gserviceaccount.com"
```

5. Run Docker

```bash
npm run deploy
```

## Client Side

To communicate with the server on the client side, the client will first connect to the server and add several event listeners as listed below.

### Streamer

1. Connection to server

Use this [guide](https://socket.io/docs/v4/client-initialization/). The url is `ws://localhost:3000/streamer` if run on local docker container. Send it with [extra headers](https://socket.io/docs/v4/client-options/#extraheaders) `id-token` and `livestream-id`.

e.g.
```javascript
io.connect("ws://localhost:3000/streamer", {
  extraHeaders: {
    "id-token": "...",
    "livestream-id": "...",
  }
})
```

2. Success event listener

Add an [event listener](https://socket.io/docs/v4/listening-to-events/) for the event name `success`. The payload is a string which contains the success message.

e.g.
```javascript
socket.on("success", (message) => {
  console.log(message);
})
```

3. Error event listener

Add an [event listener](https://socket.io/docs/v4/listening-to-events/) for the event name `error`. The payload is a string which contains the error message.

e.g.
```javascript
socket.on("error", (error) => {
  console.log(error);
})
```

4. Disconnect event listener

Add an [event listener](https://socket.io/docs/v4/listening-to-events/) for the event name `disconnect`. The payload is the [reason](https://socket.io/docs/v3/client-socket-instance/#disconnect) for disconnection.

e.g.
```javascript
socket.on("error", (reason) => {
  console.log(reason);
  // Show disconnection screen
})
```

5. Upload event emitter

To send audio packets to the server (which the payload will be received by the listeners on the `audio` event), use the [event emitter](https://socket.io/docs/v4/emitting-events/) with the event name `upload`.

e.g.
```javascript
socket.emit("upload", audioFile); //audioFile can be a 5 seconds audio clip in mp4 format
```

## Listener

1. Connection to server

Use this [guide](https://socket.io/docs/v4/client-initialization/). The url is `ws://localhost:3000/listener` if run on local docker container. Send it with [extra headers](https://socket.io/docs/v4/client-options/#extraheaders) `id-token` and `livestream-id`.

e.g.
```javascript
io.connect("ws://localhost:3000/listener", {
  extraHeaders: {
    "id-token": "...",
    "livestream-id": "...",
  }
})
```

2. Success event listener

Add an [event listener](https://socket.io/docs/v4/listening-to-events/) for the event name `success`. The payload is a string which contains the success message.

e.g.
```javascript
socket.on("success", (message) => {
  console.log(message);
})
```

3. Error event listener

Add an [event listener](https://socket.io/docs/v4/listening-to-events/) for the event name `error`. The payload is a string which contains the error message.

e.g.
```javascript
socket.on("error", (error) => {
  console.log(error);
})
```

4. Disconnect event listener

Add an [event listener](https://socket.io/docs/v4/listening-to-events/) for the event name `disconnect`. The payload is the [reason](https://socket.io/docs/v3/client-socket-instance/#disconnect) for disconnection.

e.g.
```javascript
socket.on("error", (reason) => {
  console.log(reason);
  // Show disconnection screen
})
```

5. Audio event listener

Add an [event listener](https://socket.io/docs/v4/listening-to-events/) for the event name `audio`. The payload is the audio file sent by the streamer using the `upload` event emitter.

e.g.
```javascript
socket.on("audio", (audioFile) => {
  audioStream.push(audioFile); // audio stream can be the continuous stream of audio files beign played in order
});
```

[go to API documentation →](../functions/README.md)

[← back to main documentation](../README.md)