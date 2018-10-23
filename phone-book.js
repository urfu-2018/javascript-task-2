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

/**
 * Добавление записи в телефонную книгу
 * @param {String} phone
 * @param {String?} name
 * @param {String?} email
 * @returns {Boolean}
 */

function add(phone, name, email) {
    const regExpPhone = /^\d{10}$/;
    name = getEmptyIfNotString(name);
    email = getEmptyIfNotString(email);
    if (typeof phone === 'string' &&
        regExpPhone.test(phone) &&
        phoneBook[phone] === undefined &&
        name !== '') {
        phoneBook[phone] = {
            name: name,
            email: email
        };

        return true;
    }

    return false;
}

function getEmptyIfNotString(str) {
    return typeof str === 'string' ? str : '';
}

/**
 * Обновление записи в телефонной книге
 * @param {String} phone
 * @param {String?} name
 * @param {String?} email
 * @returns {Boolean}
 */
function update(phone, name, email) {
    name = getEmptyIfNotString(name);
    email = getEmptyIfNotString(email);
    if (phoneBook[phone] !== undefined &&
        name !== '') {
        phoneBook[phone] = {
            name: name,
            email: email
        };

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
    if (typeof query !== 'string' || query === '') {
        return 0;
    }
    let countDeleted = 0;
    for (const phone in phoneBook) {
        if (query === '*') {
            delete phoneBook[phone];
            countDeleted++;
        } else if (isFind(phone, query)) {
            delete phoneBook[phone];
            countDeleted++;
        }
    }

    return countDeleted;
}

function isFind(phone, query) {
    return phone.indexOf(query) !== -1 ||
        phoneBook[phone].name.indexOf(query) !== -1 ||
        phoneBook[phone].email.indexOf(query) !== -1;
}

/**
 * Поиск записей по запросу в телефонной книге
 * @param {String} query
 * @returns {String[]}
 */
function find(query) {
    const arrFindPhones = [];
    if (typeof query !== 'string' && query === '') {
        return arrFindPhones;
    }
    for (const phone in phoneBook) {
        if (query === '*') {
            arrFindPhones.push([phoneBook[phone].name, phone, phoneBook[phone].email]);
        } else if (isFind(phone, query)) {
            arrFindPhones.push([phoneBook[phone].name, phone, phoneBook[phone].email]);
        }
    }
    arrFindPhones.sort(sortedPhonesByName);

    return getFormatString(arrFindPhones);
}

function sortedPhonesByName(manA, manB) {
    return manA[0].localeCompare(manB[0]);
}

function getFormatString(contacts) {
    const formatForPhone = /(\d{3})(\d{3})(\d{2})(\d{2})/;
    const arrFormatContacts = [];
    for (let contact of contacts) {
        contact[1] = contact[1].replace(formatForPhone, replacer);
        arrFormatContacts.push(getConcatContact(contact));
    }

    return arrFormatContacts;
}

function replacer() {
    return '+7 (' + arguments[1] + ') ' + [arguments[2], arguments[3], arguments[4]].join('-');
}

function getConcatContact(contact) {
    let contactsInStr = contact[0];
    for (let i = 1; i < contact.length; i++) {
        if (contact[i] !== '') {
            contactsInStr += ', ' + contact[i];
        }
    }

    return contactsInStr;
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
    const contactsInStr = csv.split('\n');
    let countAdded = 0;
    for (const contact of contactsInStr) {
        const contactInArr = contact.split(';');
        if (phoneBook[contactInArr[1]] === undefined) {
            countAdded += isSuccess(add(contactInArr[1], contactInArr[0], contactInArr[2]));
        } else {
            countAdded += isSuccess(update(contactInArr[1], contactInArr[0], contactInArr[2]));
        }
    }

    return countAdded;
}

function isSuccess(isAdd) {

    return isAdd ? 1 : 0;
}

module.exports = {
    add,
    update,
    findAndRemove,
    find,
    importFromCsv,

    isStar
};
