```
            .-""-.
           / .--. \
          / /    \ \
          | |    | |
          | |.-""-.|
         ///`.::::.`\
        ||| ::/  \:: ;
        ||; ::\__/:: ;
         \\\ '::::' /
     jgs  `=':-..-'`
```

# install

using [npm](https://npmjs.org)

```
npm i encfile --save
sudo npm i -g encfile
```

# example

``` coffeescript
encfile = require 'encfile'

arr = [
  file_orig = __dirname + '/../test/image.png'
  file_encd = __dirname + '/../test/image.enc'
  file_copy = __dirname + '/../test/image-copy.png'
  file_fail = __dirname + '/../test/image-fail.png'
]

do (=>
  x = _.clone(arr)
  x.shift()
  (if _.exists(f) then rm f for f in x)
)

await encfile.encrypt file_orig, file_encd, 'secret', defer e,r
if e then throw e

await encfile.decrypt file_encd, file_copy, 'secret', defer e,r
if e then throw e

# should fail
await encfile.decrypt file_encd, file_fail, 'different', defer e,r
if !e then throw new Error 'This should have failed'

log "Finished"; exit 0
```

# shell

``` shell
Usage: ./ <command> <options>
	Command: encrypt file (e):
		./ e --infile <filename> --outfile <filename> --key <secret>
	Command: decrypt file (d):
		./ d --infile <filename> --outfile <filename> --key <secret> [--meta]
```

``` shell
encfile e --infile file.zip --outfile file.enc --key secret
encfile d --infile file.zip.enc --outfile file.zip.enc --key secret
```


