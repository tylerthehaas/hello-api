/**
 * Homework Assignment #1
 *
 * API has one endpoint `/hello` that will return a hello message string
 */

// Dependencies
const fs = require("fs");
const http = require("http");
const https = require("https");
const url = require("url");
const { StringDecoder } = require("string_decoder");
const config = require("./config");

function hello(data, cb) {
  cb(200, { greeting: "hello good sir! You're looking mighty spiffy today!" });
}

function notFound(data, cb) {
  cb(404);
}

const router = {
  hello,
  notFound,
};

function unifiedServer(req, res) {
  const parsedUrl = url.parse(req.url, true);
  const path = parsedUrl.pathname;
  const trimmedPath = path.replace(/^\/+|\/+$/g, "");
  const { query } = parsedUrl;
  const { headers, method } = req;
  method.toUpperCase();
  const decoder = new StringDecoder("utf-8");
  let buffer = "";
  req.on("data", data => {
    buffer += decoder.write(data);
  });
  req.on("end", () => {
    buffer += decoder.end();

    const chosenHandler = router[trimmedPath] || router.notFound;

    const data = {
      headers,
      method,
      path: trimmedPath,
      payload: buffer,
      query,
    };

    chosenHandler(data, (statusCode = 200, payload = {}) => {
      const payloadString = JSON.stringify(payload);

      res.setHeader("Content-Type", "application/json");
      res.writeHead(statusCode);
      res.end(payloadString);
    });
  });
}

const httpsServerOpts = {
  key: fs.readFileSync("./https/key.pem"),
  cert: fs.readFileSync("./https/cert.pem"),
};

const httpServer = http.createServer(unifiedServer);
const httpsServer = https.createServer(httpsServerOpts, unifiedServer);

httpServer.listen(
  config.httpPort,
  console.log.bind(this, `Server listening on port ${config.httpPort}...`),
);

httpsServer.listen(
  config.httpsPort,
  console.log.bind(this, `Server listening on port ${config.httpsPort}...`),
);
