/**
 * A tiny server for hosting the noxmox "mox" content where localhost sessions can find it.
 */
module.exports = {
  runServer: function(env) {
    var express = require("express"),
        app = express(),
        bucket = !!env ? env.get("S3_BUCKET", "") : "",
        port = !!env ? env.get("MOX_PORT", 12319) : 12319,
        contentPath = (process.platform === "win32" ? process.env["TEMP"] + "/mox/" : "/tmp/mox/") + bucket + "/";

    // Just one job: serve static HTML content.
    express.static.mime.default_type = "text/html";
    app.use(express.static(contentPath));

    // So: run the server
    app.disable('x-powered-by');
    app.listen(port, function(){
      console.log("Express server for noxmox listening on http://localhost:"+port+", serving content from " + contentPath);
    });
  }
};
