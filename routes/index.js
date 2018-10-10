//lineのwebhookを受け取るrouter
var express = require('express');
var router = express.Router();
const Trello = require('../trello');
const trello = new Trello();
const LineSender = require('../node_api_request');
const line_sender = new LineSender();


router.post('/webhook', (req, res, next) => {
  const event = req.body.events[0]
  if (event.type == 'follow') {
    // まずfollwoしてくれたら、quick_replyを表示する
    line_sender.requestPost(line_sender.make_first_quick_reply_json(), false);
  } else {
    if (event.message) {
      if (event.message.type == 'image') {
        // 画像を取得する処理をする)
        line_sender.getContent(event.message.id);
      } else {
        line_sender.requestPost(line_sender.make_message_json(['ごめんね。返信できないのmm']), true);
      }
    } else if (event.postback) {
      var action_name;
      // TODO: あとで、リファクタリングする
      // 具体的には、以下の処理をhandler.jsみたいなファイルに移動する
      if (event.postback.data === 'action=read_to_do') {
        // read_todo_quick_reply_jsonを表示
        line_sender.requestPost(line_sender.make_read_quick_reply_json(), false);
      } else if (event.postback.data === 'action=write_to_do') {
        // write_todo_quick_reply_jsonを表示
        line_sender.requestPost(line_sender.make_write_quick_reply_json(), false);
      } else if (event.postback.data === 'action=read_to_do_today') {
        action_name = event.postback.data.match('read_to_do_today')[0]
        trello.get_and_push_trello_cards(action_name);
      } else if (event.postback.data === 'action=read_to_do_tomorrow') {
        action_name = event.postback.data.match('read_to_do_tomorrow')[0]
        trello.get_and_push_trello_cards(action_name);
      } else if (event.postback.data === 'action=read_to_do_weekly') {
        action_name = event.postback.data.match('read_to_do_weekly')[0]
        trello.get_and_push_trello_cards(action_name);
      } else if (event.postback.data === 'action=read_to_do') {
        action_name = event.postback.data.match('read_to_do')[0]
        trello.get_and_push_trello_cards(action_name);
      }
    }
  }
});

module.exports = router;
