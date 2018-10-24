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

function isString(value) {
    return typeof(value) === 'string';
}

function checkName(name) {
    return isString(name) && name;
}

function phoneInBook(phone) {
    for (let existPhone in phoneBook) {
        if (phone === existPhone) {
            return true;
        }
    }

    return false;
}

function checkPhone(phone) {
    const phoneRegexp = /^\d{10}$/;

    return isString(phone) && phoneRegexp.test(phone);
}

function checkRecordByQuery(phone, query) {
    let res = phone.includes(query) ||
        phoneBook[phone].name.includes(query) ||
        phoneBook[phone].email && phoneBook[phone].email.includes(query);

    return query === '*' || res;
}

function formatPhone(phone) {
    function part(start, len) {
        return phone.substr(start, len);
    }

    return `+7 (${part(0, 3)}) ${part(3, 3)}-${part(6, 2)}-${part(8, 2)}`;
}

function formatRecord(phone) {
    var recordStr = `${phoneBook[phone].name}, ${formatPhone(phone)}`;
    if (phoneBook[phone].email) {
        recordStr += `, ${phoneBook[phone].email}`;
    }

    return recordStr;
}

function getRecordsByQuery(query) {
    return Object.keys(phoneBook)
        .filter(phone => {
            return checkRecordByQuery(phone, query);
        });
}

/**
 * Добавление записи в телефонную книгу
 * @param {String} phone
 * @param {String?} name
 * @param {String?} email
 * @returns {Boolean}
 */
function add(phone, name, email) {
    if (!checkName(name) || !checkPhone(phone) || phoneInBook(phone)) {
        return false;
    }

    phoneBook[phone] = { name: name, email: email };

    return true;
}

/**
 * Обновление записи в телефонной книге
 * @param {String} phone
 * @param {String?} name
 * @param {String?} email
 * @returns {Boolean}
 */
function update(phone, name, email) {
    if (!checkName(name) || !checkPhone(phone) || !phoneInBook(phone)) {
        return false;
    }

    phoneBook[phone] = { name: name, email: email };

    return true;
}

/**
 * Удаление записей по запросу из телефонной книги
 * @param {String} query
 * @returns {Number}
 */
function findAndRemove(query) {
    if (!isString(query) || query.length < 1) {
        return 0;
    }

    let records = getRecordsByQuery(query);
    for (let i = 0; i < records.length; i++) {
        delete phoneBook[records[i]];
    }

    return records.length;
}

/**
 * Поиск записей по запросу в телефонной книге
 * @param {String} query
 * @returns {String[]}
 */
function find(query) {
    if (!isString(query) || query.length < 1) {
        return [];
    }

    return getRecordsByQuery(query)
        .sort((a, b) => phoneBook[a].name.localeCompare(phoneBook[b].name))
        .map(formatRecord);
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

    let counter = 0;
    let csvRecords = csv.split('\n');
    for (let record of csvRecords) {
        record = record.split(';');
        if (add(record[1], record[0], record[2]) ||
            update(record[1], record[0], record[2])) {
            counter += 1;
        }
    }

    return counter;
}

module.exports = {
    add,
    update,
    findAndRemove,
    find,
    importFromCsv,

    isStar
};
