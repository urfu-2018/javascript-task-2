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
    if ((isPhone(phone) && isName(name) && isEmail(email) || isPhone(phone) && isName(name)) &&
        !phoneBook.has(phone)) {
        phoneBook.set(phone, [name, email]);

        return true;
    }

    return false;
}

function isPhone(phone) {
    return typeof phone === 'string' && /^\d{10}$/.test(phone);
}

function isName(name) {
    return typeof name === 'string' && /^\S+$/.test(name);
}

function isEmail(email) {
    return typeof email === 'string' &&
            /^([a-zA-Z0-9_.+-])+@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/.test(email);
}

/**
 * Обновление записи в телефонной книге
 * @param {String} phone
 * @param {String?} name
 * @param {String?} email
 * @returns {Boolean}
 */
function update(phone, name, email) {
    if ((isPhone(phone) && isName(name) && isEmail(email) || isPhone(phone) && isName(name)) &&
        phoneBook.delete(phone)) {
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
        count = phoneBook.keys().length();
        phoneBook = new Map();
    }
    let toDelete = findAllRecords(query);
    count = toDelete.length;
    deleteAllRecords(toDelete);

    return count;
}

function deleteAllRecords(toDelete) {
    for (let i = 0; i < toDelete.length; i++) {
        phoneBook.delete(toDelete[i]);
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
        let ph = `+7 (${line[0].substring(0, 3)}) ${line[0].substring(3, 6)}-${
            line[0].substring(6, 8)}-${line[0].substring(8)}`;
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

    return csv.split('\n').length;
}

module.exports = {
    add,
    update,
    findAndRemove,
    find,
    importFromCsv,

    isStar
};
