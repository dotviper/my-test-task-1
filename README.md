## Telegram bot for the sale of watermelons
This was one of my test tasks, I decided to post this code, in case someone needs it.

Bot use next node_modules: telegraf, dotenv, nodemon, sqlite3, winston.

## Bot load

1. [Install Node JS + npm](https://nodejs.org/en/download)
2. Clone this repo: `git clone https://github.com/eqshka/my-test-task-1.git`
3. Go to the installed repository: `cd my-test-task-1`
4. Install all the necessary modules: `npm install`
5. Create your telegram bot [here](https://t.me/botfather) and copy token.
6. Set your telegram token for bot:
7. Enter: `nano ./data/.env` and set token: `TOKEN="Your Telegram Token Here"`
8. Enter: `nano ./data/config.json` and enter your telegram sellers chat id
11. Start your bot by `npm start`
