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

/**
 * Добавление записи в телефонную книгу
 * @param {String} phone
 * @param {String?} name
 * @param {String?} email
 * @returns {Boolean}
 */
function add(phone, name, email) {
    if (typeof phone !== 'string' || phoneBook[phone]) {
        return false;
    }

    return tryAddOrUpdate(phone, name, email);
}

/**
 * Обновление записи в телефонной книге
 * @param {String} phone
 * @param {String?} name
 * @param {String?} email
 * @returns {Boolean}
 */
function update(phone, name, email) {
    if (typeof phone !== 'string' || !phoneBook[phone]) {
        return false;
    }

    return tryAddOrUpdate(phone, name, email);
}

/**
 * Добавление или обновление записи в телефонной книге
 * @param {String} phone
 * @param {String?} name
 * @param {String?} email
 * @returns {Boolean}
 */
function tryAddOrUpdate(phone, name, email) {
    const phoneNumberRegex = /^[0-9]{10}$/g;
    if (!phoneNumberRegex.test(phone)) {
        return false;
    }

    if (name === undefined || typeof name !== 'string' || name === '') {
        return false;
    }

    phoneBook[phone] = { phone, name, email };

    return true;
}

/**
 * Удаление записей по запросу из телефонной книги
 * @param {String} query
 * @returns {Number}
 */
function findAndRemove(query) {
    const removingValues = findRecordsByQuery(query)
        .map(record => record.phone);
    removingValues.forEach(phone => delete phoneBook[phone]);

    return removingValues.length;
}

/**
 * Поиск записей по запросу в телефонной книге
 * @param {String} query
 * @returns {String[]}
 */
function find(query) {
    return findRecordsByQuery(query)
        .map(asStringValue);
}

function formatPhone(phone) {
    const phoneSegments = [
        phone.slice(0, 3),
        phone.slice(3, 6),
        phone.slice(6, 8),
        phone.slice(8, 10)
    ];

    return `+7 (${phoneSegments[0]}) ${phoneSegments[1]}-${phoneSegments[2]}-${phoneSegments[3]}`;
}

function findRecordsByQuery(query) {
    if (typeof query !== 'string' || query === '') {
        return [];
    }

    return Object.values(phoneBook)
        .sort((record1, record2) => record1.name.localeCompare(record2.name))
        .filter(entity => checkIfMatchQuery(entity, query));
}

function checkIfMatchQuery(entity, query) {
    if (query === '*') {
        return true;
    }

    return Object.values(entity)
        .some(field => field && field.includes(query));
}

function asStringValue(phoneRecord) {
    const phone = formatPhone(phoneRecord.phone);
    const { name, email } = phoneRecord;

    return [name, phone, email]
        .filter(field => field !== undefined)
        .join(', ');
}

/**
 * Импорт записей из csv-формата
 * @star
 * @param {String} csv
 * @returns {Number} – количество добавленных и обновленных записей
 */
function importFromCsv(csv) {
    return csv.split('\n')
        .map(string => string.split(';'))
        .reduce((accumulator, fields) => {
            const [name, phone, email] = fields;

            return tryAddOrUpdate(phone, name, email)
                ? accumulator + 1
                : accumulator;
        }, 0);
}

module.exports = {
    add,
    update,
    findAndRemove,
    find,
    importFromCsv,

    isStar
};
