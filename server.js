const app = require('./backend/app');
const http = require("http");
// const debug = require("debug");

const port = process.env.PORT || 3000;

app.set("port", port);
const server = http.createServer(app);
server.listen(port, () => {
  console.log("Server started on port " + port);
});
