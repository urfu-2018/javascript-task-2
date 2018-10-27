'use strict';

/**
 * Сделано задание на звездочку
 * Реализован метод importFromCsv
 */
const isStar = true;

/**
 * Телефонная книга
 */
const phoneBook = {};

/**
 * Добавление записи в телефонную книгу
 * @param {String} phone
 * @param {String?} name
 * @param {String?} email
 * @returns {Boolean}
 */

function add(phone, name, email) {
    name = getEmptyIfNotString(name);
    email = getEmptyIfNotString(email);
    if (typeof phone === 'string' &&
        /^\d{10}$/.test(phone) &&
        !phoneBook[phone] &&
        name) {
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
    if (phoneBook[phone] && name) {
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
    if (typeof query !== 'string' || !query) {
        return 0;
    }
    const arrRemoved = Object.keys(phoneBook)
        .filter(phone => query === '*' || isFind(phone, query));
    for (const phone of arrRemoved) {
        delete phoneBook[phone];
    }


    return arrRemoved.length;
}

function isFind(phone, query) {
    return query === '*' ||
        phone.includes(query) ||
        phoneBook[phone].name.includes(query) ||
        phoneBook[phone].email.includes(query);
}

/**
 * Поиск записей по запросу в телефонной книге
 * @param {String} query
 * @returns {String[]}
 */
function find(query) {
    const arrFindPhones = [];
    if (typeof query !== 'string' || !query) {
        return arrFindPhones;
    }
    for (const phone in phoneBook) {
        if (query === '*' || isFind(phone, query)) {
            arrFindPhones.push([phoneBook[phone].name, phone, phoneBook[phone].email]);
        }
    }
    arrFindPhones.sort(sortedPhonesByName);

    return getFormatString(arrFindPhones);
}

function sortedPhonesByName(a, b) {
    if (a[0] > b[0]) {
        return 1;
    }
    if (a[0] < b[0]) {
        return -1;
    }

    return 0;
}

function getFormatString(contacts) {
    const formatForPhone = /(\d{3})(\d{3})(\d{2})(\d{2})/;
    const arrFormatContacts = contacts.map(contact => {
        contact[1] = contact[1].replace(formatForPhone, replacer);

        return contact.filter(item => item).join(', ');
    });

    return arrFormatContacts;
}

function replacer() {
    return '+7 (' + arguments[1] + ') ' + [arguments[2], arguments[3], arguments[4]].join('-');
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
