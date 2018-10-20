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

function isCorrectPhone(phone) {
    return /^\d{10}$/.test(phone) && phone;
}

function isCorrectName(name) {
    return typeof name === 'string' && name;
}

/**
 * Добавление записи в телефонную книгу
 * @param {String} phone
 * @param {String?} name
 * @param {String?} email
 * @returns {Boolean}
 */
function add(phone, name, email = '') {
    if (isCorrectPhone(phone) && isCorrectName(name) && !phoneBook[phone]) {
        phoneBook[phone] = email ? [name, email] : [name];

        return true;
    }

    return false;
}

/**
 * Обновление записи в телефонной книге
 * @param {String} phone
 * @param {String?} name
 * @param {String?} email
 * @returns {Boolean}
 */
function update(phone, name, email = '') {
    if (isCorrectPhone(phone) && isCorrectName(name) && phone in phoneBook) {
        phoneBook[phone] = email ? [name, email] : [name];

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
    if (typeof query !== 'string' || !query) {
        return 0;
    }
    if (query === '*') {
        const result = Object.keys(phoneBook).length;
        phoneBook = {};

        return result;
    }
    let count = 0;
    for (let phone of Object.keys(phoneBook)) {
        if (containsInBook(query, phone)) {
            delete phoneBook[phone];
            count++;
        }
    }

    return count;
}

/**
 * Поиск записей по запросу в телефонной книге
 * @param {String} query
 * @returns {String[]}
 */
function find(query) {
    if (typeof query !== 'string' || !query) {
        return [];
    }
    const result = [];
    const isAll = query === '*';

    for (let phone of Object.keys(phoneBook)) {
        if (isAll || containsInBook(query, phone)) {
            result.push(convert2Format(phone, phoneBook[phone][0], phoneBook[phone][1]));
        }
    }

    return result.sort();
}

function containsInBook(query, phone) {
    const name = phoneBook[phone][0];
    const email = phoneBook[phone][1];

    return phone.includes(query) || name.includes(query) || (email && email.includes(query));
}

function convert2Format(phone, name, email) {
    phone =
    `+7 (${phone.slice(0, 3)}) ${phone.slice(3, 6)}-${phone.slice(6, 8)}-${phone.slice(8, 10)}`;

    return email ? [name, phone, email].join(', ') : [name, phone].join(', ');
}

/**
 * Импорт записей из csv-формата
 * @star
 * @param {String} csv
 * @returns {Number} – количество добавленных и обновленных записей
 */
function importFromCsv(csv) {
    const lines = csv.split('\n');
    let count = 0;
    for (let i = 0; i < lines.length; i++) {
        const contact = lines[i].split(';');
        if (add(contact[1], contact[0], contact[2]) || update(contact[1], contact[0], contact[2])) {
            count++;
        }
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
