'use strict';

/**
 * Сделано задание на звездочку
 * Реализован метод importFromCsv
 */
const isStar = true;

/**
 * Телефонная книга
 */
let phoneBook = [];

/**
 * Добавление записи в телефонную книгу
 * @param {String} phone
 * @param {String?} name
 * @param {String?} email
 * @returns {Boolean}
 */
function add(phone, name, email) {
    if (phoneBook[phone]) {
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
    if (!phoneBook[phone]) {
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

    if (name === undefined) {
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
    let removingValues = findRecordsByQuery(query)
        .map(x => x.phone);
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
        .map(x => x.stringValue)
        .sort();
}

function formatPhone(phone) {
    const p1 = phone.slice(0, 3);
    const p2 = phone.slice(3, 6);
    const p3 = phone.slice(6, 8);
    const p4 = phone.slice(8, 10);

    return `+7 (${p1}) ${p2}-${p3}-${p4}`;
}

function findRecordsByQuery(query) {
    return Object.values(phoneBook)
        .map(toPhoneAndStringValue)
        .filter(x => query === '*' ? true : x.stringValue.includes(query));
}

function toPhoneAndStringValue(phoneRecord) {
    const phone = formatPhone(phoneRecord.phone);
    const name = phoneRecord.name;
    const email = phoneRecord.email;
    const stringValue = [name, phone, email]
        .filter(x => x !== undefined)
        .join(', ');

    return { phone: phoneRecord.phone, stringValue };
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

    return csv.split('\n')
        .map(x => x.split(';'))
        .reduce((accumulator, x) => {
            const [name, phone, email] = x;
            if (tryAddOrUpdate(phone, name, email)) {
                return accumulator + 1;
            }

            return accumulator;
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
