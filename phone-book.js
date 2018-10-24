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
const phoneTest = /(\d{3})(\d{3})(\d{2})(\d{2})/;

/**
 * Добавление записи в телефонную книгу
 * @param {String} phone
 * @param {String?} name
 * @param {String?} email
 * @returns {Boolean}
 */

function validDate(phone, name) {
    return phone.length === 10 && phoneTest.test(phone) && typeof name === 'string' &&
        name.length !== 0;
}

function add(phone, name, email) {
    if (!validDate(phone, name) || phoneBook.get(phone)) {
        return false;
    }
    phoneBook.set(phone, email ? { name, email } : { name });

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
    if (!validDate(phone, name) || !phoneBook.get(phone)) {
        return false;
    }
    phoneBook.set(phone, email ? { name, email } : { name });

    return true;
}

/**
 * Удаление записей по запросу из телефонной книги
 * @param {String} query
 * @returns {Number}
 */

function findAndRemove(query) {
    if (query === '') {
        return 0;
    }
    if (query === '*') {
        phoneBook.clear();

        return phoneBook.size;
    }

    return Array.from(phoneBook.entries()).filter(([phone, { name, email = '' }]) =>
        phone.includes(query) || name.includes(query) || email.includes(query))
        .map(([phone]) => phoneBook.delete(phone)).length;
}

/**
 * Поиск записей по запросу в телефонной книге
 * @param {String} query
 * @returns {String[]}
 */

function find(query) {
    if (query === '') {
        return [];
    }

    return Array.from(phoneBook.entries()).filter(([phone, { name, email }]) =>
        query === '*' || phone.includes(query) || name.includes(query) || email.includes(query))
        .map(([phone, { name, email }]) =>
            `${name}, ${phone.replace(phoneTest, '+7 ($1) $2-$3-$4')}${email ? ', ' + email : ''}`)
        .sort();
}

/**
 * Импорт записей из csv-формата
 * @star
 * @param {String} csv
 * @returns {number} – количество добавленных и обновленных записей
 */

function importFromCsv(csv) {
    // Парсим csv
    // Добавляем в телефонную книгу
    // Либо обновляем, если запись с таким телефоном уже существует

    return csv.split('\n').filter(log => {
        const contact = log.split(';');
        const name = contact[0];
        const phone = contact[1];
        const email = contact[2];

        return add(phone, name, email) || update(phone, name, email);
    }).length;
}

module.exports = {
    add,
    update,
    findAndRemove,
    find,
    importFromCsv,

    isStar
};
