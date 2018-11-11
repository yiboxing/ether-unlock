var ethUtil = require('ethereumjs-util');
var api = require('./api.js')
var logger = require('./logger.js')
var bluebird = require("bluebird");
var fs = require('fs')

//------------------------------------------------------------------------------
//  Global variables
//------------------------------------------------------------------------------
var configFileName = 'config.cfg';
var sk = '';
var log = null;
var charSet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';

//------------------------------------------------------------------------------
//  Start from here
//------------------------------------------------------------------------------

main();

//------------------------------------------------------------------------------
//  All the implementation goes below
//------------------------------------------------------------------------------


function main() {
  console.log('Loading config file: ' + configFileName)
  try {
    config = JSON.parse(fs.readFileSync(configFileName));
  } catch (err) {
    console.log('Error: unable to load ' + configFileName);
    console.log(err);
    process.exit(1);
  }
  console.log(config);
  config.log.service_name = 'twitch_code_miner';
  log = new logger.Logger(config.log);

  api.SetConfig(config)
  bluebird.promisifyAll(api);

  log.Info('Generating initial key..')
  for (var i = 0; i < 15; i++)  {
    //sk += charSet.charAt(Math.floor(Math.random() * 16));
    sk += charSet.charAt(Math.floor(Math.random() * 36))
  }

  log.Info('Start mining..')
  mine();
}

function mine() {
  // generate new sk
  for (var i = 0; i < 3; i++) {
    var index = i * 5 + Math.floor(Math.random() * 5);
    var char = charSet.charAt(Math.floor(Math.random() * 36));
    sk = sk.substr(0, index) + char + sk.substr(index + 1)
  }
  log.Info(sk);

  api.PostTwitchRedeemCodeAsync(sk)
  .then(function(result) {
    var result = JSON.parse(result);
    if (result[0].data.key != null) {
      process.exit();
    }
  })
  .catch(function(error) {
    if (error != null) {
      log.Error(error.stack)
    }
    // try again
    mine();
  });
}
