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

const phoneRegex = /^(\d{3})(\d{3})(\d{2})(\d{2})$/;

function isValidPhoneAndName(phone, name) {
    if (!isTypeOfString(phone) || !isTypeOfString(name) || !phoneRegex.test(phone)) {
        return false;
    }

    return isNotEmptySting(name);
}

function isNotEmptySting(str) {
    return Boolean(str.trim());
}

function isTypeOfString(obj) {
    return typeof obj === 'string';
}

function findContacts(query) {
    if (!isTypeOfString(query) || !isNotEmptySting(query)) {
        return [];
    }

    const returnEverything = query === '*';

    return getAllContacts()
        .filter(({ name, phone, email }) =>
            returnEverything || (name + phone + email).includes(query));
}

function getAllContacts() {
    return [...phoneBook.keys()]
        .map(key => ({
            phone: key,
            name: phoneBook.get(key).name,
            email: phoneBook.get(key).email
        }))
        .sort((a, b) => a.name.localeCompare(b.name));
}

function formatContact(contact) {
    const match = contact.phone.match(phoneRegex);
    const phone = `+7 (${match[1]}) ${match[2]}-${match[3]}-${match[4]}`;
    const email = contact.email ? `, ${contact.email}` : '';

    return `${contact.name}, ${phone}${email}`;
}

/**
 * Добавление записи в телефонную книгу
 * @param {String} phone
 * @param {String?} name
 * @param {String?} email
 * @returns {Boolean}
 */
function add(phone, name, email) {
    if (!isValidPhoneAndName(phone, name) || phoneBook.has(phone)) {
        return false;
    }

    phoneBook.set(phone, { name, email });

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
    if (!isValidPhoneAndName(phone, name) || !phoneBook.has(phone)) {
        return false;
    }

    phoneBook.set(phone, { name, email });

    return true;
}

/**
 * Удаление записей по запросу из телефонной книги
 * @param {String} query
 * @returns {Number}
 */
function findAndRemove(query) {
    return findContacts(query)
        .filter(contact => phoneBook.delete(contact.phone))
        .length;
}

/**
 * Поиск записей по запросу в телефонной книге
 * @param {String} query
 * @returns {String[]}
 */
function find(query) {
    return findContacts(query)
        .map(contact => formatContact(contact));
}

/**
 * Импорт записей из csv-формата
 * @star
 * @param {String} csv
 * @returns {Number} – количество добавленных и обновленных записей
 */
function importFromCsv(csv) {
    return csv.split('\n')
        .map(record => {
            let [name, phone, email] = record.split(';');

            return { phone, name, email };
        })
        .filter(x => update(x.phone, x.name, x.email) || add(x.phone, x.name, x.email))
        .length;
}

module.exports = {
    add,
    update,
    findAndRemove,
    find,
    importFromCsv,

    isStar
};
