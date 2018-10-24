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

/**
 * Добавление записи в телефонную книгу
 * @param {String} phone
 * @param {String?} name
 * @param {String?} email
 * @returns {Boolean}
 */
function add(phone, name, email) {
    if (typeof phone !== 'string' || !/^[0-9]{10}$/.test(phone)) {
        return false;
    }
    if (isBadString(name)) {
        return false;
    }

    if (phoneBook[phone] !== undefined) {
        return false;
    }
    phoneBook[phone] = {
        phone: phone,
        name: name,
        email: email
    };

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
    if (typeof phone !== 'string' || !/[0-9]{10}/.test(phone)) {
        return false;
    }
    if (isBadString(name)) {
        return false;
    }

    phoneBook[phone].name = name;
    phoneBook[phone].email = email;

    return true;
}

/**
 * Удаление записей по запросу из телефонной книги
 * @param {String} query
 * @returns {Number}
 */
function findAndRemove(query) {
    let matchingEntryPhones = findMatchingEntryPhones(query);

    function removeEntryByPhone(phone) {
        delete phoneBook[phone];
    }

    matchingEntryPhones.forEach(removeEntryByPhone);

    return matchingEntryPhones.length;
}

/**
 * Поиск записей по запросу в телефонной книге
 * @param {String} query
 * @returns {String[]}
 */
function find(query) {
    let entries = findMatchingEntryPhones(query)
        .map(phone => entryToString(phoneBook[phone]));
    entries.sort((a, b) => a.localeCompare(b));

    return entries;
}

function isBadString(string) {
    return typeof string !== 'string' || string === undefined || string.trim() === '';
}
function findMatchingEntryPhones(query) {
    let phones = [];

    if (isBadString(query)) {
        return phones;
    }

    return Object.keys(phoneBook).filter(phone => doesMatch(phoneBook[phone], query));
}

function doesMatch(entry, query) {
    return query === '*' ||
        entry.name.includes(query) ||
        entry.phone.includes(query) ||
        (entry.email !== undefined && entry.email.includes(query));
}

function entryToString(entry) {
    let phone = entry.phone;
    let phoneString =
        `+7 (${phone.slice(0, 3)}) ${phone.slice(3, 6)}-${phone.slice(6, 8)}-${phone.slice(8)}`;
    if (isBadString(entry.email)) {
        return `${entry.name}, ${phoneString}`;
    }

    return `${entry.name}, ${phoneString}, ${entry.email}`;
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
    let importedCount = 0;
    let rows = csv.split('\n');
    for (let i = 0; i < rows.length; i++) {
        let entryAsArray = rows[i].split(';');
        let name = entryAsArray[0];
        let phone = entryAsArray[1];
        let email = entryAsArray[2];
        if (phoneBook[phone] === undefined) {
            importedCount += add(phone, name, email);
        } else {
            importedCount += update(phone, name, email);
        }

    }

    return importedCount;
}

module.exports = {
    add,
    update,
    findAndRemove,
    find,
    importFromCsv,

    isStar
};
