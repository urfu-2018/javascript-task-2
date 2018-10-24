'use strict';

/**
 * Сделано задание на звездочку
 * Реализован метод importFromCsv
 */
const isStar = false;

/**
 * Телефонная книга
 */
let phoneBook = new Map();

/**
 * Добавление записи в телефонную книгу
 * @param {String} phone
 * @param {String?} name
 * @param {String?} email
 * @returns {Boolean}
 */
function add(phone, name, email) {
    if (phoneBook.has(phone)) {
        return false;
    }
    if (/^[0-9]{10}$/.test(phone) && name) {
        phoneBook.set(phone, { name: name, phone: phone, email: email });

        return true;
    }

    return false;
}

function formatNumber(phone) {
    return phone.replace(/^(\d{3})(\d{3})(\d{2})(\d{2})$/, '+7 ($1) $2-$3-$4');
}

function formatLine(line) {
    return (`${line.name}, ${formatNumber(line.phone)}${line.email ? `, ${line.email}` : ''}`);
}

function nameIsCorrect(name) {
    return name && typeof name === 'string';
}

/**
 * Обновление записи в телефонной книге
 * @param {String} phone
 * @param {String?} name
 * @param {String?} email
 * @returns {Boolean}
 */
function update(phone, name, email) {
    if (nameIsCorrect(name) && /^[0-9]{10}$/.test(phone) && name && phoneBook.has(phone)) {
        phoneBook.set(phone, { name: name, phone: phone, email: email });

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
    if (typeof query !== 'string') {
        throw new TypeError();
    }
    let count = 0;
    for (var [key, value] of phoneBook.entries()) {
        if (query === '*' || findInLine(value, query)) {
            phoneBook.delete(key);
            count++;
        }
    }

    return count;
}

function findInLine(line, query) {
    return line.phone.indexOf(query) > -1 || line.name.indexOf(query) > -1 ||
        (line.email && line.email.indexOf(query) > -1);
}

/**
 * Поиск записей по запросу в телефонной книге
 * @param {String} query
 * @returns {String[]}
 */
function find(query) {
    if (typeof query !== 'string') {
        throw new TypeError();
    }
    const res = [];
    for (var value of phoneBook.values()) {
        if (query === '*' || findInLine(value, query)) {
            res.push(value);
        }
    }

    return res.map(x => formatLine(x)).sort();
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
