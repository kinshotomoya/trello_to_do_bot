//lineのwebhookを受け取るrouter
var express = require('express');
var router = express.Router();
const Trello = require('../trello');
const LineSender = require('../node_api_request');
const line_sender = new LineSender();

router.post('/webhook', (req, res, next) => {
  const event = req.body.events[0]
  console.log(event)
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
      var trello = new Trello();
      var action_name;
      if (event.postback.data.match('read_to_do')) {
        // read_todo_quick_reply_jsonを表示
        line_sender.requestPost(line_sender.make_read_quick_reply_json(), false);
        // action_name = event.postback.data.match('to_do_today')[0]
        // trello.get_and_push_trello_cards(action_name);
      } else if (event.postback.data.match('write_to_do')) {
        // write_todo_quick_reply_jsonを表示
        line_sender.requestPost(line_sender.make_write_quick_reply_json(), false);
        // action_name = event.postback.data.match('to_do_tomorrow')[0]
        // trello.get_and_push_trello_cards(action_name);
      }
    }
  }
});

module.exports = router;
