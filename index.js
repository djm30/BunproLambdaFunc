const axios = require("axios");
const TelegramBot = require("node-telegram-bot-api");

//Keys
const TELEGRAM_KEY = "5291894937:AAG0sJLJ8qyFuqUDpAdM7KabrLFtFaxLlB4";
const BUNPRO_KEY = "3e0e886e45dc3e9916b767d14ac4bc8f";
const CHAT_ID = "2018247944";

module.exports.handler = (event, context, callback) => {
  try {
    //Calling bunpro API
    const bot = new TelegramBot(TELEGRAM_KEY, { polling: true });

    let send = (message) => {
      //Sending message
      bot
        .sendMessage(CHAT_ID, message)
        .then((response) => {
          console.log(response);
        })
        .catch((err) => console.error(err));
    };

    let close = () => {
      //Closing bot
      bot
        .stopPolling()
        .then(() => {
          console.log("Shutting bot down...");
          callback(null, 200);
        })
        .catch((err) => {
          console.log("Errot shutting down");
          callback(Error(e));
        });
    };

    axios
      .get(`https://bunpro.jp/api/user/${BUNPRO_KEY}/study_queue`)
      .then((res) => {
        let reviews = res.data;
        let review_no = reviews.requested_information.reviews_available;
        let plural = review_no > 1 ? "reviews" : "review";
        send(
          `Bunpro:\n${reviews.user_information.username}, you have ${review_no} ${plural} available`
        );
        close();
      })
      .catch((err) => {
        console.log(err);
        send("Error when fetching reviews");
        close();
      });
  } catch (err) {}
};
