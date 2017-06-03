# vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2
log = (x...) -> try console.log x...

_ = require('wegweg')({
  globals: yes
  shelljs: yes
})

fs = require 'fs'
zlib = require 'zlib'

# create logger
l = (do =>
  winston = (new (require 'winston').Logger({
    exitOnError: no
    transports: [
      new ((require 'winston').transports.Console)({
        timestamp: yes
        colorize: yes
      })
    ]
  }))
  for x in ['info','warn','error']
    @[x] = winston[x] if !process.env.ENCFILE_SILENCE
  @
)

module.exports = encfile = {
  std: (->
    help = ((code) =>
      log """
        Usage: ./ <command> <options>
          Command: encrypt file (e):
            ./ e --infile <filename> --outfile <filename> --key <secret>
          Command: decrypt file (d):
            ./ d --infile <filename> --outfile <filename> --key <secret>
      """
      exit(code ? 0)
    )

    help() if _.arg('help')

    a = process.argv

    i = 0
    cmd = null

    for item in a
      if item in ['e','encrypt']
        cmd = 'e'
        break
      if item in ['d','decrypt']
        cmd = 'd'
        break
      ++ i

    if !cmd
      l.error 'No valid command specified'
      help(1)

    required = [
      'infile'
      'outfile'
      'key'
    ]

    for x in required
      if !_.arg(x)
        err = "`--#{x}` required"
        l.error err
        exit 1

    if cmd is 'e'
      await @encrypt _.arg('infile'), _.arg('outfile'), _.arg('key'), defer e,r
      if e
        l.err e
        exit 1
      exit 0

    if cmd is 'd'
      await @decrypt _.arg('infile'), _.arg('outfile'), _.arg('key'), defer e,r
      if e
        l.err e
        exit 1
      l.info "File metadata", JSON.stringify(r)
      exit 0

    return help(0)
  )

  encrypt: ((infile,outfile,key,cb) ->
    start = new Date

    infile = _.resolve infile
    outfile = _.resolve outfile

    if !_.exists(infile)
      return cb new Error "#{infile} does not exist"

    await fs.readFile infile, 'base64', defer e,data
    if e
      l.error e
      return cb e

    json = {
      _: {
        ctime: _.time()
        mime: _.mime(infile)
        filename: _.base(infile)
      }
      b64: data
    }

    l.info "Encrypting #{_.base infile} (#{json._.mime}) using key: #{key}"

    json = JSON.stringify(json)
    json = _.enc(json,key)

    l.info "Encryption finished in #{new Date - start}ms"

    await zlib.gzip json, defer e,json
    if e
      l.error e
      return cb new Error e

    l.info "Gzip compression finished in #{new Date - start}ms, writing file"

    #_.writes outfile, json
    await fs.writeFile outfile, json, defer e
    if e
      l.error e
      return cb new Error e

    l.info "File written to disk in #{new Date - start}ms"

    return cb null, outfile
  )

  decrypt: ((infile,outfile,key,cb) ->
    if !_.exists(infile)
      return cb new Error "#{infile} does not exist"

    start = new Date

    await fs.readFile infile, defer e,json
    if e
      l.error e; return cb new Error e

    l.info "File read for #{_.base infile} finished in #{new Date - start}ms"

    await zlib.gunzip json, defer e,json
    if e
      l.error e; return cb new Error e

    json = json.toString()

    l.info "Gzip decompression finished in #{new Date - start}ms"

    try
      json = _.dec(json,key)
      json = JSON.parse(json)
    catch
      err = "File decryption failed with key: #{key}"
      l.error err; return cb new Error(err)

    l.info "File decryption finished in #{new Date - start}ms, writing file"

    await fs.writeFile outfile, json.b64, 'base64', defer e
    if e
      l.error e; return cb new Error e

    l.info "File written to disk in #{new Date - start}ms"

    return cb null, json._
  )
}

##
if !module.parent
  if _.arg('test')
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

  else
    encfile.std()
else
  # silence winston on module require
  process.env.ENCFILE_SILENCE = 1

