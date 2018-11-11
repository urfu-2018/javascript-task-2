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
 * Проверка параметров
 * @param {String} phone
 * @param {String?} name
 * @param {String?} email
 * @returns {Boolean}
 */
function isValidParams(phone, name) {
    var tel = /(^[0-9]{10}$)/;

    return phone && tel.test(phone) &&
        name && typeof name === 'string';
}

/**
 * Добавление записи в телефонную книгу
 * @param {String} phone
 * @param {String?} name
 * @param {String?} email
 * @returns {Boolean}
 */
function add(phone, name, email) {
    if (!(phone in phoneBook) && isValidParams(phone, name, email)) {
        if (!email || email === '') {
            phoneBook[phone] = [phone, name];
        } else {
            phoneBook[phone] = [phone, name, email];
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
    if (phoneBook[phone] && isValidParams(phone, name, email)) {
        if (!email || email === '') {
            phoneBook[phone] = [phone, name];
        } else {
            phoneBook[phone] = [phone, name, email];
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
    if (query === '') {
        return 0;
    }
    let res;
    let count = 0;
    for (const phone of Object.keys(phoneBook)) {
        res = matchSearch(phoneBook[phone], query);
        if (res) {
            delete phoneBook[phone];
            count++;
        }
    }

    return count;
}

function matchSearch(record, query) {
    if (query === '*') {
        return record;
    }
    if (record[0].includes(query) === true || record[1].includes(query) === true ||
        (record[2] && record[2].includes(query) === true)) {

        return record;
    }
}

/**
 * Поиск записей по запросу в телефонной книге
 * @param {String} query
 * @returns {String[]}
 */
function find(query) {
    if (query === '' || typeof (query) !== 'string') {
        return [];
    }
    const result = [];
    let res;
    for (var phone of Object.keys(phoneBook)) {
        if (!phoneBook[phone]) {
            return [];
        }
        res = matchSearch(phoneBook[phone], query);
        if (res) {
            result.push(res);
        }
    }
    var record;
    record = view(result);

    return record.sort();
}

function newNumber(phone) {
    return `+7 (${phone.slice(0, 3)}) ${phone.slice(3, 6)}-${phone.slice(6, 8)}-${phone.slice(8)}`;
}

function view(result) {
    const recordSought = [];
    for (let info of result) {
        if (!info) {
            return [];
        }
        if (info[2]) {
            recordSought.push(info[1] + ', ' + newNumber(info[0]) + ', ' + info[2]);
        } else {
            recordSought.push(info[1] + ', ' + newNumber(info[0]));
        }
    }

    return recordSought;
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
    if (!csv || csv === '') {
        return 0;
    }
    const newCsv = csv.split('\n');
    let count = 0;
    for (let line of newCsv) {
        let contact = line.split(';');
        var phone = contact[1];
        var name = contact[0];
        var email = contact[2];
        if (add(phone, name, email) || update(phone, name, email)) {
            count++;
        }
    }

    return count;
}

module.exports = {
    add,
    update,
    findAndRemove,
    find,
    importFromCsv,

    isStar
};
