A tiny server for hosting `noxmox` mox data (emulated S3 data) as text/html on localhost.

Use: `require("mox-server").runServer(env)`

`env` is optional, but when passed should be an object with a `.get` function that
spits out the following values:

1. `env.get("MOX_PORT")` => integer port number. Defaults to 12319
2. `env.get("S3_BUCKET")` => an AWS bucket name. Defaults to an empty string
