const basicAuth = require('basic-auth')
const timingSafeCompare  = require('tsscmp')

function check(name, pass) {
  var valid = true

  // Simple method to prevent short-circut and use timing-safe compare
  valid = timingSafeCompare(name, 'john') && valid
  valid = timingSafeCompare(pass, 'secret') && valid

  return valid
}


module.exports = {
  initialize(schemes) {
    // schemes will contain securitySchemes as found in the openapi specification
   console.log("Initialize:", JSON.stringify(schemes));
  },



  async petstore_auth(req, reply, params) {
    console.log("params",params)
    console.log("BasicAuth: Authenticating request");

    const credentials = basicAuth(req);
    console.log(credentials);

    if(!credentials || !check(credentials.name, credentials.pass)) {
      reply.code(401).header('WWW-Authenticate', 'Basic realm="KORTxyz"')
    }
  },

  // Security scheme: api_key
  // Type: apiKey
  async api_key(req, reply, params) {
    console.log("api_key: Authenticating request");

    // If validation fails: throw new Error('Could not authenticate request')
    // Else, simply return.

    // The request object can also be mutated here (e.g. to set 'req.user')
  }
}