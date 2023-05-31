# dot2apc20

nodejs code to control dot2 software use Akai APC20 midi controller


Download and instal NODEJS version 14.17 from https://nodejs.org/dist/v14.17.0/node-v14.17.0-x64.msi

Download my code.

----------------------

How to use

run dot2 software

turn on webremote (password remote)


Run my code (select node.exe as default open tool dot2apc20.js file)

or run from cmd line

node dot2apc20.js

--------------------------------

Open dot2apc20.js file in notepad to edit config is need

//config 

var midi_in = 'Akai APC20';     //set correct midi in device name

var midi_out = 'Akai APC20';    //set correct midi out device name

var wing = 1; //wing 1 or 2

var page_mode = 1;   //set page select mode - 0-off, 1-only exec buttons(5), 2-exec buttons and faders together



