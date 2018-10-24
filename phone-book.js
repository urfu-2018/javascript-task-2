'use strict';

/**
 * Сделано задание на звездочку
 * Реализован метод importFromCsv
 */
const isStar = false;

/**
 * Телефонная книга
 */
let phoneBook = [];

/**
 * Добавление записи в телефонную книгу
 * @param {String} phone
 * @param {String?} name
 * @param {String?} email
 * @returns {Boolean}
 */
function add(phone, name, email) {
    if (typeof(phone) !== 'string') {
        throw new TypeError();
    }
    if (phone.search('^\\d{10}$') === -1) {
        return false;
    }
    for (let i = 0; i < phoneBook.length; i++) {
        if (phoneBook[i].phone === phone) {
            return false;
        }
    }
    if (typeof(name) !== 'string') {
        return false;
    }
    phoneBook.push({ phone: phone, name: name, email: email });

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
    if (typeof(phone) !== 'string') {
        throw new TypeError();
    }
    if (phone.search('^\\d{10}$') === -1) {
        return false;
    }
    if (typeof(name) !== 'string') {
        return false;
    }
    for (let i = 0; i < phoneBook.length; i++) {
        if (phoneBook[i].phone === phone) {
            phoneBook.name = name;
            phoneBook.email = email;

            return true;
        }
    }

    return false;
}

/**
 * Удаление записей по запросу из телефонной книги
 * @param {String} query
 * @returns {Number}
 */
function findAndRemove(query) {
    let rez = [];
    let removed = 0;
    if (query === '*') {
        removed = phoneBook.length;
        phoneBook = rez;

        return removed;
    }
    for (let i = 0; i < phoneBook.length; i++) {
        if (!(phoneBook[i].phone.includes(query) ||
            phoneBook[i].name.includes(query) ||
            phoneBook[i].email.includes(query))) {
            rez.push(phoneBook[i]);
        }
    }
    removed = phoneBook.length - rez.length;
    phoneBook = rez;

    return removed;
}

/**
 * Поиск записей по запросу в телефонной книге
 * @param {String} query
 * @returns {String[]}
 */

function formatData(person) {
    return person.name +
    ', +7 (' +
    person.phone.slice(0, 3) +
    ') ' +
    person.phone.slice(3, 6) + '-' +
    person.phone.slice(6, 8) + '-' +
    person.phone.slice(8, 10) + ', ' + person.email;
}

function isSuitable(person, query) {

    return person.phone.includes(query) ||
    person.name.includes(query) ||
    person.email.includes(query);
}

function find(query) {
    let rez = [];
    if (query === '*') {
        for (let i = 0; i < phoneBook.length; i++) {
            rez.push(formatData(phoneBook[i]));
        }

        return rez.sort();
    }
    for (let i = 0; i < phoneBook.length; i++) {
        if (isSuitable(phoneBook[i], query)) {
            rez.push(formatData(phoneBook[i]));
        }
    }

    return rez.sort();
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
