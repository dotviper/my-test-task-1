require("dotenv").config({ path: "./data/.env"});
const token = process.env.TOKEN;
const { sellChatId } = require("./data/config.json");

const { Telegraf } = require("telegraf");
const log = require("./modules/logger.js");
const sql = require("./modules/database.js");

require("./modules/database.js");
const client = new Telegraf(token);

client.start(ctx => {
    log(`${ctx.from.username} (${ctx.from.id}) вызвал команду /start`, "d");

    ctx.reply("Доброго времени!\nУ нас вы можете приобрести арбузы 10-ти лучших сортов по низким ценам!\n\nИспользуйте /catalog");
});

client.command('catalog', async ctx => {
    log(`${ctx.from.username} (${ctx.from.id}) запросил каталог товаров`, "d");

    const catalog = await sql("SELECT id, title FROM catalog", "a");
    const inline_keyboard_catalog = catalog.map(any => [{ text: any.title, callback_data: `product_${any.id}` }]);

    ctx.deleteMessage();
    ctx.reply("Кликайте по интересующему товару:", {
        reply_markup: { inline_keyboard: inline_keyboard_catalog }
    });
});

client.on("callback_query", async (ctx) => {
    const callback_data = ctx.callbackQuery.data.split("_");

    if (callback_data[0] === "product") {
        log(`${ctx.from.username} (${ctx.from.id}) выбрал из каталога продукт под ID ${callback_data[1]}`, "d");

        const product = await sql("SELECT title, description, photo, price FROM catalog WHERE id = " + callback_data[1], "g");

        ctx.deleteMessage();
        ctx.replyWithPhoto(
            { source: `./data/assets/${product.photo}` },
            {
                caption: `${product.title}\n\n${product.description}\n\nЦена: ${product.price} $`,
                reply_markup: {
                    inline_keyboard: [
                        [{ text: "Приобрести", callback_data: `order_${callback_data[1]}` }],
                        [{ text: "Отмена", callback_data: "cancel"}]
                    ]
                }
            }
        );
    } else if (callback_data[0] === "order") {
        log(`${ctx.from.username} (${ctx.from.id}) отправил запрос на покупку продукта под ID ${callback_data[1]}`, "d");

        const product = await sql(`SELECT title, price FROM catalog WHERE id = ${callback_data[1]}`, "g");
        const sellersFromDB = await sql("SELECT user_id, username, name FROM sellers", "a");
        
        const sellers = sellersFromDB.map(any => `${any.name} - @${any.username}`);

        ctx.deleteMessage();
        ctx.reply(`Вы отправили запрос на покупку!\n\nПродукт: ${product.title}\nЦена: ${product.price} $\nОжидайте, с вами свяжутся продавцы:\n${sellers.join("\n")}`);
        sql(`INSERT INTO trades VALUES(NULL, ${ctx.from.id}, ${callback_data[1]})`, "r");

        client.telegram.sendMessage(
            sellChatId,
            `Поступил заказ на покупку!\n\nПокупатель: @${ctx.from.username}\nТовар: ${product.title}\nЦена: ${product.price} $`,
            {
                reply_markup: {
                    inline_keyboard: [[{ text: "Обслужить заказ", callback_data: "getOrder" }]]
                }
            }
        );
    } else if (callback_data[0] === "getOrder") {
        log(`${ctx.from.username} (${ctx.from.id}) взял заказ на выполнение`, "d");

        ctx.editMessageText(ctx.callbackQuery.message.text + "\n\nВзял на выполнение: @" + ctx.from.username);
    } else if (callback_data[0] === "cancel") {
        log(`${ctx.from.username} (${ctx.from.id}) отменил действие`, "d");

        ctx.deleteMessage();
    };
});

client.launch();