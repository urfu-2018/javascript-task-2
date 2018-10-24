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
    if (!dataValidation(phone, name, email) || phoneBook.has(phone)) {
        return false;
    }
    phoneBook.set(phone, {
        name,
        email
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
    if (!dataValidation(phone, name, email) || !phoneBook.has(phone)) {
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
        phoneBook.delete(contacts[i].phone);
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
    contacts.sort((c1, c2) => c1.name.localeCompare(c2.name));

    return contacts.map(
        contact =>
            `${contact.name}, ${formalize(contact.phone)}${contact.email
                ? `, ${contact.email}` : ''}`
    );
}

function formalize(phone) {
    return `+7 (${phone.slice(0, 3)}) ${phone.slice(3, 6)}-${phone.slice(6, 8)}-${phone.slice(8)}`;
}

function findContacts(query) {
    if (!query || typeof(query) !== 'string') {
        return [];
    }
    const searchQuery = query === '*' ? '' : query;
    let foundContacts = [];
    for (let [phone, record] of phoneBook) {
        if (queryInPhoneRecord(searchQuery, phone, record)) {
            foundContacts.push({
                'name': record.name,
                phone,
                'email': record.email
            });
        }
    }

    return foundContacts;
}

function queryInPhoneRecord(query, phone, contact) {
    return phone.indexOf(query) !== -1 ||
        contact.name.indexOf(query) !== -1 ||
        contact.email && contact.email.indexOf(query) !== -1;
}

/**
 * Импорт записей из csv-формата
 * @star
 * @param {String} csv
 * @returns {Number} – количество добавленных и обновленных записей
 */
function importFromCsv(csv) {
    let correctChanges = 0;
    let contacts = csv.split('\n');
    for (let i = 0; i < contacts.length; i++) {
        let [name, phone, email] = contacts[i].split(';');
        correctChanges += Number(!phoneBook.has(phone)
            ? add(phone, name, email)
            : update(phone, name, email)
        );
    }

    return correctChanges;
}

function dataValidation(phone, name, email) {
    return typeof(phone) === 'string' && /^\d{10}$/.test(phone) &&
        name && typeof(name) === 'string' &&
        (!email || typeof(email) === 'string');
}

module.exports = {
    add,
    update,
    findAndRemove,
    find,
    importFromCsv,

    isStar
};
