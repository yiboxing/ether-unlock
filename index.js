var ethUtil = require('ethereumjs-util');

//------------------------------------------------------------------------------
//  Global variables
//------------------------------------------------------------------------------
var config = {
  'sk': '*****80b812e572e1521b5ece734ebb10c194b4ce90e0db9ddd003fe6d65fd3d',
  'target_address': '1320df5d121d55d7b88fe8f4e3a5d23e1aeee05a'
};

var count = 0;
var total = 0;
var progress = 0;

//------------------------------------------------------------------------------
//  Start from here
//------------------------------------------------------------------------------

main();

//------------------------------------------------------------------------------
//  All the implementation goes below
//------------------------------------------------------------------------------


function main() {
  console.log('Start..');
  numberOfStars = config.sk.split('*').length - 1;
  console.log('Number of *: ' + numberOfStars.toString());
  total = Math.pow(16, numberOfStars);
  console.log('Total number of combinations: ')
  tryOneDigit('0x' + config.sk)
}

function tryOneDigit(sk) {
  var index = sk.indexOf('*');
  if (index == -1) {
    check(sk, config.target_address)
  } else {
    charSet = '0123456789abcdef'
    for (var i = 0; i < charSet.length; i++) {
      var char = charSet.charAt(i);
      tryOneDigit(sk.substr(0, index) + char + sk.substr(index + 1))
    }
  }
}

function check(sk, target) {
  tempAddress = ethUtil.privateToAddress(sk).toString('hex');
  if (tempAddress == target) {
    console.log('-----KEY FOUND-----');
    console.log(sk);
    process.exit();
  } else {
    count += 1;
    var currentProgress = Math.floor(count / total * 100);
    if (currentProgress > progress)
    console.log('Progress: ' + currentProgress.toString() + '%');
    progress = currentProgress;
  }
}
