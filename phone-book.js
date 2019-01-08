'use strict';

/**
 * Сделано задание на звездочку
 * Реализован метод importFromCsv
 */
const isStar = false;

/**
 * Телефонная книга
 */
let phoneBook = {};

function isValidParameterTypes(...params) {
    if (params.length % 2 !== 0) {
        return false;
    }

    for (let i = 1; i < params.length; i += 2) {
        if (typeof params[i - 1] !== params[i]) {
            return false;
        }
    }

    return true;
}

function isValidPhone(phone) {
    return /^\d{10}$/.test(phone);
}

function isValidName(name) {
    return name.trim() !== '';
}

function isValidEmail(email) {
    if (email && !isValidParameterTypes(email, 'string')) {
        return false;
    }

    return true;
}

function contains(substring, sources) {
    if (substring === '*') {
        return true;
    }

    return sources.filter(s => typeof s === 'string' && s.indexOf(substring) !== -1).length > 0;
}

function findNecessaryRecords(query) {
    if (query.length === 0) {
        return [];
    }

    const records = Object.entries(phoneBook)
        .map(entry => [entry[0]].concat(Object.values(entry[1])))
        .filter(entry => contains(query, entry));

    records.sort(function (a, b) {
        const firstName = a[1];
        const secondName = b[1];

        if (secondName === firstName) {
            return 0;
        }

        return firstName > secondName ? 1 : -1;
    });

    return records;
}

function phoneToNormalFormat(str) {
    const code = str.substring(0, 3);
    const firstPart = str.substring(3, 6);
    const secondPart = str.substring(6, 8);
    const thirdPart = str.substring(8, 10);

    return `+7 (${code}) ${firstPart}-${secondPart}-${thirdPart}`;
}

function recordToNormalFormat(record) {
    const name = record[1];
    const phone = phoneToNormalFormat(record[0]);
    const email = record[2];

    return `${name}, ${phone}${email ? ', ' + email : ''}`;
}

/**
 * Добавление записи в телефонную книгу
 * @param {String} phone
 * @param {String?} name
 * @param {String?} email
 * @returns {Boolean}
 */
function add(phone, name, email) {
    if (!isValidParameterTypes(phone, 'string', name, 'string')) {
        return false;
    }

    if (!isValidEmail(email)) {
        return false;
    }

    if (!isValidPhone(phone) || !isValidName(name) || phone in phoneBook) {
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
function update(phone, name, email) {
    isValidParameterTypes(phone, 'string', name, 'string');
    if (email) {
        isValidParameterTypes(email, 'string');
    }

    if (!isValidPhone(phone) || !isValidName(name)) {
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
    isValidParameterTypes(query, 'string');
    let count = 0;

    const records = findNecessaryRecords(query);
    for (let i = 0; i < records.length; i++) {
        phoneBook[records[i][0]] = undefined;
        count++;
    }

    return count;
}

/**
 * Поиск записей по запросу в телефонной книге
 * @param {String} query
 * @returns {String[]}
 */
function find(query) {
    isValidParameterTypes(query, 'string');

    return findNecessaryRecords(query).map(recordToNormalFormat);
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
