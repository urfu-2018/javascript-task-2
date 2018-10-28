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

function validatePhone(phone) {
    return typeof(phone) === 'string' && /^\d{10}$/.test(phone);
}

/**
 * Добавление записи в телефонную книгу
 * @param {String} phone
 * @param {String?} name
 * @param {String?} email
 * @returns {Boolean}
 */
function add(phone, name, email = '') {
    if (!validatePhone(phone) || phoneBook.has(phone) || !name) {
        return false;
    }
    phoneBook.set(phone, [name, email]);

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
    if (!phoneBook.has(phone) || !name) {
        return false;
    }
    phoneBook.delete(phone);

    return add(phone, name, email);
}

function checkMatch(item, query) {
    return (query === '*' || item[0].includes(query) || item[1][0].includes(query) ||
    item[1][1].includes(query));
}

/** Удаление записей по запросу из телефонной книги
 * @param {String} query
 * @returns {Number}
 */
function findAndRemove(query) {
    let count = 0;
    if (query === '') {
        return 0;
    }
    for (let i of phoneBook) {
        if (checkMatch(i, query)) {
            phoneBook.delete(i[0]);
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
    let foundContacts = [];
    if (query === '') {
        return foundContacts;
    }
    for (let i of phoneBook) {
        let email = checkAndConvertEmail(i[1][1]);
        if (checkMatch(i, query)) {
            foundContacts.push(formatRecord(i) + email);
        }
    }
    foundContacts.sort();

    return foundContacts;
}

function formatRecord(item) {
    return item[1][0] + ', +7 (' + item[0].substr(0, 3) + ') ' + item[0].substr(3, 3) + '-' +
    item[0].substr(6, 2) + '-' + item[0].substr(8, 2);
}

/**
 * @param {String} email
 * @returns {String}
 */
function checkAndConvertEmail(email) {
    if (email) {
        return ', ' + email;
    }

    return '';
}

/**
 * Импорт записей из csv-формата
 * @star
 * @param {String} csv
 * @returns {Number} – количество добавленных и обновленных записей
 */
function importFromCsv(csv) {
    const contacts = csv.split('\n');
    let numberContacts = 0;
    for (let i of contacts) {
        let contactInfo = i.split(';');
        if (add(contactInfo[1], contactInfo[0], contactInfo[2]) ||
        update(contactInfo[1], contactInfo[0], contactInfo[2])) {
            numberContacts++;
        }
    }

    return numberContacts;
}

module.exports = {
    add,
    update,
    findAndRemove,
    find,
    importFromCsv,

    isStar
};
