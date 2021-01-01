//dot2apc20 v 1.3 by Krzysztof Korzeniowski
var mode = 1; //(mode 1 off/orange/green, mode 2 off/green/blink, mode 3 off/off/green
var sessionnr = 0;
var pageIndex = 0;
var wing = 1;
var request = 0;
var controller = 0;
var blackout = false;

if (wing == 1) {
    var button = JSON.parse('{"index":[[307,306,305,304,303,302,301,300],[407,406,405,404,403,402,401,400],[507,506,505,504,503,502,501,500],[607,606,605,604,603,602,601,600],[707,706,705,704,703,702,701,700],[807,806,805,804,803,802,801,800],[113,112,111,110,109,108,107,106],[213,212,211,210,209,208,207,206]]}');
} else if (wing === 2) {
    var button = JSON.parse('{"index":[[315,314,313,312,311,310,309,308],[415,414,413,412,411,410,409,408],[515,514,513,512,511,510,509,508],[615,614,613,612,611,610,609,608],[715,714,713,712,711,710,709,708],[815,814,813,812,811,810,809,808],[121,120,119,118,117,116,115,114],[221,220,219,218,217,216,215,214]]}');
}

var exec = JSON.parse('{"index":[[5,4,3,2,1,0,0,0],[13,12,11,10,9,8,7,6],[21,20,19,18,17,16,15,14]]}');



function interval() {

    if (wing == 2) {

        if (request === 1 || request === 3 || request === 5 || request === 7 || request === 9) {
            //client.send('{"realtime":false,"responseType":"getdata","data":[{"set":"0"}],"worldIndex":0}');
            client.send('{"requestType":"playbacks","startIndex":[308,408,508,608,708,808],"itemsCount":[8,8,8,8,8,8],"pageIndex":' + pageIndex + ',"itemsType":[3,3,3,3,3,3],"view":3,"execButtonViewMode":2,"buttonsViewMode":0,"session":' + sessionnr + ',"maxRequests":1}');

        } else {

            //client.send('{"realtime":false,"responseType":"getdata","data":[{"set":"0"}],"worldIndex":0}');
            client.send('{"requestType":"playbacks","startIndex":[14,114,214],"itemsCount":[8,8,8],"pageIndex":' + pageIndex + ',"itemsType":[2,3,3],"view":2,"execButtonViewMode":1,"buttonsViewMode":0,"session":' + sessionnr + ',"maxRequests":1}');
        }
    }

    if (wing == 1) {
        if (request === 2 || request === 4 || request === 6 || request === 8) {
            //client.send('{"realtime":false,"responseType":"getdata","data":[{"set":"0"}],"worldIndex":0}');
            client.send('{"requestType":"playbacks","startIndex":[6,106,206],"itemsCount":[8,8,8],"pageIndex":' + pageIndex + ',"itemsType":[2,3,3],"view":2,"execButtonViewMode":1,"buttonsViewMode":0,"session":' + sessionnr + ',"maxRequests":1}');

        } else {

            //client.send('{"realtime":false,"responseType":"getdata","data":[{"set":"0"}],"worldIndex":0}');
            client.send('{"requestType":"playbacks","startIndex":[300,400,500,600,700,800],"itemsCount":[8,8,8,8,8,8],"pageIndex":' + pageIndex + ',"itemsType":[3,3,3,3,3,3],"view":3,"execButtonViewMode":2,"buttonsViewMode":0,"session":' + sessionnr + ',"maxRequests":1}');
        }
    }
}

function sleep(time, callback) {
    var stop = new Date()
        .getTime();
    while (new Date()
        .getTime() < stop + time) {;
    }
    callback();
}


var easymidi = require('easymidi');




console.log('MIDI inputs:');

console.log(easymidi.getInputs());



console.log('MIDI outputs:');

console.log(easymidi.getOutputs());

/*
sleep(1000, function() {
   // executes after one second, and blocks the thread
});
*/
var output = new easymidi.Output('Akai APC20 2');

//output.send('sysex',[0xf0, 0x47, 0x00, 0x73, 0x60, 0x00, 0x04, 0x42, 0x08, 0x04, 0x01, 0xf7]); //APC40 mode2

output.send('sysex', [0xF0, 0x47, 0x7F, 0x7B, 0x60, 0x00, 0x04, 0x42, 0x08, 0x02, 0x01, 0xF7]); //APC20 mode2


output.close();

var input = new easymidi.Input('Akai APC20 0');
var output = new easymidi.Output('Akai APC20 1');

sleep(1000, function() {
   // executes after one second, and blocks the thread
});

output.send('noteon', {
	note: 82
	, velocity: 2
	, channel: 0
	});
output.send('noteon', {
	note: 83
	, velocity: 1
	, channel: 0
	});
output.send('noteon', {
	note: 84
	, velocity: 2
	, channel: 0
	});
output.send('noteon', {
	note: 85
	, velocity: 1
	, channel: 0
	});
output.send('noteon', {
	note: 86
	, velocity: 1
	, channel: 0
	});
output.send('noteon', {
	note: 51
	, velocity: 1
	, channel: 0
	});
for (var i = 1; i == 7; i++){
	output.send('noteon', {
		note: 51
		, velocity: 0
		, channel: i
	});
	}



//send fader pos do dot2
input.on('cc', function(msg) {

    if (msg.controller == 7) {
        if (msg.value <= 2) {
            faderValue = 0;
        } else {
            faderValue = (((msg.value) - 2) * 0.008);
        }
        client.send('{"requestType":"playbacks_userInput","execIndex":' + exec.index[wing][msg.channel] + ',"pageIndex":' + pageIndex + ',"faderValue":' + (faderValue) + ',"type":1,"session":' + sessionnr + ',"maxRequests":0}');

    }
    if (msg.controller == 14) {
        if (msg.value <= 2) {
            faderValue = 0;
            blackout = false;
        } else {
            faderValue = (((msg.value) - 2) * 0.8);
        }
        if (blackout == false){
        client.send('{"command":"SpecialMaster 2.1 At ' + (faderValue) + '","session":' + sessionnr + ',"requestType":"command","maxRequests":0}');
        }
    }


    if (msg.controller == 47) {
        if (msg.value == 2) {
            output.send('noteon', {
                note: 51
                , velocity: 0
                , channel: pageIndex
            });
            pageIndex++;
            if (pageIndex == 8 ){pageIndex = 7;}  //if (pageIndex == 1001 ){pageIndex = 1000;}
            
        }
        if (msg.value == 126) {
            output.send('noteon', {
                note: 51
                , velocity: 0
                , channel: pageIndex
            });
            pageIndex--;
            if (pageIndex < 0 ){pageIndex = 0;}
        }
        output.send('noteon', {
            note: 51
            , velocity: 1
            , channel: pageIndex
        });
        client.send('{"command":"Page ' + (pageIndex + 1) + '","session":' + sessionnr + ',"requestType":"command","maxRequests":0}');
    }

});



input.on('noteon', function(msg) {

    if ((msg.note) == 48) {
        client.send('{"requestType":"playbacks_userInput","cmdline":"","execIndex":' + exec.index[wing][msg.channel] + ',"pageIndex":' + pageIndex + ',"buttonId":1,"pressed":true,"released":false,"type":0,"session":' + sessionnr + ',"maxRequests":0}');
    }

    if ((msg.note) == 49) {
        client.send('{"requestType":"playbacks_userInput","cmdline":"","execIndex":' + button.index[7][msg.channel] + ',"pageIndex":' + pageIndex + ',"buttonId":0,"pressed":true,"released":false,"type":0,"session":' + sessionnr + ',"maxRequests":0}');
    }

    if ((msg.note) == 50) {
        client.send('{"requestType":"playbacks_userInput","cmdline":"","execIndex":' + button.index[6][msg.channel] + ',"pageIndex":' + pageIndex + ',"buttonId":0,"pressed":true,"released":false,"type":0,"session":' + sessionnr + ',"maxRequests":0}');
    }

    if ((msg.note) == 51) {
        output.send('noteon', {
            note: 51
            , velocity: 0
            , channel: pageIndex
        });
    
        pageIndex = msg.channel;
    
        output.send('noteon', {
            note: 51
            , velocity: 1
            , channel: pageIndex
        });
        client.send('{"command":"Page ' + (pageIndex + 1) + '","session":' + sessionnr + ',"requestType":"command","maxRequests":0}');
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

    if ((msg.note) == 80) {
        client.send('{"command":"SpecialMaster 2.1 At 0","session":' + sessionnr + ',"requestType":"command","maxRequests":0}');
        blackout = true;
        }

});

input.on('noteoff', function(msg) {

    if ((msg.note) == 48) {
        client.send('{"requestType":"playbacks_userInput","cmdline":"","execIndex":' + exec.index[wing][msg.channel] + ',"pageIndex":' + pageIndex + ',"buttonId":1,"pressed":false,"released":true,"type":0,"session":' + sessionnr + ',"maxRequests":0}');
    }
    if ((msg.note) == 49) {
        client.send('{"requestType":"playbacks_userInput","cmdline":"","execIndex":' + button.index[7][msg.channel] + ',"pageIndex":' + pageIndex + ',"buttonId":0,"pressed":false,"released":true,"type":0,"session":' + sessionnr + ',"maxRequests":0}');
    }

    if ((msg.note) == 50) {
        client.send('{"requestType":"playbacks_userInput","cmdline":"","execIndex":' + button.index[6][msg.channel] + ',"pageIndex":' + pageIndex + ',"buttonId":0,"pressed":false,"released":true,"type":0,"session":' + sessionnr + ',"maxRequests":0}');
    }

    if ((msg.note) == 52) {
        client.send('{"requestType":"playbacks_userInput","cmdline":"","execIndex":' + button.index[5][msg.channel] + ',"pageIndex":' + pageIndex + ',"buttonId":0,"pressed":false,"released":true,"type":0,"session":' + sessionnr + ',"maxRequests":0}');
    }

    if ((msg.note) == 53) {
        client.send('{"requestType":"playbacks_userInput","cmdline":"","execIndex":' + button.index[0][msg.channel] + ',"pageIndex":' + pageIndex + ',"buttonId":0,"pressed":false,"released":true,"type":0,"session":' + sessionnr + ',"maxRequests":0}');
    }

    if ((msg.note) == 54) {
        client.send('{"requestType":"playbacks_userInput","cmdline":"","execIndex":' + button.index[1][msg.channel] + ',"pageIndex":' + pageIndex + ',"buttonId":0,"pressed":false,"released":true,"type":0,"session":' + sessionnr + ',"maxRequests":0}');
    }

    if ((msg.note) == 55) {
        client.send('{"requestType":"playbacks_userInput","cmdline":"","execIndex":' + button.index[2][msg.channel] + ',"pageIndex":' + pageIndex + ',"buttonId":0,"pressed":false,"released":true,"type":0,"session":' + sessionnr + ',"maxRequests":0}');
    }

    if ((msg.note) == 56) {
        client.send('{"requestType":"playbacks_userInput","cmdline":"","execIndex":' + button.index[3][msg.channel] + ',"pageIndex":' + pageIndex + ',"buttonId":0,"pressed":false,"released":true,"type":0,"session":' + sessionnr + ',"maxRequests":0}');
    }

    if ((msg.note) == 57) {
        client.send('{"requestType":"playbacks_userInput","cmdline":"","execIndex":' + button.index[4][msg.channel] + ',"pageIndex":' + pageIndex + ',"buttonId":0,"pressed":false,"released":true,"type":0,"session":' + sessionnr + ',"maxRequests":0}');
    }




    if ((msg.note) == 81) {
	output.send('noteon', {
		note: 84
		, velocity: 1
		, channel: 0
	});
	output.send('noteon', {
		note: 85
		, velocity: 1
		, channel: 0
	});
	output.send('noteon', {
		note: 86
		, velocity: 1
		, channel: 0
	});
	mode = 4;
    }

    if ((msg.note) == 82) {
	output.send('noteon', {
		note: 82
		, velocity: 2
		, channel: 0
	});
	output.send('noteon', {
		note: 83
		, velocity: 1
		, channel: 0
	});
	button = JSON.parse('{"index":[[307,306,305,304,303,302,301,300],[407,406,405,404,403,402,401,400],[507,506,505,504,503,502,501,500],[607,606,605,604,603,602,601,600],[707,706,705,704,703,702,701,700],[807,806,805,804,803,802,801,800],[113,112,111,110,109,108,107,106],[213,212,211,210,209,208,207,206]]}');
	wing = 1;
    }

    if ((msg.note) == 83) {
	output.send('noteon', {
		note: 82
		, velocity: 1
		, channel: 0
	});
	output.send('noteon', {
		note: 83
		, velocity: 2
		, channel: 0
	});
	button = JSON.parse('{"index":[[315,314,313,312,311,310,309,308],[415,414,413,412,411,410,409,408],[515,514,513,512,511,510,509,508],[615,614,613,612,611,610,609,608],[715,714,713,712,711,710,709,708],[815,814,813,812,811,810,809,808],[121,120,119,118,117,116,115,114],[221,220,219,218,217,216,215,214]]}');
	wing = 2;
    }

    if ((msg.note) == 84) {
	output.send('noteon', {
		note: 84
		, velocity: 2
		, channel: 0
	});
	output.send('noteon', {
		note: 85
		, velocity: 1
		, channel: 0
	});
	output.send('noteon', {
		note: 86
		, velocity: 1
		, channel: 0
	});
	mode = 1;
    }

    if ((msg.note) == 85) {
	output.send('noteon', {
		note: 84
		, velocity: 1
		, channel: 0
	});
	output.send('noteon', {
		note: 85
		, velocity: 2
		, channel: 0
	});
	output.send('noteon', {
		note: 86
		, velocity: 1
		, channel: 0
	});
	mode = 2;
    }

    if ((msg.note) == 86) {
	output.send('noteon', {
		note: 84
		, velocity: 1
		, channel: 0
	});
	output.send('noteon', {
		note: 85
		, velocity: 1
		, channel: 0
	});
	output.send('noteon', {
		note: 86
		, velocity: 2
		, channel: 0
	});
	mode = 3;
    }


});




//WEBSOCKET-------------------
var W3CWebSocket = require('websocket')
    .w3cwebsocket;

var client = new W3CWebSocket('ws://localhost:80/');


client.onerror = function() {
    console.log('Connection Error');
};

client.onopen = function() {
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

client.onclose = function() {
    console.log('echo-protocol Client Closed');
};

client.onmessage = function(e) {



    request = request + 1;
    //console.log ("Request "+ request);
    if (request >= 9) {
        client.send('{"session":' + sessionnr + '}');

        client.send('{"requestType":"getdata","data":"set","session":' + sessionnr + ',"maxRequests":1}');

        request = 0;
    }


    if (typeof e.data === 'string') {
        //console.log("Received: '" + e.data + "'");
        //console.log("-----------------");
        //console.log(e.data);

        obj = JSON.parse(e.data);


        if (obj.status == "server ready") {
            client.send('{"session":0}')
        }
        if (obj.forceLogin === true) {
            sessionnr = (obj.session);
            client.send('{"requestType":"login","username":"remote","password":"2c18e486683a3db1e645ad8523223b72","session":' + obj.session + ',"maxRequests":10}')
        }

        if (obj.session) {
            sessionnr = (obj.session);
        }


        if (obj.responseType == "login" && obj.result === true) {
            setInterval(interval, 100);
        }


        if (obj.responseType == "getdata") {
            //"data":[{"set":"0"}],"worldIndex":0}){
        }


        if (obj.responseType == "playbacks") { //recive data from dot & set to APC


            if (obj.responseSubType == 3) {


                if (mode == 1) {
                    for (var k = 0; k < 6; k++) {
                        var j = 7;
                        for (i = 0; i < 8; i++) {
                            var m = 3;
                            if (obj.itemGroups[k].items[i][0].isRun == 1) {
                                m = 1; // set color if active to 1 (green)
                            } else if ((obj.itemGroups[k].items[i][0].i.c) == "#000000") {
                                m = 0 // set color if not programed to off (0)
                            } else
                                m = 5; //set color to Orange (5) if programmed but not run(active)

                            var n = k + 53;

                            output.send('noteon', {
                                note: n
                                , velocity: m
                                , channel: j
                            });

                            j = j - 1;
                        }
                    }



                    var j = 7;
                    for (i = 0; i < 8; i++) {

                        output.send('noteon', {
                            note: 52
                            , velocity: obj.itemGroups[5].items[i][0].isRun
                            , channel: j
                        });

                        j = j - 1;
                    }
                }


                if (mode == 3) {
                    for (var k = 0; k < 6; k++) {
                        var j = 7;
                        for (i = 0; i < 8; i++) {

                            if (obj.itemGroups[k].items[i][0].isRun == 1) {
                                m = 2; // set color if active to 1 (green)
                            } else if ((obj.itemGroups[k].items[i][0].i.c) == "#000000") {
                                m = 0 // set color if not programed to off (0)
                            } else
                                m = 1; //set color to Orange (5) if programmed but not run(active)

                            var n = k + 53;

                            output.send('noteon', {
                                note: n
                                , velocity: m
                                , channel: j
                            });

                            j = j - 1;
                        }
                    }


                    var j = 7;
                    for (i = 0; i < 8; i++) {

                        if (obj.itemGroups[5].items[i][0].isRun == 1) {
                            m = 2;
                        } else if ((obj.itemGroups[5].items[i][0].i.c) == "#000000") {
                            m = 0
                        } else
                            m = 1;


                        output.send('noteon', {
                            note: 52
                            , velocity: m
                            , channel: j
                        });

                        j = j - 1;
                    }
                }



                if (mode == 5) {
                    var j = 7;
                    for (i = 0; i < 8; i++) {


                        output.send('noteon', {
                            note: 53
                            , velocity: (obj.itemGroups[0].items[i][0].isRun * 3)
                            , channel: j
                        });

                        j = j - 1;
                    }
                    var j = 7;
                    for (i = 0; i < 8; i++) {


                        output.send('noteon', {
                            note: 54
                            , velocity: (obj.itemGroups[1].items[i][0].isRun * 3)
                            , channel: j
                        });

                        j = j - 1;
                    }
                    var j = 7;
                    for (i = 0; i < 8; i++) {


                        output.send('noteon', {
                            note: 55
                            , velocity: (obj.itemGroups[2].items[i][0].isRun * 5)
                            , channel: j
                        });

                        j = j - 1;
                    }
                    var j = 7;
                    for (i = 0; i < 8; i++) {


                        output.send('noteon', {
                            note: 56
                            , velocity: (obj.itemGroups[3].items[i][0].isRun * 5)
                            , channel: j
                        });

                        j = j - 1;
                    }
                    var j = 7;
                    for (i = 0; i < 8; i++) {


                        output.send('noteon', {
                            note: 57
                            , velocity: obj.itemGroups[4].items[i][0].isRun
                            , channel: j
                        });

                        j = j - 1;
                    }
                    var j = 7;
                    for (i = 0; i < 8; i++) {


                        output.send('noteon', {
                            note: 52
                            , velocity: obj.itemGroups[5].items[i][0].isRun
                            , channel: j
                        });

                        j = j - 1;
                    }
		    }

            if (mode == 4) {
                for (var k = 0; k < 6; k++) {
                    var j = 7;
                    for (i = 0; i < 8; i++) {

                        var n = k + 53;

                        output.send('noteon', {
                            note: n
                            , velocity: obj.itemGroups[k].items[i][0].isRun
                            , channel: j
                        });

                        j = j - 1;
                    }
                }


                var j = 7;
                for (i = 0; i < 8; i++) {


                    output.send('noteon', {
                        note: 52
                        , velocity: obj.itemGroups[5].items[i][0].isRun
                        , channel: j
                    });

                    j = j - 1;
                }
            }

            if (mode == 2) {
                var j = 7;
                for (i = 0; i < 8; i++) {

                    if (obj.itemGroups[0].items[i][0].isRun == 1) {
                        m = 4;
                    } else if ((obj.itemGroups[0].items[i][0].i.c) == "#000000") {
                        m = 0
                    } else
                        m = 3;


                    output.send('noteon', {
                        note: 53
                        , velocity: m
                        , channel: j
                    });

                    j = j - 1;
                }
                var j = 7;
                for (i = 0; i < 8; i++) {

                    if (obj.itemGroups[1].items[i][0].isRun == 1) {
                        m = 4;
                    } else if ((obj.itemGroups[1].items[i][0].i.c) == "#000000") {
                        m = 0
                    } else
                        m = 3;


                    output.send('noteon', {
                        note: 54
                        , velocity: m
                        , channel: j
                    });

                    j = j - 1;
                }
                var j = 7;
                for (i = 0; i < 8; i++) {

                    if (obj.itemGroups[2].items[i][0].isRun == 1) {
                        m = 6;
                    } else if ((obj.itemGroups[2].items[i][0].i.c) == "#000000") {
                        m = 0
                    } else
                        m = 5;


                    output.send('noteon', {
                        note: 55
                        , velocity: m
                        , channel: j
                    });

                    j = j - 1;
                }
                var j = 7;
                for (i = 0; i < 8; i++) {

                    if (obj.itemGroups[3].items[i][0].isRun == 1) {
                        m = 6;
                    } else if ((obj.itemGroups[3].items[i][0].i.c) == "#000000") {
                        m = 0
                    } else
                        m = 5;


                    output.send('noteon', {
                        note: 56
                        , velocity: m
                        , channel: j
                    });

                    j = j - 1;
                }
                var j = 7;
                for (i = 0; i < 8; i++) {

                    if (obj.itemGroups[4].items[i][0].isRun == 1) {
                        m = 2;
                    } else if ((obj.itemGroups[4].items[i][0].i.c) == "#000000") {
                        m = 0
                    } else
                        m = 1;


                    output.send('noteon', {
                        note: 57
                        , velocity: m
                        , channel: j
                    });

                    j = j - 1;
                }
                var j = 7;
                for (i = 0; i < 8; i++) {

                    if (obj.itemGroups[5].items[i][0].isRun == 1) {
                        m = 2;
                    } else if ((obj.itemGroups[5].items[i][0].i.c) == "#000000") {
                        m = 0
                    } else
                        m = 1;


                    output.send('noteon', {
                        note: 52
                        , velocity: m
                        , channel: j
                    });

                    j = j - 1;
                }
        }

            }


            if (obj.responseSubType == 2) { //fwing


                output.send('noteon', {
                    note: 48
                    , velocity: obj.itemGroups[0].items[0][0].isRun
                    , channel: 7
                });

                output.send('noteon', {
                    note: 48
                    , velocity: obj.itemGroups[0].items[1][0].isRun
                    , channel: 6
                });

                output.send('noteon', {
                    note: 48
                    , velocity: obj.itemGroups[0].items[2][0].isRun
                    , channel: 5
                });

                output.send('noteon', {
                    note: 48
                    , velocity: obj.itemGroups[0].items[3][0].isRun
                    , channel: 4
                });

                output.send('noteon', {
                    note: 48
                    , velocity: obj.itemGroups[0].items[4][0].isRun
                    , channel: 3
                });

                output.send('noteon', {
                    note: 48
                    , velocity: obj.itemGroups[0].items[5][0].isRun
                    , channel: 2
                });

                output.send('noteon', {
                    note: 48
                    , velocity: obj.itemGroups[0].items[6][0].isRun
                    , channel: 1
                });

                output.send('noteon', {
                    note: 48
                    , velocity: obj.itemGroups[0].items[7][0].isRun
                    , channel: 0
                });

                output.send('noteon', {
                    note: 49
                    , velocity: obj.itemGroups[2].items[0][0].isRun
                    , channel: 7
                });

                output.send('noteon', {
                    note: 49
                    , velocity: obj.itemGroups[2].items[1][0].isRun
                    , channel: 6
                });

                output.send('noteon', {
                    note: 49
                    , velocity: obj.itemGroups[2].items[2][0].isRun
                    , channel: 5
                });

                output.send('noteon', {
                    note: 49
                    , velocity: obj.itemGroups[2].items[3][0].isRun
                    , channel: 4
                });

                output.send('noteon', {
                    note: 49
                    , velocity: obj.itemGroups[2].items[4][0].isRun
                    , channel: 3
                });

                output.send('noteon', {
                    note: 49
                    , velocity: obj.itemGroups[2].items[5][0].isRun
                    , channel: 2
                });

                output.send('noteon', {
                    note: 49
                    , velocity: obj.itemGroups[2].items[6][0].isRun
                    , channel: 1
                });

                output.send('noteon', {
                    note: 49
                    , velocity: obj.itemGroups[2].items[7][0].isRun
                    , channel: 0
                });

                output.send('noteon', {
                    note: 50
                    , velocity: obj.itemGroups[1].items[0][0].isRun
                    , channel: 7
                });

                output.send('noteon', {
                    note: 50
                    , velocity: obj.itemGroups[1].items[1][0].isRun
                    , channel: 6
                });

                output.send('noteon', {
                    note: 50
                    , velocity: obj.itemGroups[1].items[2][0].isRun
                    , channel: 5
                });

                output.send('noteon', {
                    note: 50
                    , velocity: obj.itemGroups[1].items[3][0].isRun
                    , channel: 4
                });

                output.send('noteon', {
                    note: 50
                    , velocity: obj.itemGroups[1].items[4][0].isRun
                    , channel: 3
                });

                output.send('noteon', {
                    note: 50
                    , velocity: obj.itemGroups[1].items[5][0].isRun
                    , channel: 2
                });

                output.send('noteon', {
                    note: 50
                    , velocity: obj.itemGroups[1].items[6][0].isRun
                    , channel: 1
                });

                output.send('noteon', {
                    note: 50
                    , velocity: obj.itemGroups[1].items[7][0].isRun
                    , channel: 0
                });


            }
        }
    }
}