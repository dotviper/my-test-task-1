const sqlite3 = require("sqlite3").verbose();
const log = require("./logger.js");

const db = new sqlite3.Database("./data/server.db", sqlite3.OPEN_READWRITE, (err) => {
    if (err) return log("Базу данных загрузить не удалось", "e");

    log("База данных успешно загружена", "i");
});

/**
 * Запрос возвращает Promise и для его обработки перед функцией неободимо установить awiat.
 * 
 * 
 * @param {String} request Тело sqlite запроса
 * @param {Char} type Тип запроса, обозначается одним символом (первым)
 * 
 * @returns "notCompleted" - Возвращает если при выполнение запроса произошла ошибка
 * @returns "completed" - Возвращает при успешном выполнение запроса с типом "run"
 */
module.exports = (request, type) => {
    log(`SQL (${type}) ${request}`, 'd');

    return new Promise( async (resolve) => {
        switch (type) {
            case "r":
                db.run(request, (err) => {
                    if (err) {
                        log(err, 'e');

                        resolve("notCompleted");
                    } else resolve("completed");
                });
            break;
            case "g": 
                db.get(request, (err, row) => {
                    if (err) {
                        log(err, 'e');

                        resolve("notCompleted");
                    } else resolve(row);
                });
            break;
            case "a": 
                db.all(request, (err, rows) => {
                    if (err) {
                        log(err, 'e');

                        resolve("notCompleted");
                    } else resolve(rows);
                });
            break;
            default: return log(`Не верный тип запроса (${type})`, "e");
        };
    });
};