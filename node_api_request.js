const request = require('request')
const axios = require('axios');
const get_trello_card = require('./trello');
require('dotenv').config();
const express = require('express');
const app = express();

const BASE_URL = 'https://api.line.me/v2/bot/message'
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
    async requestPost(send_json, bool_back_to_the_first_quick_reply) {
        try {
            let axios_instance = axios.create({
                url: URL,
                headers: HEADERS,
            });
            let res = await axios_instance.post(URL, send_json);
            // TODO: 最後には、再び「TODOを見る」「TODOを書き込む」のquick_replyを表示する
            if (bool_back_to_the_first_quick_reply) {
            //   最初のquick_replyに戻る必要がある場合にだけ、呼び出す
              let res2 = await axios_instance.post(URL, this.make_first_quick_reply_json())
            }
            console.log('送信しました');
        } catch(err) {
            console.log(err);
        }
    }

    getContent(messageId) {
        console.log(`https://api.line.me/v2/bot/message/${messageId}/content`)

        request.get({
            uri: `https://api.line.me/v2/bot/message/${messageId}/content`,
            headers: HEADERS,
        }, (err, req, res) => {
            if (err) {
                console.log(err);
            } else {
                // 画像を取得
                var buf = new Buffer(res);
                var string = buf.toString('base64');
                console.log(string)
            }
        })
    }
    pushMessage(push_message_json) {
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

    make_message_array(cards) { // TODO: リストのカードが６個以上の時には、送れない
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

    make_first_quick_reply_json() {
        return read_or_write_quick_reply_json
    }

    make_read_quick_reply_json() {
        return read_todo_quick_reply_json;
    }

    make_write_quick_reply_json(){
        return write_todo_quick_reply_json;
    }

}

// 最上位のquick_reply
// 「TODOをみる」「TODOを書き込む」の２つを表示
const read_or_write_quick_reply_json = {
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
                            'data': 'action=read_to_do',
                            'label': 'TODOをみる',
                            'displayText': 'TODOをみる'
                        }
                    },
                    {
                        'type': 'action',
                        'action': {
                            'type': 'postback',
                            'data': 'action=write_to_do',
                            'label': 'TODOを書き込む',
                            'displayText': 'TODOを書き込む'
                        }
                    }
                ]
            }
        }
    ]
}

// 「TODOを見る」をクリックした後に表示されるquick_reply
// 「今日すること」「明日すること」「今週すること」「すること」の４つ
const read_todo_quick_reply_json = {
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
                            'data': 'action=read_to_do_today',
                            'label': '今日すること',
                            'displayText': '今日すること'
                        }
                    },
                    {
                        'type': 'action',
                        'action': {
                            'type': 'postback',
                            'data': 'action=read_to_do_tomorrow',
                            'label': '明日すること',
                            'displayText': '明日すること'
                        }
                    },
                    {
                        'type': 'action',
                        'action': {
                            'type': 'postback',
                            'data': 'action=read_to_do_weekly',
                            'label': '今週すること',
                            'displayText': '今週すること'
                        }
                    },
                    {
                        'type': 'action',
                        'action': {
                            'type': 'postback',
                            'data': 'action=read_to_do',
                            'label': 'すること',
                            'displayText': 'すること'
                        }
                    }
                ]
            }
        }    
    ]
}

// 「TODOを書き込む」をクリックした際に表示される
// 「今日すること」「明日すること」「今週すること」「すること」の４つ
// postbackのdataがread_todo_quick_reply_jsonとは違う
const write_todo_quick_reply_json = {
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
                            'data': 'action=write_to_do_today',
                            'label': '今日すること',
                            'displayText': '今日すること'
                        }
                    },
                    {
                        'type': 'action',
                        'action': {
                            'type': 'postback',
                            'data': 'action=write_to_do_tomorrow',
                            'label': '明日すること',
                            'displayText': '明日すること'
                        }
                    },
                    {
                        'type': 'action',
                        'action': {
                            'type': 'postback',
                            'data': 'action=write_to_do_weekly',
                            'label': '今週すること',
                            'displayText': '今週すること'
                        }
                    },
                    {
                        'type': 'action',
                        'action': {
                            'type': 'postback',
                            'data': 'action=write_to_do',
                            'label': 'すること',
                            'displayText': 'すること'
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
