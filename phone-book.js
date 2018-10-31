'use strict';

/**
 * Сделано задание на звездочку
 * Реализован метод importFromCsv
 */
const isStar = true;

/**
 * Телефонная книга
 */
const phoneBook = {};

const isCorrectNumber = (phone) =>
    typeof(phone) === 'string' && /^\d{10}$/.test(phone);

const phoneFormat = (phone) =>
    `+7 (${phone.slice(0, 3)}) ${phone.slice(3, 6)}-${phone.slice(6, 8)}-${phone.slice(8, 10)}`;

const notesByQuery = (query) =>
    typeof(query) !== 'string' || query === ''
        ? 0
        : Object.keys(phoneBook)
            .map(phone => [phoneBook[phone].name, phone, phoneBook[phone].email])
            .filter(note => note
                .some(str => query === '*' || str.indexOf(query) + 1));

/**
 * Добавление записи в телефонную книгу
 * @param {String} phone
 * @param {String?} name
 * @param {String?} email
 * @returns {Boolean}
 */
function add(phone, name, email = '') {
    if (!isCorrectNumber(phone) || !name || phone in phoneBook) {
        return false;
    }
    phoneBook[phone] = { name, email };

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
    phoneBook[phone] = { name, email };

    return true;
}

/**
 * Удаление записей по запросу из телефонной книги
 * @param {String} query
 * @returns {Number}
 */
function findAndRemove(query) {
    return notesByQuery(query)
        .filter(note => delete(phoneBook[note[1]]))
        .length;
}

/**
 * Поиск записей по запросу в телефонной книге
 * @param {String} query
 * @returns {String[]}
 */
function find(query) {
    return notesByQuery(query)
        .map(note => [note[0], phoneFormat(note[1]), note[2]]
            .filter(field => field)
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
        .map(line => line.split(';'))
        .filter(fields => add(fields[1], fields[0], fields[2]) ||
                          update(fields[1], fields[0], fields[2]))
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
