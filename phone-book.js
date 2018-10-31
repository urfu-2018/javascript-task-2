'use strict';

/**
 * Сделано задание на звездочку
 * Реализован метод importFromCsv
 */
const isStar = true;

/**
 * Телефонная книга
 */
const phoneBook = [];

const phoneMatcher = /^(\d{3})(\d{3})(\d{2})(\d{2})$/;

function formatPhone(phone) {
    if (!phone || phone.toString() !== phone) {
        return null;
    }

    const tokens = phone.match(phoneMatcher);

    return !tokens ? null : `+7 (${tokens[1]}) ` + tokens.slice(2).join('-');
}

function findEntryByPhone(phone) {
    return phoneBook.find(entry => entry.phone === phone);
}


/**
 * Добавление записи в телефонную книгу
 * @param {String} phone
 * @param {String?} name
 * @param {String?} email
 * @returns {Boolean}
 */
function add(phone, name, email) {
    if (!name ||
        formatPhone(phone) === null ||
        findEntryByPhone(phone) !== undefined) {
        return false;
    }
    const entry = { phone: phone, name: name };
    if (email !== undefined) {
        entry.email = email;
    }
    phoneBook.push(entry);

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
    if (!name || formatPhone(phone) === null) {
        return false;
    }
    const entry = findEntryByPhone(phone);
    if (entry === undefined) {
        return false;
    }
    entry.name = name;
    entry.email = email;

    return true;
}

function searchPredicate(entry, query) {
    return Object.values(entry)
        .filter(Boolean)
        .some(string => string.includes(query));
}

function searchBy(query) {
    return entry => searchPredicate(entry, query);
}

/**
 * Удаление записей по запросу из телефонной книги
 * @param {String} query
 * @returns {Number}
 */
function findAndRemove(query) {
    if (!query) {
        return 0;
    }

    if (query === '*') {
        return phoneBook.splice(0, phoneBook.length).length;
    }

    const indexSupplier = () => phoneBook.findIndex(searchBy(query));
    let currentIndex = indexSupplier();
    let removedCount = 0;
    while (currentIndex > -1) {
        phoneBook.splice(currentIndex, 1);
        removedCount++;
        currentIndex = indexSupplier();
    }

    return removedCount;
}

/**
 * Поиск записей по запросу в телефонной книге
 * @param {String} query
 * @returns {String[]}
 */
function find(query) {
    if (!query) {
        return [];
    }

    const formatEntry = (entry) => [entry.name, formatPhone(entry.phone), entry.email]
        .filter(Boolean)
        .join(', ');

    return (query === '*' ? phoneBook : phoneBook.filter(searchBy(query)))
        .sort((first, second) => first.name.localeCompare(second.name))
        .map(formatEntry);
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
    const changeOrder = old => [old[1], old[0], old[2]];

    return csv
        .split('\n')
        .map(line => line.split(';'))
        .map(changeOrder)
        .map(line => update(...line) ? true : add(...line))
        .filter(Boolean)
        .length;
}

// noinspection JSUnresolvedVariable
module.exports = {
    add,
    update,
    findAndRemove,
    find,
    importFromCsv,

    isStar
};
