'use strict';

/**
 * Сделано задание на звездочку
 * Реализован метод importFromCsv
 */
const isStar = true;

/**
 * Телефонная книга
 */
let phoneBook = {};

/**
 * Добавление записи в телефонную книгу
 * @param {String} phone
 * @param {String?} name
 * @param {String?} email
 * @returns {Boolean}
 */
function add(phone, name, email) {
    return tryAddRecord(phone, name, email);
}

/**
 * Обновление записи в телефонной книге
 * @param {String} phone
 * @param {String?} name
 * @param {String?} email
 * @returns {Boolean}
 */
function update(phone, name, email) {
    return tryUpdateRecord(phone, name, email);
}

/**
 * Удаление записей по запросу из телефонной книги
 * @param {String} query
 * @returns {Number}
 */
function findAndRemove(query) {
    if (!query) {
        return 0;
    }
    let removedCount = 0;
    for (let [phone, { name, email }] of Object.entries(phoneBook)) {
        let summary = [name, phone, email, '*'];
        if (paramsOccurencyFound(summary, query)) {
            delete phoneBook[phone];
            removedCount++;
        }
    }

    return removedCount;
}

/**
 * Поиск записей по запросу в телефонной книге
 * @param {String} query
 * @returns {String[]}
 */
function find(query) {
    if (!query) {
        return [];
    }
    let searchResult = [];
    for (let [phone, { name, email }] of Object.entries(phoneBook)) {
        let summary = [name, phone, email, '*'];
        if (paramsOccurencyFound(summary, query)) {
            let formattedOutput = formatOutput(name, phone, email);
            searchResult.push({ name, formattedOutput });
        }
    }
    let sortedResult = searchResult.sort((a, b) => a.name > b.name).map(x => x.formattedOutput);

    return sortedResult;
}

/**
 * Импорт записей из csv-формата
 * @star
 * @param {String} csv
 * @returns {Number} – количество добавленных и обновленных записей
 */
function importFromCsv(csv) {
    // Парсим csv
    // Добавляем в телефонную книгу
    // Либо обновляем, если запись с таким телефоном уже существует

    var records = csv.split('\n');
    let newRecordsCount = 0;
    let updatedRecordsCount = 0;
    for (var i = 0; i < records.length; i++) {
        let [name, phone, email] = records[i].split(';');
        if (tryAddRecord(phone, name, email)) {
            newRecordsCount++;
        } else if (tryUpdateRecord(phone, name, email)) {
            updatedRecordsCount++;
        }
    }

    return newRecordsCount + updatedRecordsCount;
}

function tryAddRecord(phone, name, email) {
    if (!name || !isValidPhone(phone) || phoneBook.hasOwnProperty(phone)) {
        return false;
    }
    phoneBook[phone] = { name, email };

    return true;
}

function tryUpdateRecord(phone, name, email) {
    if (!phoneBook.hasOwnProperty(phone) || !name) {
        return false;
    }
    phoneBook[phone] = { name, email };

    return true;
}

/**
 * Поиск вхождений запроса в запись
 * @param {Array} summary
 * @param {String} query
 * @returns {Boolean}
 */
function paramsOccurencyFound(summary, query) {
    for (let param of summary) {
        if (param && param.indexOf(query) >= 0) {
            return true;
        }
    }

    return false;
}

/**
 * Форматирование вывода
 * @param {String} name
 * @param {String} phone
 * @param {String} email
 * @returns {String}
 */
function formatOutput(name, phone, email) {
    let baseOutput = `${name}, ${formatNumber(phone)}`;
    let formattedOutput = email ? baseOutput + `, ${email}` : baseOutput;

    return formattedOutput;
}

function isValidPhone(phone) {
    return /^([0-9]){10}$/.test(phone);
}

function formatNumber(number) {
    return `+7 (${number.slice(0, 3)}) ` +
        `${number.slice(3, 6)}-` +
        `${number.slice(6, 8)}-` +
        `${number.slice(8)}`;
}

module.exports = {
    add,
    update,
    findAndRemove,
    find,
    importFromCsv,

    isStar
};
