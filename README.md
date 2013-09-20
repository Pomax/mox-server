A tiny server for hosting `noxmox` mox data (emulated S3 data) as text/html on localhost.

Use: `require("mox-server").runServer(options)`

`options` is optional, but when passed should be an object of the form:

```
{
  port: <number>,
  bucket: <string>
}
```

Both are optional, with `port` setting the port to listen on (defaulting to 12319)
and `bucket` indicating the S3 bucketname you with to use (defaulting to an empty string).
