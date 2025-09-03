const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
app.use(cors());
app.use(bodyParser.json());

let latestData = {};
let lastCommand = null;

app.post("/data", (req, res) => {
  latestData = req.body;
  console.log("Recebido:", latestData);
  res.sendStatus(200);
});

app.get("/data", (req, res) => {
  res.json(latestData);
});

// App envia comando
app.post("/commands", (req, res) => {
  lastCommand = req.body.command;
  console.log("Comando recebido do app:", lastCommand);
  console.log("Device ID:", req.body.device_id);
  res.json({ status: "ok", command: lastCommand });
});

// ESP busca último comando
app.get("/commands/:deviceId/latest", (req, res) => {
  console.log("ESP solicitou comando para:", req.params.deviceId);
  console.log("Último comando disponível:", lastCommand);
  
  if (lastCommand) {
    const cmd = lastCommand;
    lastCommand = null; // reseta (comando consumido)
    res.json(cmd);
    console.log("Comando enviado para ESP:", cmd);
  } else {
    res.json(null);
    console.log("Nenhum comando para enviar");
  }
});

app.listen(3001, "0.0.0.0", () => {
  console.log("Servidor rodando em http://0.0.0.0:3001");
});