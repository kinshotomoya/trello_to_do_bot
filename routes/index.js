//lineのwebhookを受け取るrouter
var express = require('express');
var router = express.Router();
const Trello = require('../trello');
const LineSender = require('../node_api_request');


router.post('/webhook', function(req, res, next) {
  var event = req.body.events[0]
  if (event.message) {
    if (event.message.text == "教えて") {
      const line_sender = new LineSender();
      line_sender.pushQuickReply(line_sender.make_quick_reply_json());
    } else if (event.message.text == '今日すること') {
      return
    } else {
      console.log('回答できません');
    }
  } else if (event.postback) {
    var trello = new Trello();
    trello.get_and_push_trello_cards();
  }
});

module.exports = router;
