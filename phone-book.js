'use strict';

/**
 * Сделано задание на звездочку
 * Реализован метод importFromCsv
 */
const isStar = true;

/**
 * Телефонная книга
 */
const phoneBook = new Map();

function basicChecks(phone, name) {
    const numberCheck = (/^\d{10}$/);
    if (typeof(phone) === 'string' &&
        typeof(name) === 'string' &&
        name.length > 0 &&
        numberCheck.test(phone)) {

        return true;
    }
}

function convertMapToArray() {
    const ArrayphoneBook = [];
    for (let [key, [value1, value2]] of phoneBook) {
        ArrayphoneBook.push([key, value1, value2]);
    }

    return ArrayphoneBook;
}

function phoneFind(query) {
    if (query.length === 0 || query === undefined) {
        return [];
    }
    const ArrayPhoneBook = convertMapToArray();
    if (query === '*') {
        return ArrayPhoneBook;
    }
    const filtered = ArrayPhoneBook.filter((input) => {
        return input[0].includes(query) ||
        input[1].includes(query) ||
        input[2] !== undefined && input[2].includes(query);
    });

    return filtered;
}

function phoneFormat(phone) {
    return '+7 (' + phone.substr(0, 3) + ') ' +
    phone.substr(3, 3) + '-' + phone.substr(6, 2) + '-' + phone.substr(8, 2);
}

/**
 * Добавление записи в телефонную книгу
 * @param {String} phone
 * @param {String?} name
 * @param {String?} email
 * @returns {Boolean}
 */
function add(phone, name, email) {
    if (email !== undefined) {
        email = String(email);
    }

    if (basicChecks(phone, name) && !phoneBook.has(phone)) {
        phoneBook.set(phone, [name, email]);

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
    if (email !== undefined) {
        email = String(email);
    }

    if (basicChecks(phone, name)) {
        phoneBook.set(phone, [name, email]);

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
    const numberOfRemote = phoneFind(query).length;
    const data = phoneFind(query);
    for (let i = 0; i < numberOfRemote; i++) {
        phoneBook.delete(data[i][0]);
    }

    return numberOfRemote;
}

/**
 * Поиск записей по запросу в телефонной книге
 * @param {String} query
 * @returns {String[]}
 */
function find(query) {
    query = String(query);
    const editedData = [];
    const data = phoneFind(query);
    for (let i = 0; i < data.length; i++) {
        if (data[i][2] === undefined) {
            editedData.push(data[i][1] + ', ' + phoneFormat(data[i][0]));
        } else {
            editedData.push(data[i][1] + ', ' + phoneFormat(data[i][0]) + ', ' + data[i][2]);
        }
    }

    return editedData.sort();
}

/**
 * Импорт записей из csv-формата
 * @star
 * @param {String} csv
 * @returns {Number} – количество добавленных и обновленных записей
 */

function importFromCsv(csv) {
    let total = 0;
    for (let data of csv.split('\n')) {
        data = data.split(';');
        if (add(data[1], data[0], data[2]) || update(data[1], data[0], data[2])) {
            total++;
        }
    }

    return total;
}

module.exports = {
    basicChecks,
    convertMapToArray,
    phoneFind,
    phoneFormat,
    add,
    update,
    findAndRemove,
    find,
    importFromCsv,

    isStar
};
