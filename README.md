A tiny server for hosting `noxmox` mox data (emulated S3 data) as text/html on localhost.

Use: `require("mox-server").runServer(port, onstarthandler)`

`port` and the `onstarthandler` callback are optional, but when passed should be a number,
and a parameter-less callback function, respectively.

This server simply looks at the mox directory and tries to resolve files to content from buckets.

`mox-server` is smart enough not to run multiple times if you use it across multiple projects,
so if you fire it up several times on the same port, it'll gracefully not run beyond the first call.
