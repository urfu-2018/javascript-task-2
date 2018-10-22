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

const phoneRegex = /^(\d{3})(\d{3})(\d{2})(\d{2})$/;

function isValidPhoneAndName(phone, name) {
    if (!isValidType(phone) || !isValidType(name)) {
        return false;
    }

    if (!phoneRegex.test(phone)) {
        return false;
    }

    return isEmptySting(name);
}

function isEmptySting(str) {
    return str.trim();
}

function isValidType(obj, type = 'string') {
    return typeof obj === type;
}

function findContacts(query) {
    if (!isValidType(query) || !isEmptySting(query)) {
        return [];
    }

    const returnEverything = query === '*';
    const searchResult = [];

    for (let contact of getAllContacts()) {
        if (returnEverything ||
            `${contact.name};${contact.phone};${contact.email}`.indexOf(query) !== -1) {
            searchResult.push(contact);
        }
    }

    return searchResult;
}

function getAllContacts() {
    const result = [];
    for (let key of Object.keys(phoneBook)) {
        let { name, email } = phoneBook[key];
        result.push({ phone: key, name, email });
    }

    return result.sort((a, b) => a.name.localeCompare(b.name));
}

/**
 * Добавление записи в телефонную книгу
 * @param {String} phone
 * @param {String?} name
 * @param {String?} email
 * @returns {Boolean}
 */
function add(phone, name, email) {
    if (!isValidPhoneAndName(phone, name)) {
        return false;
    }

    if (phone in phoneBook) {
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
function update(phone, name, email = null) {
    if (!isValidPhoneAndName(phone, name)) {
        return false;
    }

    if (!(phone in phoneBook)) {
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
    let removedCount = 0;

    for (let contact of findContacts(query)) {
        if (contact.phone in phoneBook) {
            delete phoneBook[contact.phone];
            removedCount++;
        }
    }

    return removedCount;
}

/**
 * Поиск записей по запросу в телефонной книге
 * @param {String} query
 * @returns {String[]}
 */
function find(query) {
    const searchResult = [];

    for (let contact of findContacts(query)) {
        const match = contact.phone.match(phoneRegex);
        const phone = `+7 (${match[1]}) ${match[2]}-${match[3]}-${match[4]}`;
        const email = contact.email ? `, ${contact.email}` : '';
        searchResult.push(`${contact.name}, ${phone}${email}`);
    }

    return searchResult;
}

/**
 * Импорт записей из csv-формата
 * @star
 * @param {String} csv
 * @returns {Number} – количество добавленных и обновленных записей
 */
function importFromCsv(csv) {
    const records = csv.split('\n');

    let newContacts = 0;
    for (let i = 0; i < records.length; i++) {
        let [name, phone, email] = records[i].split(';');

        if (update(phone, name, email) || add(phone, name, email)) {
            newContacts++;
        }
    }

    return newContacts;
}

module.exports = {
    add,
    update,
    findAndRemove,
    find,
    importFromCsv,

    isStar
};
