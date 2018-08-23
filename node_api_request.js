const request = require('request')
const get_trello_card = require('./trello');
require('dotenv').config();
const express = require('express');
const app = express();

const URL = 'https://api.line.me/v2/bot/message/multicast';
const HEADERS = { 
    'Content-Type': 'application/json',
    'Authorization': `Bearer {${process.env.LINE_CHANNEL__TOKE}}`
}

const USERLIST = ['Uaacd580dab2c95d8d7b907c76ea625b7'];
// 'Uf8133ed6ed6dc6b34d8646ba33de303f', 'Ub8e48bbd0b4dea8ea0f6984a8ea0bfa2', 'U99a4a2253412238a0b510cacd34d39ff'];
const GET_BOARD_URL = `https://trello.com/1/members/user96518825/boards?key=${process.env.TRELLO_API_KEY}&token=${process.env.TRELLO_TOKEN}&fields=name`;
const GET_LIST_URL = `https://trello.com/1/boards/${process.env.TRELLO_BOARD_ID}/lists?key=${process.env.TRELLO_API_KEY}&token=${process.env.TRELLO_TOKEN}&fields=name`
const GET_CARDS_URL = `https://trello.com/1/lists/${process.env.TRELLO_TO_DO_LIST_ID}/cards?key=${process.env.TRELLO_API_KEY}&token=${process.env.TRELLO_TOKEN}&fields=name`


// -------------LINE JSON ----------------------

class LineSender {
    requestPost(send_json) {
        request.post({
            uri: URL,
            headers: HEADERS,
            json: send_json,
        }, (err, req, res) => {
            if (err) {
                console.log(err);
            } else {
                console.log('message送信完了しました。')
                // console.log(req)
            };
        });
    }
    pushMessage(push_message_json) {
        console.log(push_message_json)
        this.requestPost(push_message_json);
    }
    pushQuickReply(quick_reply_json) {
        this.requestPost(quick_reply_json);

    }

    pushStamp(stamp_json) {
        this.requestPost(stamp_json);
    }

    pushAudio(audio_message_json) {
        this.requestPost(audio_message_json);
    }

    pushLocation(location_json) {
        this.requestPost(location_json);
    }

    pushImage(image_json) {
        this.requestPost(image_json);
    }

    pushImageMap(image_map_json) {
        this.requestPost(image_map_json);
    }

    pushButtonTemplate(button_template_josn) {
        this.requestPost(button_template_josn);
    }

    pushCarousel(carousel_json) {
        this.requestPost(carousel_json);
    }

    make_message_json(cards) {
        const push_message_json = {
            'to': USERLIST,
            'messages': this.make_message_array(cards)
        };
        return push_message_json;
    }

    make_message_array(cards) {
        var message_array = [];
        cards.forEach(card => {
            var hash = {
                'type': 'text',
                'text': card
            };
            message_array.push(hash)
        });
        return message_array;
    }

    make_quick_reply_json() {
        return quick_reply_json;
    }

}



const quick_reply_json = {
    'to': USERLIST,
    'messages': [
        {
            'type': 'text',
            'text': '何を知りたいですか？',
            'quickReply': {
                'items': [
                    {
                        'type': 'action',
                        'action': {
                            'type': 'postback',
                            'data': 'action=to_do_today',
                            'label': '今日すること',
                            'text': '今日すること'
                        }
                    },
                    {
                        'type': 'action',
                        'action': {
                            'type': 'postback',
                            'data': 'action=to_do_tomorrow',
                            'label': '明日すること',
                            'text': '明日すること'
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

const image_map_json = {
    'to': USERLIST,
    'messages': [
        {
            'type': 'imagemap',
            'baseUrl': 'https://s3.images-iherb.com/opn/opn02414/v/1.jpg', //URLが指定のものではないと読み込まれない
            'altText': 'プロテインです。',
            'baseSize': {
                'height': 1040,
                'width': 1040
            },
            'actions': [
                {
                    'type': 'uri',
                    'linkUri': 'http://workout-engineer.com/',
                    'area': {
                        'x': 0,
                        'y': 0,
                        'width': 520,
                        'height': 1040
                    }
                }
            ]
        }
    ]
}

const button_template_josn = {
    'to': USERLIST,
    'messages': [
        {
            'type': 'template',
            'altText': ' プロテインです',
            'template': {
                'type': 'buttons',
                'thumbnailImageUrl': 'https://s3.images-iherb.com/opn/opn02414/v/1.jpg',
                "imageAspectRatio": "rectangle",
                'imageSize': 'cover',
                'imageBackgroundColor': '#FFFFFF',
                'title': 'menu',
                'text': '選んでね',
                'defaultAction': {
                    'type': 'uri',
                    'label': 'detail',
                    'uri': 'http://workout-engineer.com/'
                },
                'actions': [
                    {
                        'type': 'uri',
                        'label': '購入する',
                        'uri': 'http://workout-engineer.com'
                    },
                    {
                        'type': 'postback',
                        'label': '別の商品を選ぶ',
                        'data': 'action=change_item&itemid=100'
                    }
                ]
            }
        }
    ]
}

const carousel_json = {
    'to': USERLIST,
    'messages': [
        {
            'type': 'template',
            'altText': 'オススメのプロテインです',
            'template': {
                'type': 'carousel',
                'columns': [
                    {
                        'thumbnailImageUrl': 'https://s3.images-iherb.com/opn/opn02414/v/1.jpg',
                        'title': 'gold standard',
                        'text': 'これは、gold standardのプロテインです。一番のおすすめです。',
                        'defaultAction': {
                            'type': 'uri',
                            'label': 'link to iherb page',
                            'uri': 'https://www.iherb.com/pr/Optimum-Nutrition-Gold-Standard-100-Whey-Double-Rich-Chocolate-5-lbs-2-27-kg/27509'
                        },
                        'actions': [
                            {
                                'type': 'uri',
                                'label': '購入する',
                                'uri': 'https://www.iherb.com/pr/Optimum-Nutrition-Gold-Standard-100-Whey-Double-Rich-Chocolate-5-lbs-2-27-kg/27509'
                            },
                            {
                                'type': 'uri',
                                'label': '詳細を見る',
                                'uri': 'https://www.iherb.com/pr/Optimum-Nutrition-Gold-Standard-100-Whey-Double-Rich-Chocolate-5-lbs-2-27-kg/27509'
                            },
                            {
                                'type': 'postback',
                                'label': '違うジャンルの商品にする',
                                'data': 'action=buy&itemid=111',
                                'text': 'change'
                            }
                        ]
                    },
                    {
                        'thumbnailImageUrl': 'https://s3.images-iherb.com/msf/msf70386/v/15.jpg',
                        'title': 'gold standard',
                        'text': 'これは、Combatのプロテインです。大人気商品です',
                        'defaultAction': {
                            'type': 'uri',
                            'label': 'link to iherb page',
                            'uri': 'https://www.iherb.com/pr/MusclePharm-Combat-Protein-Powder-Chocolate-Milk-4-lbs-1814-g/34898?rec=iherb-pdp-related'
                        },
                        'actions': [
                            {
                                'type': 'uri',
                                'label': '購入する',
                                'uri': 'https://www.iherb.com/pr/MusclePharm-Combat-Protein-Powder-Chocolate-Milk-4-lbs-1814-g/34898?rec=iherb-pdp-related'
                            },
                            {
                                'type': 'uri',
                                'label': '詳細を見る',
                                'uri': 'https://www.iherb.com/pr/MusclePharm-Combat-Protein-Powder-Chocolate-Milk-4-lbs-1814-g/34898?rec=iherb-pdp-related'
                            },
                            {
                                'type': 'postback',
                                'label': '違うジャンルの商品にする',
                                'data': 'action=change_genre&genre=protein'
                            }
                        ]
                    }
                ]
            }
        }
    ]
}

module.exports = LineSender;
