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

function isString(str) {
    return typeof str === 'string';
}

function isCorrectName(name) {
    return isString(name) && name !== '';
}

function isCorrectPhone(phone) {
    const phoneRegex = /^\d{10}$/;

    return isString(phone) && phoneRegex.test(phone);
}

function isBookContains(phone) {
    return phoneBook.some(contact => contact.phone === phone);
}

/**
 * Добавление записи в телефонную книгу
 * @param {String} phone
 * @param {String?} name
 * @param {String?} email
 * @returns {Boolean}
 */
function add(phone, name, email) {
    if (!isCorrectName(name) || !isCorrectPhone(phone) || isBookContains(phone)) {
        return false;
    }

    phoneBook.push({
        phone: phone,
        email: email,
        name: name
    });

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
    if (!isCorrectName(name) || !isCorrectPhone(phone) || !isBookContains(phone)) {
        return false;
    }

    let contactToResult = getContactsBy(phone)[0];
    contactToResult.name = name;
    contactToResult.email = email;

    return true;
}

/**
 * Удаление записей по запросу из телефонной книги
 * @param {String} query
 * @returns {Number}
 */
function findAndRemove(query) {
    const toDelete = getContactsBy(query);
    toDelete.forEach(removeFromBook);

    return toDelete.length;
}

function removeFromBook(contact) {
    phoneBook.splice(phoneBook.indexOf(contact), 1);
}

function getContactsBy(query) {
    return phoneBook
        .filter(contact => filterByQuery(contact, query));
}

/**
 * Поиск записей по запросу в телефонной книге
 * @param {String} query
 * @returns {String[]}
 */
function find(query) {
    return getContactsBy(query)
        .sort((first, second) => first.name.localeCompare(second.name))
        .map(contactToString);
}

function contactToString(contact) {
    let parts = [
        contact.name,
        formatPhone(contact.phone),
        contact.email
    ];

    return parts.filter(part => part !== undefined)
        .join(', ');
}

function formatPhone(phone) {
    let first = phone.substr(0, 3);
    let second = phone.substr(3, 3);
    let third = phone.substr(6, 2);
    let fourth = phone.substr(8, 2);

    return `+7 (${first}) ${second}-${third}-${fourth}`;
}

function filterByQuery(contact, query) {
    if (query === '') {
        return false;
    }
    if (query === '*') {
        return true;
    }

    return Object.keys(contact)
        .some(key => isContains(contact[key], query));
}

function isContains(source, stringToFind) {
    return source !== undefined && source.indexOf(stringToFind) !== -1;
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
        .map(contactAsString => contactAsString.split(';'))
        .reduce(countAddedAndUpdated, 0);
}

function countAddedAndUpdated(acc, item) {
    let name = item[0];
    let phone = item[1];
    let email = item[2];

    if (update(phone, name, email) || add(phone, name, email)) {
        acc += 1;
    }

    return acc;
}

module.exports = {
    add,
    update,
    findAndRemove,
    find,
    importFromCsv,

    isStar
};
