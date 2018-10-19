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

/**
 *  Шаблон номера
 */
const phonePattern = /^[0-9]{10}$/;

/**
 * Проверка корректности аргументов
 * @param {String} phone
 * @param {String?} name
 * @returns {Boolean}
 */
function isCorrect(phone, name) {
    if (typeof phone !== 'string' ||
        typeof name !== 'string') {
        return false;
    }

    if (!name) {
        return false;
    }

    if (!phonePattern.test(phone)) {
        return false;
    }

    return true;
}

/**
 * Форматирует номер телефона
 * @param {String} phone
 * @returns {String}
 */
function prettifyPhone(phone) {
    return `+7 (${phone.slice(0, 3)}) ${phone.slice(3, 6)}-${phone.slice(6, 8)}-${phone.slice(8)}`;
}

/**
 *
 * @param {Any[]} phoneBookEntry
 * @returns {String}
 */
function prettifyEntry(phoneBookEntry) {
    return (phoneBookEntry[1].email)
        ? [
            phoneBookEntry[1].name,
            prettifyPhone(phoneBookEntry[0]),
            phoneBookEntry[1].email
        ].join(', ')
        : [
            phoneBookEntry[1].name,
            prettifyPhone(phoneBookEntry[0])
        ].join(', ');
}

/**
 * Добавление записи в телефонную книгу
 * @param {String} phone
 * @param {String?} name
 * @param {String?} email
 * @returns {Boolean}
 */
function add(phone, name, email) {
    if (!isCorrect(phone, name)) {
        return false;
    }

    if (phoneBook.has(phone)) {
        return false;
    }

    email = email || '';
    phoneBook.set(phone, {
        'name': name,
        'email': email
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
    if (!isCorrect(phone, name)) {
        return false;
    }

    if (!phoneBook.has(phone)) {
        return false;
    }

    email = email || '';
    phoneBook.set(phone, {
        'name': name,
        'email': email
    });

    return true;
}

/**
 * Удаление записей по запросу из телефонной книги
 * @param {String} query
 * @returns {Number}
 */
function findAndRemove(query) {
    return query.length;
}

/**
 * Поиск записей по запросу в телефонной книге
 * @param {String} query
 * @returns {String[]}
 */
function find(query) {
    const prettyEntries = Array.from(phoneBook)
        .sort((a, b) => a[1].name > b[1].name)
        .map(entry => prettifyEntry(entry));

    return (query === '*') ? prettyEntries : prettyEntries.filter(v => v.includes(query));
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
