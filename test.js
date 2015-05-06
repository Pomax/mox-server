var request = require("request");

require("./mox-server").runServer(6661, function() {
  require("./mox-server").runServer(6661);
});
