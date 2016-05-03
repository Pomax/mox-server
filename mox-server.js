/**
 * A tiny server for hosting the noxmox "mox" content where localhost sessions can find it.
 */
module.exports = {
  runServer: function(port, onStart) {
    if(typeof port === "function") {
      onStart = port;
      port = false;
    }

    port = port || 12319;

    var moxserver = require('./package'),
        express = require("express"),
        fs = require("fs"),
        app = express(),
        contentPath = (process.platform === "win32" ? process.env["TEMP"] + "/mox" : "/tmp/mox");

    // Why this.
    app.disable('x-powered-by');

    // DEVOPS - Healthcheck
    app.get('/healthcheck', function( req, res ) {
      res.json({
        http: "okay",
        name: moxserver.name,
        version: moxserver.version
      });
    });

    app.get('/*', function(req, res) {
      var content = fs.readdirSync(contentPath),
          rendered = false,
          filename, file, dir,
          path = '/' + req.params[0];

      console.log("[" + (new Date()).toISOString() + "] ", path);

      content.forEach(function(bucketDir) {
        dir = contentPath + "/" + bucketDir + "/";

        // proper location
        filename = encodeURIComponent(path);
        file = dir + filename;
        if(fs.existsSync(file)) {
          res.write(fs.readFileSync(file));
          rendered = true;
        }

        // odd windows location
        filename = encodeURIComponent("\\" + req.params[0].replace(/\//g,"\\"));
        file = dir + filename;
        if(fs.existsSync(file)) {
          res.write(fs.readFileSync(file));
          rendered = true;
        }
      });

      if (!rendered) {
        if (path.indexOf("index.html") === -1) {
          if (path.slice(-1) !== '/') { path += '/'; }
          path += "index.html"
          return res.redirect(path);
        }
        res.json({error: 404, message: "could not find " + req.params[0]});
      }

      res.end();
    });

    // Run the server... unless it's already running on the same port
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
