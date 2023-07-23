//dot2apc20 v 1.5.2 by ArtGateOne



//config 

var midi_in = 'Akai APC20';     //set correct midi in device name
var midi_out = 'Akai APC20';    //set correct midi out device name
var wing = 1; //wing 1 or 2
var page_mode = 1;   //set page select mode - 0-off, 1-only exec buttons(5), 2-exec buttons and faders together



//global variables
var color = 5;
var sessionnr = 0;
var pageIndex = 0;
var pageIndex2 = 0;
var request = 0;
var interval_on = 0;
var blackout = 0;
var grandmaster = 100;

if (wing == 1) {
    var button = JSON.parse('{"index":[[307,306,305,304,303,302,301,300],[407,406,405,404,403,402,401,400],[507,506,505,504,503,502,501,500],[607,606,605,604,603,602,601,600],[707,706,705,704,703,702,701,700],[807,806,805,804,803,802,801,800],[113,112,111,110,109,108,107,106],[213,212,211,210,209,208,207,206]]}');
} else if (wing == 2) {
    var button = JSON.parse('{"index":[[315,314,313,312,311,310,309,308],[415,414,413,412,411,410,409,408],[515,514,513,512,511,510,509,508],[615,614,613,612,611,610,609,608],[715,714,713,712,711,710,709,708],[815,814,813,812,811,810,809,808],[121,120,119,118,117,116,115,114],[221,220,219,218,217,216,215,214]]}');
}

var exec = JSON.parse('{"index":[[5,4,3,2,1,0,0,0],[13,12,11,10,9,8,7,6],[21,20,19,18,17,16,15,14]]}');



function interval() {

    if (wing == 2) {
        client.send('{"requestType":"playbacks","startIndex":[308,408,508,608,708,808],"itemsCount":[8,8,8,8,8,8],"pageIndex":' + pageIndex + ',"itemsType":[3,3,3,3,3,3],"view":3,"execButtonViewMode":2,"buttonsViewMode":0,"session":' + sessionnr + ',"maxRequests":1}');
        client.send('{"requestType":"playbacks","startIndex":[14,114,214],"itemsCount":[8,8,8],"pageIndex":' + pageIndex2 + ',"itemsType":[2,3,3],"view":2,"execButtonViewMode":1,"buttonsViewMode":0,"session":' + sessionnr + ',"maxRequests":1}');
    }

    if (wing == 1) {
        client.send('{"requestType":"playbacks","startIndex":[6,106,206],"itemsCount":[8,8,8],"pageIndex":' + pageIndex2 + ',"itemsType":[2,3,3],"view":2,"execButtonViewMode":1,"buttonsViewMode":0,"session":' + sessionnr + ',"maxRequests":1}');
        client.send('{"requestType":"playbacks","startIndex":[300,400,500,600,700,800],"itemsCount":[8,8,8,8,8,8],"pageIndex":' + pageIndex + ',"itemsType":[3,3,3,3,3,3],"view":3,"execButtonViewMode":2,"buttonsViewMode":0,"session":' + sessionnr + ',"maxRequests":1}');
    }
}

function sleep(time, callback) {
    var stop = new Date()
        .getTime();
    while (new Date()
        .getTime() < stop + time) {
        ;
    }
    callback();
}


var easymidi = require('easymidi');

//midi clear function
function midiclear() {
    for (i = 0; i < 90; i++) {
        output.send('noteon', { note: i, velocity: 0, channel: 0 });
        //sleep(10, function () { });
    }
    for (i = 0; i <= 7; i++) {
        output.send('noteon', { note: 48, velocity: 0, channel: i });
        output.send('noteon', { note: 49, velocity: 0, channel: i });
        output.send('noteon', { note: 50, velocity: 0, channel: i });
        output.send('noteon', { note: 51, velocity: 0, channel: i });
        output.send('noteon', { note: 52, velocity: 0, channel: i });
        output.send('noteon', { note: 53, velocity: 0, channel: i });
        output.send('noteon', { note: 54, velocity: 0, channel: i });
        output.send('noteon', { note: 55, velocity: 0, channel: i });
        output.send('noteon', { note: 56, velocity: 0, channel: i });
        output.send('noteon', { note: 57, velocity: 0, channel: i });
    }
    return;
}


//display info
console.log("Akai APC 20 dot2 WING " + wing);
console.log(" ");

//display all midi devices
console.log("Midi IN");
console.log(easymidi.getInputs());
console.log("Midi OUT");
console.log(easymidi.getOutputs());

console.log(" ");

console.log("Connecting to midi device " + midi_in);

//open midi device
var output = new easymidi.Output(midi_out);
output.send('sysex', [0xF0, 0x47, 0x7F, 0x7B, 0x60, 0x00, 0x04, 0x42, 0x08, 0x02, 0x01, 0xF7]); //APC20 mode2
output.close();

var input = new easymidi.Input(midi_in);
var output = new easymidi.Output(midi_out);

//sleep 1000
sleep(1000, function () {
    // executes after one second, and blocks the thread
});

midiclear();

output.send('noteon', { note: 82, velocity: 1, channel: 0 });
for (i = 0; i <= 7; i++) {
    output.send('noteon', { note: 49, velocity: 1, channel: i });
}

//send fader pos do dot2
input.on('cc', function (msg) {

    if (msg.controller == 7) {
        if (msg.value <= 2) {
            faderValue = 0;
        } else {
            faderValue = (((msg.value) - 2) * 0.008);
        }
        client.send('{"requestType":"playbacks_userInput","execIndex":' + exec.index[wing][msg.channel] + ',"pageIndex":' + pageIndex2 + ',"faderValue":' + (faderValue) + ',"type":1,"session":' + sessionnr + ',"maxRequests":0}');

    }
    if (msg.controller == 14) {
        if (msg.value <= 2) {
            faderValue = 0;
        } else {
            faderValue = (((msg.value) - 2) * 0.8);
        }
        if (wing == 1) {
            grandmaster = faderValue;
            if (blackout == 0) {
                client.send('{"command":"SpecialMaster 2.1 At ' + (faderValue) + '","session":' + sessionnr + ',"requestType":"command","maxRequests":0}');
            }
        } else if (wing == 2) {
            client.send('{"command":"SpecialMaster 3.1 At ' + (faderValue * 2.25) + '","session":' + session + ',"requestType":"command","maxRequests":0}');
        }
    }


    /*if (msg.controller == 47) {
        if (msg.value == 2) {
            output.send('noteon', {
                note: 51
                , velocity: 0
                , channel: pageIndex
            });
            pageIndex++;
            if (pageIndex == 8) { pageIndex = 7; }  //if (pageIndex == 1001 ){pageIndex = 1000;}

        }
        if (msg.value == 126) {
            output.send('noteon', {
                note: 51
                , velocity: 0
                , channel: pageIndex
            });
            pageIndex--;
            if (pageIndex < 0) { pageIndex = 0; }
        }
        output.send('noteon', {
            note: 51
            , velocity: 1
            , channel: pageIndex
        });
        client.send('{"command":"Page ' + (pageIndex + 1) + '","session":' + sessionnr + ',"requestType":"command","maxRequests":0}');
    }*/

});



input.on('noteon', function (msg) {

    if ((msg.note) == 48) {
        client.send('{"requestType":"playbacks_userInput","cmdline":"","execIndex":' + exec.index[wing][msg.channel] + ',"pageIndex":' + pageIndex2 + ',"buttonId":1,"pressed":true,"released":false,"type":0,"session":' + sessionnr + ',"maxRequests":0}');
    }

    if ((msg.note) == 49) {
        client.send('{"requestType":"playbacks_userInput","cmdline":"","execIndex":' + exec.index[wing][msg.channel] + ',"pageIndex":' + pageIndex2 + ',"buttonId":0,"pressed":true,"released":false,"type":0,"session":' + sessionnr + ',"maxRequests":0}');
    }

    if ((msg.note) == 50) {
        client.send('{"requestType":"playbacks_userInput","cmdline":"","execIndex":' + button.index[7][msg.channel] + ',"pageIndex":' + pageIndex2 + ',"buttonId":0,"pressed":true,"released":false,"type":0,"session":' + sessionnr + ',"maxRequests":0}');
    }

    if ((msg.note) == 51) {
        client.send('{"requestType":"playbacks_userInput","cmdline":"","execIndex":' + button.index[6][msg.channel] + ',"pageIndex":' + pageIndex2 + ',"buttonId":0,"pressed":true,"released":false,"type":0,"session":' + sessionnr + ',"maxRequests":0}');
    }

    if ((msg.note) == 52) {
        client.send('{"requestType":"playbacks_userInput","cmdline":"","execIndex":' + button.index[5][msg.channel] + ',"pageIndex":' + pageIndex + ',"buttonId":0,"pressed":true,"released":false,"type":0,"session":' + sessionnr + ',"maxRequests":0}');
    }

    if ((msg.note) == 53) {
        client.send('{"requestType":"playbacks_userInput","cmdline":"","execIndex":' + button.index[0][msg.channel] + ',"pageIndex":' + pageIndex + ',"buttonId":0,"pressed":true,"released":false,"type":0,"session":' + sessionnr + ',"maxRequests":0}');
    }

    if ((msg.note) == 54) {
        client.send('{"requestType":"playbacks_userInput","cmdline":"","execIndex":' + button.index[1][msg.channel] + ',"pageIndex":' + pageIndex + ',"buttonId":0,"pressed":true,"released":false,"type":0,"session":' + sessionnr + ',"maxRequests":0}');
    }

    if ((msg.note) == 55) {
        client.send('{"requestType":"playbacks_userInput","cmdline":"","execIndex":' + button.index[2][msg.channel] + ',"pageIndex":' + pageIndex + ',"buttonId":0,"pressed":true,"released":false,"type":0,"session":' + sessionnr + ',"maxRequests":0}');
    }

    if ((msg.note) == 56) {
        client.send('{"requestType":"playbacks_userInput","cmdline":"","execIndex":' + button.index[3][msg.channel] + ',"pageIndex":' + pageIndex + ',"buttonId":0,"pressed":true,"released":false,"type":0,"session":' + sessionnr + ',"maxRequests":0}');
    }

    if ((msg.note) == 57) {
        client.send('{"requestType":"playbacks_userInput","cmdline":"","execIndex":' + button.index[4][msg.channel] + ',"pageIndex":' + pageIndex + ',"buttonId":0,"pressed":true,"released":false,"type":0,"session":' + sessionnr + ',"maxRequests":0}');
    }

    if ((msg.note) == 80) {//blackout
        if (wing == 1) {
            if (blackout == 0) {
                client.send('{"command":"SpecialMaster 2.1 At 0","session":' + sessionnr + ',"requestType":"command","maxRequests":0}');
                blackout = true;
            } else if (blackout == 1) {
                client.send('{"command":"SpecialMaster 2.1 At ' + grandmaster + '","session":' + sessionnr + ',"requestType":"command","maxRequests":0}');
                blackout = 0;
            }
            output.send('noteon', { note: (pageIndex + 82), velocity: 1 + blackout, channel: 0 });
        } else if (wing == 2) {
            client.send('{"command":"Learn SpecialMaster 3.1","session":' + session + ',"requestType":"command","maxRequests":0}');
        }
    }

    if (msg.note == 81) {
        if (color == 5) { color = 0; }
        else if (color == 0) { color = 5; }
    }

    if (msg.note >= 82 && msg.note <= 86) {//page select
        if (page_mode > 0) {
            output.send('noteon', { note: (pageIndex + 82), velocity: 0, channel: 0 });
            pageIndex = msg.note - 82;
            output.send('noteon', { note: (msg.note), velocity: 1 + blackout, channel: 0 });
        }
        if (page_mode == 2) { pageIndex2 = pageIndex; }
    }

});

input.on('noteoff', function (msg) {

    if ((msg.note) == 48) { client.send('{"requestType":"playbacks_userInput","cmdline":"","execIndex":' + exec.index[wing][msg.channel] + ',"pageIndex":' + pageIndex2 + ',"buttonId":1,"pressed":false,"released":true,"type":0,"session":' + sessionnr + ',"maxRequests":0}'); }
    if ((msg.note) == 49) { client.send('{"requestType":"playbacks_userInput","cmdline":"","execIndex":' + exec.index[wing][msg.channel] + ',"pageIndex":' + pageIndex2 + ',"buttonId":0,"pressed":false,"released":true,"type":0,"session":' + sessionnr + ',"maxRequests":0}'); }
    if ((msg.note) == 50) { client.send('{"requestType":"playbacks_userInput","cmdline":"","execIndex":' + button.index[7][msg.channel] + ',"pageIndex":' + pageIndex2 + ',"buttonId":0,"pressed":false,"released":true,"type":0,"session":' + sessionnr + ',"maxRequests":0}'); }
    if ((msg.note) == 51) { client.send('{"requestType":"playbacks_userInput","cmdline":"","execIndex":' + button.index[6][msg.channel] + ',"pageIndex":' + pageIndex2 + ',"buttonId":0,"pressed":false,"released":true,"type":0,"session":' + sessionnr + ',"maxRequests":0}'); }
    if ((msg.note) == 52) { client.send('{"requestType":"playbacks_userInput","cmdline":"","execIndex":' + button.index[5][msg.channel] + ',"pageIndex":' + pageIndex + ',"buttonId":0,"pressed":false,"released":true,"type":0,"session":' + sessionnr + ',"maxRequests":0}'); }
    if ((msg.note) == 53) { client.send('{"requestType":"playbacks_userInput","cmdline":"","execIndex":' + button.index[0][msg.channel] + ',"pageIndex":' + pageIndex + ',"buttonId":0,"pressed":false,"released":true,"type":0,"session":' + sessionnr + ',"maxRequests":0}'); }
    if ((msg.note) == 54) { client.send('{"requestType":"playbacks_userInput","cmdline":"","execIndex":' + button.index[1][msg.channel] + ',"pageIndex":' + pageIndex + ',"buttonId":0,"pressed":false,"released":true,"type":0,"session":' + sessionnr + ',"maxRequests":0}'); }
    if ((msg.note) == 55) { client.send('{"requestType":"playbacks_userInput","cmdline":"","execIndex":' + button.index[2][msg.channel] + ',"pageIndex":' + pageIndex + ',"buttonId":0,"pressed":false,"released":true,"type":0,"session":' + sessionnr + ',"maxRequests":0}'); }
    if ((msg.note) == 56) { client.send('{"requestType":"playbacks_userInput","cmdline":"","execIndex":' + button.index[3][msg.channel] + ',"pageIndex":' + pageIndex + ',"buttonId":0,"pressed":false,"released":true,"type":0,"session":' + sessionnr + ',"maxRequests":0}'); }
    if ((msg.note) == 57) { client.send('{"requestType":"playbacks_userInput","cmdline":"","execIndex":' + button.index[4][msg.channel] + ',"pageIndex":' + pageIndex + ',"buttonId":0,"pressed":false,"released":true,"type":0,"session":' + sessionnr + ',"maxRequests":0}'); }
});




//WEBSOCKET-------------------
var W3CWebSocket = require('websocket')
    .w3cwebsocket;

var client = new W3CWebSocket('ws://localhost:80/');


client.onerror = function () {
    console.log('Connection Error');
};

client.onopen = function () {
    console.log('WebSocket Client Connected');

    function sendNumber() {
        if (client.readyState === client.OPEN) {
            var number = Math.round(Math.random() * 0xFFFFFF);
            client.send(number.toString());
            setTimeout(sendNumber, 1000);
        }
    }
    sendNumber();
};

client.onclose = function () {
    console.log('Client Closed');
    midiclear();
    input.close();
    output.close();
    process.exit();
};

client.onmessage = function (e) {



    request = request + 1;

    if (request >= 9) {
        client.send('{"session":' + sessionnr + '}');

        client.send('{"requestType":"getdata","data":"set","session":' + sessionnr + ',"maxRequests":1}');

        request = 0;
    }


    if (typeof e.data === 'string') {

        obj = JSON.parse(e.data);


        if (obj.status == "server ready") {
            console.log("SERVER READY");
            client.send('{"session":0}')
        }
        if (obj.forceLogin === true) {
            console.log("LOGIN ...");
            sessionnr = (obj.session);
            client.send('{"requestType":"login","username":"remote","password":"2c18e486683a3db1e645ad8523223b72","session":' + obj.session + ',"maxRequests":10}')
        }

        if (obj.session) {
            if (obj.session == -1) {
                console.log("Please turn on Web Remote, and set Web Remote password to \"remote\"");
                midiclear();
                input.close();
                output.close();
                process.exit();
            } else {
                session = (obj.session);
            }
        }


        if (obj.responseType == "login" && obj.result === true) {
            if (interval_on == 0) {
                interval_on = 1;
                setInterval(interval, 100);//80
            }
            console.log("...LOGGED");
            console.log("SESSION " + session);
        }


        if (obj.responseType == "getdata") {
            //"data":[{"set":"0"}],"worldIndex":0}){
        }


        if (obj.responseType == "playbacks") { //recive data from dot & set to APC


            if (obj.responseSubType == 3) {



                for (var k = 0; k < 6; k++) {
                    var j = 7;
                    for (i = 0; i < 8; i++) {
                        var m = 3;
                        if (obj.itemGroups[k].items[i][0].isRun == 1) {
                            m = 1 + blackout; // set color if active to 1 (green)
                        } else if ((obj.itemGroups[k].items[i][0].i.c) == "#000000") {
                            m = 0 // set color if not programed to off (0)
                        } else
                            m = color; //set color to Orange (5) if programmed but not run(active)

                        var n = k + 53;

                        output.send('noteon', {
                            note: n, velocity: m, channel: j
                        });

                        j = j - 1;
                    }
                }



                var j = 7;
                for (i = 0; i < 8; i++) {
                    if (obj.itemGroups[5].items[i][0].isRun) { m = 1 + blackout; } else { m = 0; }
                    output.send('noteon', { note: 52, velocity: m, channel: j });
                    j = j - 1;
                }
            }


            if (obj.responseSubType == 2) { //fwing


                output.send('noteon', { note: 48, velocity: obj.itemGroups[0].items[0][0].isRun, channel: 7 });
                output.send('noteon', { note: 48, velocity: obj.itemGroups[0].items[1][0].isRun, channel: 6 });
                output.send('noteon', { note: 48, velocity: obj.itemGroups[0].items[2][0].isRun, channel: 5 });
                output.send('noteon', { note: 48, velocity: obj.itemGroups[0].items[3][0].isRun, channel: 4 });
                output.send('noteon', { note: 48, velocity: obj.itemGroups[0].items[4][0].isRun, channel: 3 });
                output.send('noteon', { note: 48, velocity: obj.itemGroups[0].items[5][0].isRun, channel: 2 });
                output.send('noteon', { note: 48, velocity: obj.itemGroups[0].items[6][0].isRun, channel: 1 });
                output.send('noteon', { note: 48, velocity: obj.itemGroups[0].items[7][0].isRun, channel: 0 });

                output.send('noteon', { note: 50, velocity: obj.itemGroups[2].items[0][0].isRun, channel: 7 });
                output.send('noteon', { note: 50, velocity: obj.itemGroups[2].items[1][0].isRun, channel: 6 });
                output.send('noteon', { note: 50, velocity: obj.itemGroups[2].items[2][0].isRun, channel: 5 });
                output.send('noteon', { note: 50, velocity: obj.itemGroups[2].items[3][0].isRun, channel: 4 });
                output.send('noteon', { note: 50, velocity: obj.itemGroups[2].items[4][0].isRun, channel: 3 });
                output.send('noteon', { note: 50, velocity: obj.itemGroups[2].items[5][0].isRun, channel: 2 });
                output.send('noteon', { note: 50, velocity: obj.itemGroups[2].items[6][0].isRun, channel: 1 });
                output.send('noteon', { note: 50, velocity: obj.itemGroups[2].items[7][0].isRun, channel: 0 });

                output.send('noteon', { note: 51, velocity: obj.itemGroups[1].items[0][0].isRun, channel: 7 });
                output.send('noteon', { note: 51, velocity: obj.itemGroups[1].items[1][0].isRun, channel: 6 });
                output.send('noteon', { note: 51, velocity: obj.itemGroups[1].items[2][0].isRun, channel: 5 });
                output.send('noteon', { note: 51, velocity: obj.itemGroups[1].items[3][0].isRun, channel: 4 });
                output.send('noteon', { note: 51, velocity: obj.itemGroups[1].items[4][0].isRun, channel: 3 });
                output.send('noteon', { note: 51, velocity: obj.itemGroups[1].items[5][0].isRun, channel: 2 });
                output.send('noteon', { note: 51, velocity: obj.itemGroups[1].items[6][0].isRun, channel: 1 });
                output.send('noteon', { note: 51, velocity: obj.itemGroups[1].items[7][0].isRun, channel: 0 });


            }
        }
    }
}
