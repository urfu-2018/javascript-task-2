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

class Contact {
    constructor(phone, name, email) {
        this.phone = phone;
        this.formatedPhone = formatPhone(phone);
        this.name = name;
        this.email = email || '';
    }

    toString() {
        let str = `${this.name}, ${this.formatedPhone}`;
        if (this.email) {
            str += `, ${this.email}`;
        }

        return str;
    }

    includes(query) {
        return this.phone.includes(query) ||
            this.email.includes(query) ||
            this.name.includes(query);
    }

    update(name, email) {
        this.name = name;
        this.email = email || '';
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
    if (!isPhoneCorrect(phone) || !isNameCorrect(name) ||
        !isEmailCorrect(email) || phoneBook.has(phone)) {
        return false;
    }
    phoneBook.set(phone, new Contact(phone, name, email));

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
    if (!isString(phone) || !isPhoneCorrect(phone) ||
        !isNameCorrect(name) || !isEmailCorrect(email) || !phoneBook.has(phone)) {
        return false;
    }

    phoneBook.get(phone).update(name, email);

    return true;
}

/**
 * Удаление записей по запросу из телефонной книги
 * @param {String} query
 * @returns {Number}
 */
function findAndRemove(query) {
    if (!isString(query) || query === '') {
        return 0;
    }

    const found = findByQuery(query);
    found.forEach(contact => phoneBook.delete(contact.phone));

    return found.length;
}

/**
 * Поиск записей по запросу в телефонной книге
 * @param {String} query
 * @returns {String[]}
 */
function find(query) {
    if (!isString(query) || query === '') {
        return [];
    }

    return findByQuery(query).sort((contact1, contact2) => contact1.name > contact2.name)
        .map(contact => contact.toString());
}

function findByQuery(query) {
    if (query === '*') {
        return Array.from(phoneBook.values());
    }
    let findResult = [];
    for (let contact of phoneBook.values()) {
        if (contact.includes(query)) {
            findResult.push(contact);
        }
    }

    return findResult;
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

    let split = csv.split('\n');
    let count = 0;

    split.forEach(item => {
        let [name, phone, email] = item.split(';');
        if (add(phone, name, email) || update(phone, name, email)) {
            count++;
        }
    });

    return count;
}

function isString(str) {
    return typeof str === 'string';
}

function isNameCorrect(name) {
    return isString(name) && name !== '';
}

function isEmailCorrect(email) {
    return typeof email === 'undefined' || isString(email);
}

function isPhoneCorrect(phone) {
    return /^\d{10}$/.test(phone);
}

function formatPhone(phone) {
    if (!isString(phone)) {
        return null;
    }
    const phoneFormat = /^(\d{3})(\d{3})(\d{2})(\d{2})$/;
    const match = phone.match(phoneFormat);
    if (!match) {
        return null;
    }

    return `+7 (${match[1]}) ${match[2]}-${match[3]}-${match[4]}`;
}

module.exports = {
    add,
    update,
    findAndRemove,
    find,
    importFromCsv,

    isStar
};
