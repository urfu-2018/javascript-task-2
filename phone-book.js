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

function phoneIsCorrect(phoneStr) {
    return !Array.prototype.some((c) => isNaN(parseInt(c, 10)), phoneStr) &&
        phoneStr.length === 10;
}

function isNonEmptyString(value) {
    return typeof value === 'string' && value.length !== 0;
}

function check(phone, name) {
    return phoneIsCorrect(phone) && isNonEmptyString(name);
}

/**
 * Добавление записи в телефонную книгу
 * @param {String} phone
 * @param {String?} name
 * @param {String?} email
 * @returns {Boolean}
 */
function add(phone, name, email) {
    const phoneAndNameAreCorrect = check(phone, name);
    const exist = phoneBook.hasOwnProperty(phone);
    if (phoneAndNameAreCorrect && !exist) {
        phoneBook[phone] = {
            name,
            email
        };

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
function update(phone, name, email) {
    const phoneAndNameAreCorrect = check(phone, name);
    const exist = phoneBook.hasOwnProperty(phone);
    let different;
    if (exist) {
        const differentName = phoneBook[phone].name !== name;
        const differentEmail = phoneBook[phone].email !== email;
        different = differentName || differentEmail;
    }
    if (phoneAndNameAreCorrect && exist && different) {
        phoneBook[phone] = {
            name,
            email
        };

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
    let counter = 0;
    const result = _find(query);
    for (const phone in result) {
        if (!result.hasOwnProperty(phone)) {
            continue;
        }
        delete phoneBook[phone];
        counter++;
    }

    return counter;
}

function phoneFormat(phone) {
    return '+7 ' +
        `(${phone.slice(0, 3)}) ${phone.slice(3, 6)}-${phone.slice(6, 8)}-${phone.slice(8, 10)}`;
}

function format(phoneBookElements) {
    let result = [];
    for (const phone in phoneBookElements) {
        if (!phoneBookElements.hasOwnProperty(phone)) {
            continue;
        }
        const a = [phoneBookElements[phone].name, phoneFormat(phone)];
        if (phoneBookElements[phone].email !== undefined) {
            a.push(phoneBookElements[phone].email);
        }
        result.push(a.join(', '));
    }

    return result.sort();
}

function matches(el, phone, query) {
    return phone.includes(query) ||
        el.name.includes(query) ||
        el.hasOwnProperty('email') && el.email !== undefined && el.email.includes(query);
}

function _find(query) {
    if (!isNonEmptyString(query)) {
        return {};
    }
    if (query === '*') {
        return phoneBook;
    }
    let result = {};
    for (const phone in phoneBook) {
        if (!phoneBook.hasOwnProperty(phone)) {
            continue;
        }
        const el = phoneBook[phone];
        if (matches(el, phone, query)) {
            result[phone] = phoneBook[phone];
        }
    }

    return result;
}

/**
 * Поиск записей по запросу в телефонной книге
 * @param {String} query
 * @returns {String[]}
 */
function find(query) {
    return format(_find(query));
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
    const phones = csv.split('\n').map((str) => str.split(';'));
    let counter = 0;
    for (let i = 0; i < phones.length; i++) {
        if (add(phones[i][1], phones[i][0], phones[i][2])) {
            counter++;
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
