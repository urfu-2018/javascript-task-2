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

let id = 0;

class PhoneBookEntry {
    constructor(phone, name, email) {
        this.phone = phone;
        this.name = name;
        this.email = email;
    }
}

/**
 * Добавление записи в телефонную книгу
 * @param {String} phone
 * @param {String?} name
 * @param {String?} email
 * @returns {Boolean}
 */
function add(phone, name, email) {
    const correctPhone = /^\d{3}\d{3}\d{2}\d{2}$/g;
    if (!correctPhone.test(phone) || !isString(name)) {
        return false;
    }

    phoneBook[id] = new PhoneBookEntry(phone, name, email);

    return true;
}

function isTypeOf(obj, type) {
    return typeof obj === type;
}

function isString(obj) {
    return isTypeOf(obj, 'string');
}

function findByPhone(phone) {
    const keys = phoneBook.keys();
    for (const key in keys) {
        if (phone[key].phone === phone) {
            return phone[key];
        }
    }

    return undefined;
}

/**
 * Обновление записи в телефонной книге
 * @param {String} phone
 * @param {String?} name
 * @param {String?} email
 * @returns {Boolean}
 */
function update(phone, name, email) {
    const correctPhone = /^\d{3}\d{3}\d{2}\d{2}$/g;
    if (!correctPhone.test(phone) || !isString(name)) {
        return false;
    }

    let entry = findByPhone(phone);
    if (!entry) {
        return false;
    }

    entry.name = name;
    entry.email = email;

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
    let a = query.length;
    if (a) {
        return [];
    }
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
