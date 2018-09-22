var express = require('express');
var router = express.Router();

var ToneAnalyzerV3 = require('watson-developer-cloud/tone-analyzer/v3');

var toneAnalyzer = new ToneAnalyzerV3({
    version: '2018-09-18',
    username: 'ce587533-dbc5-4907-bca6-78d6d6227f0c',
    password: 'SxgiKmZrauaA',
    url: 'https://gateway.watsonplatform.net/tone-analyzer/api/',
    headers: {
        'Accept-Language': 'es',
        'Content-Language': 'en'
    }
});

// var text = `Ma mère s'appelle Emilie Summer ; elle est infirmière dans un hôpital non loin de notre maison. Nous avons déménagé en France, parce qu'elle a toujours aimé la culture de ce pays.  .
// `
var utterances = [{
        text: "Hello, I'm having a problem with your product.",
        user: "customer"
    },
    {
        text: "OK, let me know what's going on, please.",
        user: "agent"
    },
    {
        text: "Well, nothing is working :(",
        user: "customer"
    },
    {
        text: "Sorry to hear that.",
        user: "agent"
    }
]





router.post('/analizar', (req, res) => {
    let text = req.body.text;

    var toneParams = {
        'tone_input': { 'text': text },
        'content_type': 'application/json'
    };
    toneAnalyzer.tone(toneParams, function(error, toneAnalysis) {

        var toneChatParams = {
            utterances: utterances
        };


        if (error) {
            console.log(error);
            res.json({ error: error })
        } else {
            console.log(JSON.stringify(toneAnalysis, null, 2));
            res.json(toneAnalysis)
        }
    });
})

module.exports = router;