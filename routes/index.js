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
    line_sender.pushQuickReply(line_sender.make_quick_reply_json());
    return
  } else {
    if (event.message) {
      if (event.message.text == "教えて") {
        line_sender.pushQuickReply(line_sender.make_quick_reply_json());
      } else if (event.message.type == 'image') {
        // 画像を取得する処理をする)
        line_sender.getContent(event.message.id);
        return
      } else {
        line_sender.pushMessage(line_sender.make_message_json(['何言ってるの？？']));
      }
    } else if (event.postback) {
      var trello = new Trello();
      var action_name;
      if (event.postback.data.match('to_do_today')) {
        // 今日することを取得
        action_name = event.postback.data.match('to_do_today')[0]
        trello.get_and_push_trello_cards(action_name);
      } else if (event.postback.data.match('to_do_tomorrow')) {
        // 明日することを取得
        action_name = event.postback.data.match('to_do_tomorrow')[0]
        trello.get_and_push_trello_cards(action_name);
      }
    }
  }
});

module.exports = router;
