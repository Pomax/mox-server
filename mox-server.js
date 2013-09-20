/**
 * A tiny server for hosting the noxmox "mox" content where localhost sessions can find it.
 */
module.exports = {
  runServer: function(options, onStart) {
    if(typeof options === "function") {
      onStart = options;
      options = false;
    }

    options = options || {
      port: 12319,
      bucket: ""
    };

    var moxserver = require('./package'),
        express = require("express"),
        app = express(),
        bucket = options.bucket || "",
        port = options.port || 12319,
        contentPath = (process.platform === "win32" ? process.env["TEMP"] + "/mox/" : "/tmp/mox/") + bucket + "/";

    // Just one job: serve static HTML content.
    app.disable('x-powered-by');
    express.static.mime.default_type = "text/html";
    app.use(express.static(contentPath));

    // DEVOPS - Healthcheck
    app.get('/healthcheck', function( req, res ) {
      res.json({
        http: "okay",
        name: moxserver.name,
        version: moxserver.version
      });
    });

    // Run the server, unless it's already running.
    require('request')('http://localhost:' + port + "/healthcheck", function (err, res, body) {
      if (!!err) {
        app.listen(port, function() {
          console.log("Express server for noxmox listening on http://localhost:"+port+", serving content from " + contentPath);
          if (onStart) onStart();
        });
        return;
      }
      if (res.statusCode == 200) {
        try {
          data = JSON.parse(body);
          if(data.name === moxserver.name) {
            console.log("Mox-server is already running on http://localhost:"+port+". No need to run again.");
          }
        } catch (e) { console.error("There is already something running on http://localhost:"+port+", and it's not a mox-server."); }
      } else {
        console.error("There is already something running on http://localhost:"+port+", and it's not a mox-server.");
      }
    });
  }
};
