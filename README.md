# ETHER-UNLOCK

Simple brute force script to crack a lost wallet.
Given a wallet address and a base secret key, this program tries all combinations of the base private key by replacing '*' with a hex digit.
Progress is displayed, serving as a heartbeat, while reducing IO cost.  

## INSTALL
npm install

## SETUP
modify index.js
fill in a base sk, without leading '0x', replace any number of digits with * if unsure
fill in a target wallet address, without leading '0x'

## RUN
node .
