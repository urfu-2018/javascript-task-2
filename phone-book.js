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

/**
 * Добавление записи в телефонную книгу
 * @param {String} phone
 * @param {String?} name
 * @param {String?} email
 * @returns {Boolean}
 */
function add(phone, name, email) {
    const regexp = /^\d{10}$/;
    if (typeof phone === 'string' && regexp.test(phone) && name !== undefined &&
    phoneBook[phone] === undefined) {
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
 * Обновление записи в телефонной книге
 * @param {String} phone
 * @param {String?} name
 * @param {String?} email
 * @returns {Boolean}
 */
function update(phone, name, email) {
    const regexp = /^\d{10}$/;
    if (typeof phone === 'string' && regexp.test(phone) && name !== undefined &&
    phoneBook[phone] !== undefined) {
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
    if (typeof query !== 'string' || !query) {
        return 0;
    } else if (query === '*') {
        const deletedQuantity = Object.keys(phoneBook).length;
        phoneBook = [];

        return deletedQuantity;
    }

    return deleteAndCount(query);
}

function deleteAndCount(query) {
    let deletedQuantity = 0;
    for (let phone in phoneBook) {
        if (phone.includes(query) || phoneBook[phone].name.includes(query) ||
        phoneBook[phone].email.includes(query)) {
            delete phoneBook[phone];
            deletedQuantity++;
        }
    }

    return deletedQuantity;
}

/**
 * Поиск записей по запросу в телефонной книге
 * @param {String} query
 * @returns {String[]}
 */
function find(query) {
    let formatArray = [];
    if (typeof(query) !== 'string' || query === '') {
        return;
    } else if (query === '*') {
        for (let i = 0; i < Object.keys(phoneBook).length; i++) {
            formatArray.push(rewriteInString(Object.keys(phoneBook)[i]));
        }
    } else {
        formatArray = findMatching(query, formatArray);
    }

    return formatArray.sort(sortByName);
}

function rewriteInString(phone) {
    let fixPhone = '+7 (' + phone.slice(0, 3) + ') ' + phone.slice(3, 6) +
    '-' + phone.slice(6, 8) + '-' + phone.slice(8);
    if (phoneBook[phone].email !== '') {
        return (phoneBook[phone].name + ', ' + fixPhone + ', ' + phoneBook[phone].email);
    }

    return (phoneBook[phone].name + ', ' + fixPhone);
}

function findMatching(query, formatArray) {
    for (let i = 0; i < Object.keys(phoneBook).length; i++) {
        if (Object.keys(phoneBook)[i].includes(query) ||
        phoneBook[Object.keys(phoneBook)[i]].name.includes(query) ||
        phoneBook[Object.keys(phoneBook)[i]].email.includes(query)) {
            formatArray.push(rewriteInString(Object.keys(phoneBook)[i]));
        }
    }

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
