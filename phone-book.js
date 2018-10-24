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
 * Добавление записи в телефонную книгу
 * @param {String} phone
 * @param {String?} name
 * @param {String?} email
 * @returns {Boolean}
 */
function add(phone, name, email) {
    if (!/^\d{10}$/.test(phone) || !name || phoneBook.has(phone)) {
        return false;
    }
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
    if (!/^\d{10}$/.test(phone) || !name || !phoneBook.has(phone)) {
        return false;
    }
    let phoneRecord = phoneBook.get(phone);
    phoneRecord.name = name;
    phoneRecord.email = email;

    return true;
}

/**
 * Удаление записей по запросу из телефонной книги
 * @param {String} query
 * @returns {Number}
 */
function findAndRemove(query) {
    const contacts = findContacts(query);
    for (let i = 0; i < contacts.length; i++) {
        phoneBook.delete(contacts[i][1]);
    }

    return contacts.length;
}

/**
 * Поиск записей по запросу в телефонной книге
 * @param {String} query
 * @returns {String[]}
 */
function find(query) {
    const contacts = findContacts(query);
    contacts.sort((c1, c2) => c1[0].localeCompare(c2[0]));

    return contacts.map(
        contact =>
            `${contact[0]}, ${formalize(contact[1])}${contact[2] ? `, ${contact[2]}` : ''}`);
}

function findContacts(query) {
    if (!query) {
        return [];
    }
    const searchQuery = query === '*' ? '' : query;
    let foundContacts = [];
    for (let [phone, record] of phoneBook) {
        if (queryInPhoneRecord(searchQuery, phone, record)) {
            foundContacts.push([record.name, phone, record.email]);
        }
    }

    return foundContacts;
}

function queryInPhoneRecord(query, phone, contact) {
    return `${phone}, ${contact.name}, ${contact.email}`.indexOf(query) !== -1;
}

function formalize(phone) {
    return `+7 (${phone.slice(0, 3)}) ${phone.slice(3, 6)}-${phone.slice(6, 8)}-${phone.slice(8)}`;
}

/**
 * Импорт записей из csv-формата
 * @star
 * @param {String} csv
 * @returns {Number} – количество добавленных и обновленных записей
 */
function importFromCsv(csv) {
    let correctContactsNumber = 0;
    let contacts = csv.split('\n');
    for (let i = 0; i < contacts.length; i++) {
        let [name, phone, email] = contacts[i].split(';');
        if (phoneBook.has(phone)) {
            correctContactsNumber += update(phone, name, email) ? 1 : 0;
        } else {
            correctContactsNumber += add(phone, name, email) ? 1 : 0;
        }
    }

    return correctContactsNumber;
}

module.exports = {
    add,
    update,
    findAndRemove,
    find,
    importFromCsv,

    isStar
};
