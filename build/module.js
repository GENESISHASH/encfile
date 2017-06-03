(function() {
  var arr, e, encfile, file_copy, file_encd, file_fail, file_orig, fs, iced, l, log, r, zlib, _, __iced_deferrals, __iced_k, __iced_k_noop,
    __slice = [].slice;

  iced = {
    Deferrals: (function() {
      function _Class(_arg) {
        this.continuation = _arg;
        this.count = 1;
        this.ret = null;
      }

      _Class.prototype._fulfill = function() {
        if (!--this.count) {
          return this.continuation(this.ret);
        }
      };

      _Class.prototype.defer = function(defer_params) {
        ++this.count;
        return (function(_this) {
          return function() {
            var inner_params, _ref;
            inner_params = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
            if (defer_params != null) {
              if ((_ref = defer_params.assign_fn) != null) {
                _ref.apply(null, inner_params);
              }
            }
            return _this._fulfill();
          };
        })(this);
      };

      return _Class;

    })(),
    findDeferral: function() {
      return null;
    },
    trampoline: function(_fn) {
      return _fn();
    }
  };
  __iced_k = __iced_k_noop = function() {};

  log = function() {
    var x;
    x = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    try {
      return console.log.apply(console, x);
    } catch (_error) {}
  };

  _ = require('wegweg')({
    globals: true,
    shelljs: true
  });

  fs = require('fs');

  zlib = require('zlib');

  l = (function(_this) {
    return function() {
      var winston, x, _i, _len, _ref;
      winston = new (require('winston')).Logger({
        exitOnError: false,
        transports: [
          new (require('winston')).transports.Console({
            timestamp: true,
            colorize: true
          })
        ]
      });
      _ref = ['info', 'warn', 'error'];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        x = _ref[_i];
        if (!process.env.ENCFILE_SILENCE) {
          _this[x] = winston[x];
        }
      }
      return _this;
    };
  })(this)();

  module.exports = encfile = {
    std: (function() {
      var a, cmd, e, err, help, i, item, r, required, x, ___iced_passed_deferral, __iced_deferrals, __iced_k, _i, _j, _len, _len1;
      __iced_k = __iced_k_noop;
      ___iced_passed_deferral = iced.findDeferral(arguments);
      help = ((function(_this) {
        return function(code) {
          log("Usage: <command> <options>\n\nCommand: encrypt file (e):\n  ./ e --infile <filename> --outfile <filename> --key <secret>\nCommand: decrypt file (d):\n  ./ d --infile <filename> --outfile <filename> --key <secret>");
          return exit(code != null ? code : 0);
        };
      })(this));
      if (_.arg('help')) {
        help();
      }
      a = process.argv;
      i = 0;
      cmd = null;
      for (_i = 0, _len = a.length; _i < _len; _i++) {
        item = a[_i];
        if (item === 'e' || item === 'encrypt') {
          cmd = 'e';
          break;
        }
        if (item === 'd' || item === 'decrypt') {
          cmd = 'd';
          break;
        }
        ++i;
      }
      if (!cmd) {
        l.error('No valid command specified');
        help(1);
      }
      required = ['infile', 'outfile', 'key'];
      for (_j = 0, _len1 = required.length; _j < _len1; _j++) {
        x = required[_j];
        if (!_.arg(x)) {
          err = "`--" + x + "` required";
          l.error(err);
          exit(1);
        }
      }
      (function(_this) {
        return (function(__iced_k) {
          if (cmd === 'e') {
            (function(__iced_k) {
              __iced_deferrals = new iced.Deferrals(__iced_k, {
                parent: ___iced_passed_deferral,
                filename: "/Users/douglaslauer/www/encfile/src/module.iced"
              });
              _this.encrypt(_.arg('infile'), _.arg('outfile'), _.arg('key'), __iced_deferrals.defer({
                assign_fn: (function() {
                  return function() {
                    e = arguments[0];
                    return r = arguments[1];
                  };
                })(),
                lineno: 74
              }));
              __iced_deferrals._fulfill();
            })(function() {
              if (e) {
                l.error(e);
                exit(1);
              }
              return __iced_k(exit(0));
            });
          } else {
            return __iced_k();
          }
        });
      })(this)((function(_this) {
        return function() {
          (function(__iced_k) {
            if (cmd === 'd') {
              (function(__iced_k) {
                __iced_deferrals = new iced.Deferrals(__iced_k, {
                  parent: ___iced_passed_deferral,
                  filename: "/Users/douglaslauer/www/encfile/src/module.iced"
                });
                _this.decrypt(_.arg('infile'), _.arg('outfile'), _.arg('key'), __iced_deferrals.defer({
                  assign_fn: (function() {
                    return function() {
                      e = arguments[0];
                      return r = arguments[1];
                    };
                  })(),
                  lineno: 81
                }));
                __iced_deferrals._fulfill();
              })(function() {
                if (e) {
                  l.error(e);
                  exit(1);
                }
                l.info("File metadata", JSON.stringify(r));
                return __iced_k(exit(0));
              });
            } else {
              return __iced_k();
            }
          })(function() {
            return help(0);
          });
        };
      })(this));
    }),
    encrypt: (function(infile, outfile, key, cb) {
      var data, e, json, start, ___iced_passed_deferral, __iced_deferrals, __iced_k;
      __iced_k = __iced_k_noop;
      ___iced_passed_deferral = iced.findDeferral(arguments);
      start = new Date;
      infile = _.resolve(infile);
      outfile = _.resolve(outfile);
      if (!_.exists(infile)) {
        return cb(new Error("" + infile + " does not exist"));
      }
      (function(_this) {
        return (function(__iced_k) {
          __iced_deferrals = new iced.Deferrals(__iced_k, {
            parent: ___iced_passed_deferral,
            filename: "/Users/douglaslauer/www/encfile/src/module.iced"
          });
          fs.readFile(infile, 'base64', __iced_deferrals.defer({
            assign_fn: (function() {
              return function() {
                e = arguments[0];
                return data = arguments[1];
              };
            })(),
            lineno: 100
          }));
          __iced_deferrals._fulfill();
        });
      })(this)((function(_this) {
        return function() {
          if (e) {
            l.error(e);
            return cb(e);
          }
          json = {
            _: {
              ctime: _.time(),
              mime: _.mime(infile),
              filename: _.base(infile)
            },
            b64: data
          };
          l.info("Encrypting " + (_.base(infile)) + " (" + json._.mime + ") using key: " + key);
          json = JSON.stringify(json);
          json = _.enc(json, key);
          l.info("Encryption finished in " + (new Date - start) + "ms");
          (function(__iced_k) {
            __iced_deferrals = new iced.Deferrals(__iced_k, {
              parent: ___iced_passed_deferral,
              filename: "/Users/douglaslauer/www/encfile/src/module.iced"
            });
            zlib.gzip(json, __iced_deferrals.defer({
              assign_fn: (function() {
                return function() {
                  e = arguments[0];
                  return json = arguments[1];
                };
              })(),
              lineno: 121
            }));
            __iced_deferrals._fulfill();
          })(function() {
            if (e) {
              l.error(e);
              return cb(new Error(e));
            }
            l.info("Gzip compression finished in " + (new Date - start) + "ms, writing file");
            (function(__iced_k) {
              __iced_deferrals = new iced.Deferrals(__iced_k, {
                parent: ___iced_passed_deferral,
                filename: "/Users/douglaslauer/www/encfile/src/module.iced"
              });
              fs.writeFile(outfile, json, __iced_deferrals.defer({
                assign_fn: (function() {
                  return function() {
                    return e = arguments[0];
                  };
                })(),
                lineno: 129
              }));
              __iced_deferrals._fulfill();
            })(function() {
              if (e) {
                l.error(e);
                return cb(new Error(e));
              }
              l.info("File written to disk in " + (new Date - start) + "ms");
              return cb(null, outfile);
            });
          });
        };
      })(this));
    }),
    decrypt: (function(infile, outfile, key, cb) {
      var e, err, json, start, ___iced_passed_deferral, __iced_deferrals, __iced_k;
      __iced_k = __iced_k_noop;
      ___iced_passed_deferral = iced.findDeferral(arguments);
      if (!_.exists(infile)) {
        return cb(new Error("" + infile + " does not exist"));
      }
      start = new Date;
      (function(_this) {
        return (function(__iced_k) {
          __iced_deferrals = new iced.Deferrals(__iced_k, {
            parent: ___iced_passed_deferral,
            filename: "/Users/douglaslauer/www/encfile/src/module.iced"
          });
          fs.readFile(infile, __iced_deferrals.defer({
            assign_fn: (function() {
              return function() {
                e = arguments[0];
                return json = arguments[1];
              };
            })(),
            lineno: 145
          }));
          __iced_deferrals._fulfill();
        });
      })(this)((function(_this) {
        return function() {
          if (e) {
            l.error(e);
            return cb(new Error(e));
          }
          l.info("File read for " + (_.base(infile)) + " finished in " + (new Date - start) + "ms");
          (function(__iced_k) {
            __iced_deferrals = new iced.Deferrals(__iced_k, {
              parent: ___iced_passed_deferral,
              filename: "/Users/douglaslauer/www/encfile/src/module.iced"
            });
            zlib.gunzip(json, __iced_deferrals.defer({
              assign_fn: (function() {
                return function() {
                  e = arguments[0];
                  return json = arguments[1];
                };
              })(),
              lineno: 151
            }));
            __iced_deferrals._fulfill();
          })(function() {
            if (e) {
              l.error(e);
              return cb(new Error(e));
            }
            json = json.toString();
            l.info("Gzip decompression finished in " + (new Date - start) + "ms");
            try {
              json = _.dec(json, key);
              json = JSON.parse(json);
            } catch (_error) {
              err = "File decryption failed with key: " + key;
              l.error(err);
              return cb(new Error(err));
            }
            l.info("File decryption finished in " + (new Date - start) + "ms, writing file");
            (function(__iced_k) {
              __iced_deferrals = new iced.Deferrals(__iced_k, {
                parent: ___iced_passed_deferral,
                filename: "/Users/douglaslauer/www/encfile/src/module.iced"
              });
              fs.writeFile(outfile, json.b64, 'base64', __iced_deferrals.defer({
                assign_fn: (function() {
                  return function() {
                    return e = arguments[0];
                  };
                })(),
                lineno: 168
              }));
              __iced_deferrals._fulfill();
            })(function() {
              if (e) {
                l.error(e);
                return cb(new Error(e));
              }
              l.info("File written to disk in " + (new Date - start) + "ms");
              return cb(null, json._);
            });
          });
        };
      })(this));
    })
  };

  if (!module.parent) {
    (function(_this) {
      return (function(__iced_k) {
        if (_.arg('test')) {
          arr = [file_orig = __dirname + '/../test/image.png', file_encd = __dirname + '/../test/image.enc', file_copy = __dirname + '/../test/image-copy.png', file_fail = __dirname + '/../test/image-fail.png'];
          (function() {
            var f, x, _i, _len, _results;
            x = _.clone(arr);
            x.shift();
            if (_.exists(f)) {
              _results = [];
              for (_i = 0, _len = x.length; _i < _len; _i++) {
                f = x[_i];
                _results.push(rm(f));
              }
              return _results;
            }
          })();
          (function(__iced_k) {
            __iced_deferrals = new iced.Deferrals(__iced_k, {
              filename: "/Users/douglaslauer/www/encfile/src/module.iced"
            });
            encfile.encrypt(file_orig, file_encd, 'secret', __iced_deferrals.defer({
              assign_fn: (function() {
                return function() {
                  e = arguments[0];
                  return r = arguments[1];
                };
              })(),
              lineno: 194
            }));
            __iced_deferrals._fulfill();
          })(function() {
            if (e) {
              throw e;
            }
            (function(__iced_k) {
              __iced_deferrals = new iced.Deferrals(__iced_k, {
                filename: "/Users/douglaslauer/www/encfile/src/module.iced"
              });
              encfile.decrypt(file_encd, file_copy, 'secret', __iced_deferrals.defer({
                assign_fn: (function() {
                  return function() {
                    e = arguments[0];
                    return r = arguments[1];
                  };
                })(),
                lineno: 197
              }));
              __iced_deferrals._fulfill();
            })(function() {
              if (e) {
                throw e;
              }
              (function(__iced_k) {
                __iced_deferrals = new iced.Deferrals(__iced_k, {
                  filename: "/Users/douglaslauer/www/encfile/src/module.iced"
                });
                encfile.decrypt(file_encd, file_fail, 'different', __iced_deferrals.defer({
                  assign_fn: (function() {
                    return function() {
                      e = arguments[0];
                      return r = arguments[1];
                    };
                  })(),
                  lineno: 201
                }));
                __iced_deferrals._fulfill();
              })(function() {
                if (!e) {
                  throw new Error('This should have failed');
                }
                log("Finished");
                return __iced_k(exit(0));
              });
            });
          });
        } else {
          return __iced_k(encfile.std());
        }
      });
    })(this)(__iced_k);
  } else {
        if (process.env.ENCFILE_STD) {
      encfile.std();
    } else {
      process.env.ENCFILE_SILENCE = 1;
    }
    __iced_k();;
  }

}).call(this);
