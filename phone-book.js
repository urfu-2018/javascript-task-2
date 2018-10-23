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
const phoneTest = /^\d{10}$/;

/**
 * Добавление записи в телефонную книгу
 * @param {String} phone
 * @param {String?} name
 * @param {String?} email
 * @returns {Boolean}
 */

function validPhone(phone) {
    return phone.length === 10 && phoneTest.test(phone);
}

function validString(string) {
    return typeof string === 'string' && string !== 0;
}

function validDate(phone, name) {
    return validPhone(phone) && validString(name);
}

function findPhone(phone) {
    for (let i = 0; i < phoneBook.length; i++) {
        if (phoneBook[i].phone === phone) {
            return i;
        }
    }

    return -1;
}

function add(phone, name, email) {
    if (!validDate(phone, name) || findPhone(phone) !== -1) {

        return false;
    }
    let contact = {};
    if (validString(email)) {
        contact.email = email;
    }
    contact.name = name;
    contact.phone = phone;
    phoneBook.push(contact);

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
    const necessaryContact = findPhone(phone);
    if (!validDate(phone, name) || necessaryContact === -1) {

        return false;
    }
    let contact = {};
    if (validString(email)) {
        contact.email = email;
    }
    contact.name = name;
    contact.phone = phone;
    phoneBook[necessaryContact] = contact;

    return true;
}

function findQueryInContact(contact, query) {
    let email = false;
    if (contact.email) {
        email = contact.email.indexOf(query) !== -1;
    }

    return email || contact.name.indexOf(query) !== -1 || contact.phone.indexOf(query) !== -1;
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
    const countContact = phoneBook.length;
    let processed;
    if (query === '*') {
        phoneBook = [];

        return countContact;
    }
    processed = phoneBook.filter(contact => findQueryInContact(contact, query) !== true);
    phoneBook = processed;

    return countContact - processed.length;
}

/**
 * Поиск записей по запросу в телефонной книге
 * @param {String} query
 * @returns {String[]}*/

function find(query) {
    if (query === '') {
        return [];
    }
    let processed;
    if (query === '*') {
        processed = phoneBook;
    } else {
        processed = phoneBook.filter(contact => findQueryInContact(contact, query) === true);
    }

    return processed.sort(function f(contact1, contact2) {
        const name1 = contact1.name;
        const name2 = contact2.name;
        if (name1 > name2) {
            return 1;
        }

        return name1 < name2 ? -1 : 0;
    }).map(function (contact) {
        const formattedPhone = contact.phone.replace(/(.{3})(.{3})(.{2})(.{2})/,
            '+7 ($1) $2-$3-$4');
        let result = contact.name + ', ' + formattedPhone;
        if (contact.email) {
            result += ', ' + contact.email;
        }

        return result;
    });
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

    const entries = csv.split('\n');
    let counter = 0;
    for (let entry of entries) {
        const contact = entry.split(';');
        const name = contact[0];
        const phone = contact[1];
        const email = contact[2];
        if (add(phone, name, email) || update(phone, name, email)) {
            counter ++;
        }
    }

    return counter;
}

module.exports = {
    add,
    update,
    findAndRemove,
    find,
    importFromCsv,

    isStar
};
