const request = require('request')
const axios = require('axios');
require('dotenv').config();
const express = require('express');
const LineSender = require('./node_api_request');
const line_sender = new LineSender();
const app = express();

const GET_BOARD_URL = `https://trello.com/1/members/user96518825/boards?key=${process.env.TRELLO_API_KEY}&token=${process.env.TRELLO_TOKEN}&fields=name`;
const GET_LIST_URL = `https://trello.com/1/boards/${process.env.TRELLO_BOARD_ID}/lists?key=${process.env.TRELLO_API_KEY}&token=${process.env.TRELLO_TOKEN}&fields=name`
const GET_TO_DO_TODAY_CARDS_URL = `https://trello.com/1/lists/${process.env.TRELLO_TO_DO_LIST_ID}/cards?key=${process.env.TRELLO_API_KEY}&token=${process.env.TRELLO_TOKEN}&fields=name`
const GET_TO_DO_TOMORROW_CARDS_URL = `https://trello.com/1/lists/${process.env.TRELLO_TO_DO_TOMORROW_LIST_ID}/cards?key=${process.env.TRELLO_API_KEY}&token=${process.env.TRELLO_TOKEN}&fields=name`

class Trello {
    get_and_push_trello_cards(action_name) {
        var cards_url;
        if (action_name == 'to_do_today') {
            cards_url = GET_TO_DO_TODAY_CARDS_URL;
        } else if (action_name == 'to_do_tomorrow') {
            cards_url = GET_TO_DO_TOMORROW_CARDS_URL;
				};
			  axios.get(cards_url).then((res) => {
					let cards = this.get_each_cards(res.data);
					let json = line_sender.make_message_json(cards);
					this.push_card_and_quick_reply(json)
				})
    }

    promise_push_message(json) {
			return new Promise((resolve, reject) => {
				line_sender.pushMessage(json)
				resolve("push message done");
			});
		}
		
		async push_card_and_quick_reply(json) {
			let res = await this.promise_push_message(json);
		}

    get_each_cards(card_data) {
        var array = [];
        card_data.forEach(card => {
            array.push(card.name);
        });
        // console.log(array);  //取得したcardのname（タイトル）が格納されている
        return array
    }

    get_trello_board() { //trelloのボードのidを取得する
        request.get({
            uri: GET_BOARD_URL
        }, (err, req, res) => {
            if (err) {
                console.log(err);
            } else {
                console.log('message送信完了しました。')
                console.log(res);
            };
        });
    }
    //ボードの中のリストを取得する
    // 今回は、TODO_TODAYリストのid
    get_trello_list() {
        request.get({
            uri: GET_LIST_URL
        }, (err, req, res) => {
            if (err) {
                console.log(err)
            } else {
                console.log('リストを取得')
                console.log(res)
            }
        });
    };
};
module.exports = Trello;
