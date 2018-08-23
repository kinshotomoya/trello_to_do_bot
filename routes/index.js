//lineのwebhookを受け取るrouter
var express = require('express');
var router = express.Router();
const Trello = require('../trello');
const LineSender = require('../node_api_request');


router.post('/webhook', function(req, res, next) {
  var event = req.body.events[0]
  if (event.message) {
    const line_sender = new LineSender();
    if (event.message.text == "教えて") {
      line_sender.pushQuickReply(line_sender.make_quick_reply_json());
    } else if (event.message.text == '今日すること') {
      return
    } else {
      line_sender.pushMessage(line_sender.make_message_json(['何言ってるの？？']));
    }
  } else if (event.postback) {
    var trello = new Trello();
    if (event.postback.data.match('to_do_today')) {
      // 今日することを取得
      trello.get_and_push_trello_cards();
    } else if (event.postback.data.match('to_do_tomorrow')) {
      // 明日することを取得
      
    }
  }
});

module.exports = router;
