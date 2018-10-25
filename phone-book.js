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

let isCorrectNumber = (phone) =>
    typeof(phone) === 'string' && /^\d{10}$/.test(phone);

let isCorrectEmail = (email) =>
    !email || typeof(email) === 'string' && /^.+@.+\..+$/.test(email);

let phoneFormat = (phone) =>
    `+7 (${phone.slice(0, 3)}) ${phone.slice(3, 6)}-${phone.slice(6, 8)}-${phone.slice(8, 10)}`;

let notesByQuery = (query) =>
    typeof(query) !== 'string' || query === ''
        ? 0
        : Object.keys(phoneBook)
            .map(phone => [phoneBook[phone].name, phone, phoneBook[phone].email])
            .filter(x =>
                x.some(str => query === '*' || str.indexOf(query) + 1));

/**
 * Добавление записи в телефонную книгу
 * @param {String} phone
 * @param {String?} name
 * @param {String?} email
 * @returns {Boolean}
 */
function add(phone, name, email = '') {
    if (!isCorrectNumber(phone) || !isCorrectEmail(email) || !name || phone in phoneBook) {
        return false;
    }
    phoneBook[phone] = { 'name': name, 'email': email };

    return true;
}

/**
 * Обновление записи в телефонной книге
 * @param {String} phone
 * @param {String?} name
 * @param {String?} email
 * @returns {Boolean}
 */
function update(phone, name, email = '') {
    if (!(phone in phoneBook) || !name) {
        return false;
    }
    phoneBook[phone] = { 'name': name, 'email': email };

    return true;
}

/**
 * Удаление записей по запросу из телефонной книги
 * @param {String} query
 * @returns {Number}
 */
function findAndRemove(query) {
    return notesByQuery(query)
        .filter(x => delete(phoneBook[x[1]]))
        .length;
}

/**
 * Поиск записей по запросу в телефонной книге
 * @param {String} query
 * @returns {String[]}
 */
function find(query) {
    return notesByQuery(query)
        .map(x => [x[0], phoneFormat(x[1]), x[2]]
            .filter(el => el)
            .join(', '))
        .sort();
}

/**
 * Импорт записей из csv-формата
 * @star
 * @param {String} csv
 * @returns {Number} – количество добавленных и обновленных записей
 */
function importFromCsv(csv) {
    return csv
        .split('\n')
        .map(x => x.split(';'))
        .filter(x => add(x[1], x[0], x[2]) || update(x[1], x[0], x[2]))
        .length;
}

module.exports = {
    add,
    update,
    findAndRemove,
    find,
    importFromCsv,

    isStar
};
