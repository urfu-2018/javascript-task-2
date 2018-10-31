'use strict';

/**
 * Сделано задание на звездочку
 * Реализован метод importFromCsv
 */
const isStar = false;

/**
 * Телефонная книга
 */
let phoneBook = [];

const regexp = /^\d{10}$/;

/**
 * Добавление записи в телефонную книгу
 * @param {String} phone
 * @param {String?} name
 * @param {String?} email
 * @returns {Boolean}
 */
function add(phone, name, email) {
    name = validateName(name);
    phone = validatePhone(phone);
    if (name && phone && phoneBook[phone] === undefined) {
        if (email) {
            phoneBook[phone] = {
                name: name,
                email: email
            };
        } else {
            phoneBook[phone] = {
                name: name,
                email: ''
            };
        }

        return true;
    }

    return false;
}

function validateName(name) {
    if (name === undefined || name === '') {
        return undefined;
    }

    return name;
}

function validatePhone(phone) {
    if (typeof phone === 'string' && regexp.test(phone)) {
        return phone;
    }

    return undefined;
}

function validateQuery(query) {
    if (typeof query !== 'string' || query === '') {
        return undefined;
    }

    return query;
}

/**
 * Обновление записи в телефонной книге
 * @param {String} phone
 * @param {String?} name
 * @param {String?} email
 * @returns {Boolean}
 */
function update(phone, name, email) {
    name = validateName(name);
    phone = validatePhone(phone);
    if (name && phone && phoneBook[phone] !== undefined) {
        if (email) {
            phoneBook[phone] = {
                name: name,
                email: email
            };
        } else {
            phoneBook[phone] = {
                name: name,
                email: ''
            };
        }

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
    query = validateQuery(query);
    let deletedQuantity = 0;
    if (!query) {
        return 0;
    } else if (query === '*') {
        deletedQuantity = Object.keys(phoneBook).length;
        phoneBook = [];

        return deletedQuantity;
    }
    Object.keys(phoneBook).forEach(function (phone) {
        if (phone.includes(query) || phoneBook[phone].name.includes(query) ||
        phoneBook[phone].email.includes(query)) {
            delete phoneBook[phone];
            deletedQuantity++;
        }
    });

    return deletedQuantity;
}

/**
 * Поиск записей по запросу в телефонной книге
 * @param {String} query
 * @returns {String[]}
 */
function find(query) {
    query = validateQuery(query);
    let formatEntry = [];
    if (!query) {
        return formatEntry;
    } else if (query === '*') {
        Object.keys(phoneBook).forEach(function (phone) {
            formatEntry.push(rewriteInString(phone));
        });
    } else {
        formatEntry = findMatches(query, formatEntry);
    }

    return formatEntry.sort(sortByName);
}

function rewriteInString(phone) {
    let fixPhone = '+7 (' + phone.slice(0, 3) + ') ' + phone.slice(3, 6) +
    '-' + phone.slice(6, 8) + '-' + phone.slice(8);
    if (phoneBook[phone].email !== '') {
        return (phoneBook[phone].name + ', ' + fixPhone + ', ' + phoneBook[phone].email);
    }

    return (phoneBook[phone].name + ', ' + fixPhone);
}

function findMatches(query, formatArray) {
    Object.keys(phoneBook).forEach(function (phone) {
        if (phone.includes(query) ||
        phoneBook[phone].name.includes(query) ||
        phoneBook[phone].email.includes(query)) {
            formatArray.push(rewriteInString(phone));
        }
    });

    return formatArray;
}

function sortByName(name1, name2) {
    if (name1[0].toLowerCase() > name2[0].toLowerCase()) {
        return 1;
    } else if (name1[0].toLowerCase() < name2[0].toLowerCase()) {
        return -1;
    }

    return 0;
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
