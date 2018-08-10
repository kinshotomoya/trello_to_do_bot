const request = require('request')
require('dotenv').config();

const URL = 'https://api.line.me/v2/bot/message/push';
const HEADERS = { 
    'Content-Type': 'application/json',
    'Authorization': `Bearer {${process.env.LINE_CHANNEL__TOKE}}`
}


const push_message_json = {
    'to': 'Uaacd580dab2c95d8d7b907c76ea625b7',
    'messages': [{
        'type': 'text',
        'text': 'ねえねえ、子供の世話頑張ってる？？'
    }]
};


function pushMessage(push_message_json) {
    requestPost(push_message_json);
};


function requestPost() {
    request.post({
        uri: URL,
        headers: HEADERS,
        json: push_message_json,
    }, (err, req, res) => {
        if (err) {
            console.log(err);
        } else {
            console.log('message送信完了しました。')
        };
    });

}

pushMessage(push_message_json);
