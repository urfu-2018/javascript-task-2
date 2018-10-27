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
    return /^\d{10}$/.test(phone);
}

function isCorrectName(name) {
    return typeof name === 'string' && name.length > 0;
}

/**
 * Добавление записи в телефонную книгу
 * @param {String} phone
 * @param {String?} name
 * @param {String?} email
 * @returns {Boolean}
 */
function add(phone, name, email = '') {
    return tryToChangeEntries(phone, name, email, !phoneBook[phone]);
}

/**
 * Обновление записи в телефонной книге
 * @param {String} phone
 * @param {String?} name
 * @param {String?} email
 * @returns {Boolean}
 */
function update(phone, name, email = '') {
    return tryToChangeEntries(phone, name, email, phone in phoneBook);
}

function tryToChangeEntries(phone, name, email, condition) {
    if (condition && isCorrectPhone(phone) && isCorrectName(name)) {
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
    if (typeof query !== 'string' || query.length === 0) {
        return 0;
    }
    if (query === '*') {
        const result = Object.keys(phoneBook).length;
        phoneBook = {};

        return result;
    }

    return Object.keys(phoneBook)
        .filter(phone => containsInBook(query, phone))
        .map(phone => delete phoneBook[phone])
        .length;
}

/**
 * Поиск записей по запросу в телефонной книге
 * @param {String} query
 * @returns {String[]}
 */
function find(query) {
    if (typeof query !== 'string' || query.length === 0) {
        return [];
    }
    const isAll = query === '*';

    return Object.keys(phoneBook)
        .filter(phone => isAll || containsInBook(query, phone))
        .map(phone => convertFoundEntryToFormat(phone, phoneBook[phone][0], phoneBook[phone][1]))
        .sort();
}

function containsInBook(query, phone) {
    const [name, email] = phoneBook[phone];

    return [phone, name, email].some(e => typeof e !== 'undefined' && e.includes(query));
}

function convertFoundEntryToFormat(phone, name, email) {
    phone =
    `+7 (${phone.slice(0, 3)}) ${phone.slice(3, 6)}-${phone.slice(6, 8)}-${phone.slice(8, 10)}`;

    return [name, phone, email]
        .filter(element => typeof element !== 'undefined' && element.length > 0)
        .join(', ');
}

/**
 * Импорт записей из csv-формата
 * @star
 * @param {String} csv
 * @returns {Number} – количество добавленных и обновленных записей
 */
function importFromCsv(csv) {
    const lines = csv.split('\n');

    return lines
        .filter(line => {
            const contact = line.split(';');

            return add(contact[1], contact[0], contact[2]) ||
                update(contact[1], contact[0], contact[2]);
        }).length;
}

module.exports = {
    add,
    update,
    findAndRemove,
    find,
    importFromCsv,

    isStar
};
