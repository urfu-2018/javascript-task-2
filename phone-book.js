'use strict';

class Person {
    constructor(name, phone, email) {
        this.name = name;
        this.phone = phone;
        this.email = email || '';
    }

    toString() {
        let result = this.name + ', ' + this.phone;
        if (this.email !== '') {
            result += ', ' + this.email;
        }

        return result;
    }

    contains(query) {
        return this.name.includes(query) || this.phone.includes(query) ||
        this.email.includes(query);
    }
}

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
    const convertedPhone = tryConvertPhoneNumber(phone);
    if (isName(name) && convertedPhone && isEmail(email) && !phoneBook.has(convertedPhone)) {
        phoneBook.set(convertedPhone, new Person(name, convertedPhone, email));

        return true;
    }

    return false;
}

/**
 * Обновление записи в телефонной книге
 * @param {String} phone
 * @param {String?} name
 * @param {String?} email
 * @returns {Boolean}
 */
function update(phone, name, email) {
    const convertedPhone = tryConvertPhoneNumber(phone);
    if (isName(name) && convertedPhone && isEmail(email) && phoneBook.has(convertedPhone)) {
        phoneBook.delete(convertedPhone);
        phoneBook.set(convertedPhone, new Person(name, convertedPhone, email));

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
    const found = find(query);
    found.map(person => phoneBook.delete(person.phone));

    return found.length;
}

/**
 * Поиск записей по запросу в телефонной книге
 * @param {String} query
 * @returns {String[]}
 */
function find(query) {
    if (!(typeof query === 'string') || query === '') {
        return [];
    }
    const persons = Array.from(phoneBook.values());
    persons.sort((per1, per2) => per1.name > per2.name);
    if (query === '*') {

        return persons.map(person => person.toString());
    }

    return persons.filter((person) => person.toString().includes(query))
        .map(person => person.toString());
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
function isEmail(email) {
    return typeof email === 'string' || typeof email === 'undefined';
}
function tryConvertPhoneNumber(phone) {
    if (!(typeof phone === 'string')) {
        return false;
    }

    const correctPhone = /^(\d{3})(\d{3})(\d{2})(\d{2})$/; // 5556667788
    const match = phone.match(correctPhone);
    if (!match) {

        return false;
    }

    return `+7 (${match[1]}) ${match[2]}-${match[3]}-${match[4]}`; // +7 (555) 666-77-88
}
function isName(name) {
    return typeof name === 'string' && name !== '';
}
module.exports = {
    add,
    update,
    findAndRemove,
    find,
    importFromCsv,

    isStar
};
