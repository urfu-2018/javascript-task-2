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
function trueParam(phone, name) {
    var tel = /(^[0-9]{10}$)/;

    return (typeof phone === 'string') && (tel.test(phone)) && (name !== '') &&
        (name !== undefined) && (typeof name === 'string');
}

/**
 * Добавление записи в телефонную книгу
 * @param {String} phone
 * @param {String?} name
 * @param {String?} email
 * @returns {Boolean}
 */

function add(phone, name, email) {
    if (phoneBook[phone] || !trueParam(phone, name, email)) {
        return false;
    }
    if (email === undefined) {
        phoneBook[phone] = [phone, name];
    } else {
        phoneBook[phone] = [phone, name, email];
    }

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
    if (phoneBook[phone] || !trueParam(phone, name, email)) {
        if (email === undefined) {
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
    var res;
    var count = 0;
    for (var phone of Object.keys(phoneBook)) {
        res = matchSearch(phoneBook[phone], query);
        if (res !== undefined) {
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
    if (record[0].indexOf(query) !== -1 || record[1].indexOf(query) !== -1 ||
        (record[2] && record[2].indexOf(query) !== -1)) {

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
    var res;
    for (var phone of Object.keys(phoneBook)) {
        if (phoneBook[phone] === undefined) {
            return [];
        }
        res = matchSearch(phoneBook[phone], query);
        if (res !== undefined) {
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
    var recordSought = [];
    for (let info of result) {
        if (info === undefined) {
            return [];
        }
        if (info[2] !== undefined) {
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
    if (csv === undefined || csv === '') {
        return 0;
    }
    const newCsv = csv.split('\n');
    var count = 0;
    for (var i = 0; i < newCsv.length; i++) {
        var text = newCsv[i].split(';');
        var name = text[0];
        var phone = text[1];
        var email = text[2];
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
