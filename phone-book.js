'use strict';

/**
 * Сделано задание на звездочку
 * Реализован метод importFromCsv
 */
const isStar = false;

/**
 * Телефонная книга
 */
var phoneBook = new Map();

/**
 * Добавление записи в телефонную книгу
 * @param {String} phone
 * @param {String?} name
 * @param {String?} email
 * @returns {Boolean}
 */
function add(phone, name, email) {
    if (typeof (email) === 'undefined') {
        email = '';
    }
    if (areCorrectInputs(phone, name, email) && !(phoneBook.has(phone))) {
        phoneBook.set(phone, [name, email]);

        return true;
    }

    return false;
}

function areCorrectInputs(phone, name, email) {
    const phoneValid = /^[0-9]{10}$/.test(phone);
    const nameValid = typeof (name) === 'string' && name !== '';
    const emailValid = typeof (email) === 'string';

    return phoneValid && nameValid && emailValid;
}

/**
 * Обновление записи в телефонной книге
 * @param {String} phone
 * @param {String?} name
 * @param {String?} email
 * @returns {Boolean}
 */
function update(phone, name, email) {
    if (typeof (email) === 'undefined') {
        email = '';
    }
    if (!areCorrectInputs(phone, name, email)) {
        return false;
    }
    for (var key of phoneBook.keys()) {
        if (key === phone) {
            phoneBook.set(phone, [name, email]);

            return true;
        }
    }

    return false;
}

/**
 * Удаление записей по запросу из телефонной книги
 * @param {String} query
 * @returns {Number}
 */
function findAndRemove(query) {
    if (typeof (query) !== 'string') {
        return false;
    }
    if (query === '*') {
        return phoneBook.length;
    }
    var convertedMap = сonvertMapToArray();
    var keys = getKeys(phoneBook);
    var removedCount = 0;
    for (let i = 0; i < convertedMap.length; i++) {
        if (convertedMap[i].indexOf(query)) {
            phoneBook.delete(keys[i]);
            removedCount++;
        }
    }

    return removedCount - 1;
}

function getKeys(keysArray) {
    var keyArray = [];
    for (let key of keysArray.keys()) {
        keyArray.push(key);
    }

    return keyArray;
}

/**
 * Поиск записей по запросу в телефонной книге
 * @param {String} query
 * @returns {String[]}
 */
function find(query) {
    if (typeof (query) !== 'string') {
        return false;
    }
    var convertedMap = сonvertMapToArray();
    var result = [];
    for (let i = 0; i < convertedMap.length; i++) {
        if (convertedMap[i].indexOf(query) || query === '*') {
            result.push(convertedMap[i]);
        }
    }

    return result.sort();
}

function сonvertMapToArray() {
    let result = [];
    for (var [key, value] of phoneBook) {
        var truString = transformString(key, value[0], value[1]);
        result.push(truString);
    }

    return result;
}

function transformString(phone, name, email) {
    var changedEmail = '';
    if (email.length === 0) {
        email = changedEmail;
    } else {
        changedEmail = ', ' + email;
    }
    let changedPhone = '+7 (' + phone.slice(0, 3) + ') ' + phone.slice(3, 6) +
        '-' + phone.slice(6, 8) + '-' + phone.slice(8, 10);
    var changedName = name + ', ';

    return changedName + changedPhone + changedEmail;
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
