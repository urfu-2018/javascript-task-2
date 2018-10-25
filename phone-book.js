'use strict';

/**
 * Сделано задание на звездочку
 * Реализован метод importFromCsv
 */
const isStar = true;

/**
 * Телефонная книга
 */
let phoneBook = new Map();

/**
 * Добавление записи в телефонную книгу
 * @param {String} phone
 * @param {String?} name
 * @param {String?} email
 * @returns {Boolean}
 */
function add(phone, name, email) {
    if (isCorrectData(phone, name, email) && !phoneBook.has(phone)) {
        phoneBook.set(phone, [name, email]);

        return true;
    }

    return false;
}

function isCorrectData(phone, name, email) {
    return isPhone(phone) && isName(name) && isEmail(email) || isPhone(phone) && isName(name);
}

function isPhone(phone) {
    return typeof phone === 'string' && /^\d{10}$/.test(phone);
}

function isName(name) {
    return typeof name === 'string' && name !== '';
}

function isEmail(email) {
    return typeof email === 'string' && email !== '';
}

/**
 * Обновление записи в телефонной книге
 * @param {String} phone
 * @param {String?} name
 * @param {String?} email
 * @returns {Boolean}
 */
function update(phone, name, email) {
    if (isCorrectData(phone, name, email) && phoneBook.delete(phone)) {
        phoneBook.set(phone, [name, email]);

        return true;
    }

    return false;
}

/**
 * Удаление записей по запросу из телефонной книги
 * @param {String} query
 * @returns {Number}
 */
function findAndRemove(query) {
    if (query === '' || typeof query !== 'string') {
        return 0;
    }
    let count = 0;
    if (query === '*') {
        count = phoneBook.keys().length;
        phoneBook = new Map();
    }
    let toDelete = findAllRecords(query);
    count = toDelete.length;
    deleteAllRecords(toDelete);
    console.info(phoneBook);

    return count;
}

function deleteAllRecords(toDelete) {
    for (let line of toDelete) {
        phoneBook.delete(line[0]);
    }
}

function findAllRecords(query) {
    let result = [];
    for (let key of phoneBook.keys()) {
        if (dataIncludesQuery(key, phoneBook.get(key)[0], phoneBook.get(key)[1], query)) {
            result.push([key, phoneBook.get(key)[0], phoneBook.get(key)[1]]);
        }
    }

    return result;
}

function dataIncludesQuery(phone, name, email, query) {
    return phone.includes(query) ||
            name.includes(query) ||
            (isEmail(email) && email.includes(query)) ||
            query === '*';
}

/**
 * Поиск записей по запросу в телефонной книге
 * @param {String} query
 * @returns {String[]}
 */
function find(query) {
    if (query === '' || typeof query !== 'string') {
        return [];
    }
    let result = findAllRecords(query);
    let bookString = bookToString(result);

    return bookString;
}

function bookToString(records) {
    let result = [];
    for (let i = 0; i < records.length; i++) {
        let line = records[i];
        let ph = `+7 (${line[0].substr(0, 3)}) ${line[0].substr(3, 3)}-${
            line[0].substr(6, 2)}-${line[0].substr(8, 2)}`;
        let name = line[1];
        let email = typeof line[2] === 'undefined' ? '' : ', ' + line[2];
        result.push(`${name}, ${ph}${email}`);
    }

    return result.sort();
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
    let count = 0;
    for (let line of csv.split('\n')) {
        let name = line.split(';')[0];
        let phone = line.split(';')[1];
        let email = line.split(';')[2];
        count += add(phone, name, email) || update(phone, name, email) ? 1 : 0;
    }

    return count;
}

module.exports = {
    add,
    update,
    findAndRemove,
    find,
    importFromCsv,

    isStar
};
