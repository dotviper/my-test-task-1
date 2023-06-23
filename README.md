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
   6.1. Enter: `nano ./data/.env`
   6.2. Set token: `TOKEN="Your Telegram Token Here"`
   6.3 Save this: CTRL + X > Enter > Enter
7. Start your bot by `npm start`
