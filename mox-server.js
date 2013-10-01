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
        contentPath = (process.platform === "win32" ? process.env["TEMP"] + "/mox/" : "/tmp/mox/");

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

    // params for webmaker-suite buckets
    app.param("user", function(req, res, next, user) { req.user = user; next(); });
    app.param("tool", function(req, res, next, tool) { req.tool = tool; next(); });
    app.param("page", function(req, res, next, page) { req.page = page; next(); });

    app.get('/*', function(req, res) {
      var path = encodeURIComponent(req.params[0]),
          content = fs.readdirSync(contentPath),
          rendered = false,
          file;
      content.forEach(function(bucketDir) {
        file = contentPath + "/" + bucketDir + "/" + path;
        if(fs.existsSync(file)) {
          res.write(fs.readFileSync(file));
          rendered = true;
        }
      });
      if(!rendered) {
        res.json({error: 404, message: "could not find "+path});
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
