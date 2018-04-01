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
var charSet = '0123456789abcdef';

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
  config.log.service_name = 'wallet_miner';
  log = new logger.Logger(config.log);

  api.SetConfig(config)
  bluebird.promisifyAll(api);

  log.Info('Generating initial sk..')
  for (var i = 0; i < 64; i++)  {
    sk += charSet.charAt(Math.floor(Math.random() * 16));
  }

  log.Info('Start mining..')
  mine();
}

function mine() {
  // generate new sk
  for (var i = 0; i < 8; i++) {
    var index = i * 8 + Math.floor(Math.random() * 8);
    var char = charSet.charAt(Math.floor(Math.random() * 16));
    sk = sk.substr(0, index) + char + sk.substr(index + 1)
  }
  var address = '0x' + ethUtil.privateToAddress('0x' + sk).toString('hex');
  log.Info(sk + ' : ' + address);

  api.GetNormalTxListAsync(address)
  .then(function(normalTxListResult) {
    var result = JSON.parse(normalTxListResult);
    if (result.result != null) {
      if (result.result.length != 0) {
        log.Error(result.result.length)
        log.Info('Wallet found.');
        log.Info('===================================================');
        process.exit();
      }
      else {
        return api.GetInternalTxListAsync(address);
      }
    } else {
      throw Error('Failed to get NormalTxList.');
    }
  })
  .then(function(internalTxListResult) {
    var result = JSON.parse(internalTxListResult);
    if (result.result != null) {
      if (result.result.length != 0) {
        log.Info('Wallet found.');
        process.exit();
      }

      // try again
      mine();

    } else {
      throw Error('Failed to get NormalTxList.');
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
