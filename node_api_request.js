const request = require('request')
require('dotenv').config();

const URL = 'https://api.line.me/v2/bot/message/multicast';
const HEADERS = { 
    'Content-Type': 'application/json',
    'Authorization': `Bearer {${process.env.LINE_CHANNEL__TOKE}}`
}

const USERLIST = ['Uaacd580dab2c95d8d7b907c76ea625b7', 'Uf8133ed6ed6dc6b34d8646ba33de303f', 'Ub8e48bbd0b4dea8ea0f6984a8ea0bfa2', 'U99a4a2253412238a0b510cacd34d39ff'];


const push_message_json = {
    'to': USERLIST,
    'messages': [{
        'type': 'text',
        'text': 'ねえねえ、子供の世話頑張ってる？？'
    }]
};

const quick_reply_json = {
    'to': USERLIST,
    'messages': [
        {
            'type': 'text',
            'text': '仕事は疲れた？？',
            'quickReply': {
                'items': [
                    {
                        'type': 'action',
                        'action': {
                            'type': 'message',
                            'label': '日本食',
                            'text': 'うん...'
                        }
                    },
                    {
                        'type': 'action',
                        'action': {
                            'type': 'message',
                            'label': '中華',
                            'text': 'いいえ。。。'
                        }
                    }
                ]
            }
        }    
    ]
}

const stamp_json = {
    'to': USERLIST,
    'messages': [
        {
            'type': 'sticker',
            'packageId': '1',
            'stickerId': '3'
        }
    ]
}

const audio_message_json = {
    'to': USERLIST,
    'messages': [
        {
            'type': 'audio',
            'originalContentUrl': './life.ma4', //ここ、HTTPSじゃないとあかん
            'duration': '600000'
        }
    ]
}

const location_json = {
    'to': USERLIST,
    'messages': [
        {
            'type': 'location',
            'title': ' 僕の家',
            'address': '奈良県北葛城郡広陵町馬見北',
            'latitude': '34.550247',
            'longitude': '135.721612'
        }
    ]
}

const image_json = {
    'to': USERLIST,
    'messages': [
        {
            'type': 'image',
            'originalContentUrl': 'https://s3.images-iherb.com/opn/opn02866/y/3.jpg',
            'previewImageUrl': 'https://s3.images-iherb.com/opn/opn02866/y/3.jpg'
        }
    ]
}

function pushMessage(push_message_json) {
    requestPost(push_message_json);
};


function pushQuickReply(quick_reply_json) {
    requestPost(quick_reply_json);

};


function pushStamp(stamp_json) {
    requestPost(stamp_json);
};

function pushAudio(audio_message_json) {
    requestPost(audio_message_json);
};

function pushLocation(location_json) {
    requestPost(location_json);
};

function pushImage(image_json) {
    requestPost(image_json);
}

function requestPost(send_json) {
    request.post({
        uri: URL,
        headers: HEADERS,
        json: send_json,
    }, (err, req, res) => {
        if (err) {
            console.log(err);
        } else {
            console.log('message送信完了しました。')
            console.log(res)
        };
    });

}

// pushMessage(push_message_json);
// pushQuickReply(quick_reply_json);
// pushStamp(stamp_json);
// pushAudio(audio_message_json)
// pushLocation(location_json);
pushImage(image_json);
