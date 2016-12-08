module.exports.register = register
module.exports.register.attributes = {
  name: 'hoodie'
}

var path = require('path')
var urlParse = require('url').parse

var corsHeaders = require('hapi-cors-headers')
var hoodieServer = require('@hoodie/server').register
var log = require('npmlog')
var PouchDB = require('pouchdb-core')
var _ = require('lodash')

var registerPlugins = require('./plugins')

function register (server, options, next) {
  options = _.cloneDeep(options)
  if (!options.paths) {
    options.paths = {
      public: 'public'
    }
  }

  // mapreduce is required for `db.query()`
  PouchDB.plugin(require('pouchdb-mapreduce'))

  server.ext('onPreResponse', corsHeaders)

  registerPlugins(server, options, function (error) {
    if (error) {
      return next(error)
    }

    server.register({
      register: hoodieServer,
      options: options
    }, function (error) {
      if (error) {
        return next(error)
      }

      next(null, server, options)
    })
  })
}
