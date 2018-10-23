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

function isCorrectedName(name) {
    if (typeof name === 'string' && name.length !== 0) {
        return true;
    }

    return false;
}

function isCorrectedPhone(phone) {
    if (typeof phone === 'string' && /^[0-9]{10}$/.test(phone)) {
        return true;
    }

    return false;
}

/**
 * Добавление записи в телефонную книгу
 * @param {String} phone
 * @param {String?} name
 * @param {String?} email
 * @returns {Boolean}
 */
function add(phone, name, email) {
    if (!isCorrectedPhone(phone) || !isCorrectedName(name)) {
        return false;
    }
    if (typeof email !== 'undefined' && typeof email !== 'string') {
        // Можно ли принимать email = ''?
        return false;
    }
    if (typeof phoneBook[phone] !== 'undefined') {
        return false;
    }
    phoneBook[phone] = [name, email];

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
    if (!isCorrectedName(name) || !isCorrectedPhone(phone)) {
        return false;
    }
    if (typeof email !== 'undefined' && typeof email !== 'string') {
        return false;
    }
    if (typeof phoneBook[phone] === 'undefined') {
        return false;
    }
    phoneBook[phone] = [name, email];

    return true;
}

/**
 * Удаление записей по запросу из телефонной книги
 * @param {String} query
 * @returns {Number}
 */
function findAndRemove(query) {
    let removes = find(query);
    if (removes.length === 0) {
        return 0;
    }
    let records = [];
    for (let p of removes) {
        let str = p.split(', ');
        str[1] = str[1].substring(4, 7) + str[1].substring(9, 12) +
            str[1].substring(13, 15) + str[1].substring(16, 19);
        records[str[1]] = [str[0], str[2]];
    }
    let count = 0;
    for (let key of Object.keys(records)) {
        if (phoneBook[key] !== undefined) {
            phoneBook[key] = undefined;
            count++;
        }
    }

    return count;
}

/**
 * Поиск записей по запросу в телефонной книге
 * @param {String} query
 * @returns {String[]}
 */

function find(query) {
    let bookRecords = [];
    if (typeof query !== 'string' || query.length === 0) {
        return [];
    }
    if (query === '*') {
        return give(phoneBook);
    }
    bookRecords = existInBook(query);

    return give(bookRecords);
}

//  Проверка на существование записей в книге
function existInBook(query) {
    let result = [];
    for (let key of Object.keys(phoneBook)) {
        if (key.indexOf(query) !== -1 || phoneBook[key][0].indexOf(query) !== -1) {
            result[key] = [phoneBook[key][0], phoneBook[key][1]];
            continue;
        }
        if (typeof phoneBook[key][1] !== 'undefined' && phoneBook[key][1].indexOf(query !== -1)) {
            result[key] = [phoneBook[key][0], phoneBook[key][1]];
        }
    }
    result.sort();

    return result;
}
//  Получение записей из книги
function give(records) {
    let result = [];
    for (let key of Object.keys(records)) {
        let record = records[key][0] + ', +7 (' + key.substring(0, 3) + ') ' + key.substring(3, 6) +
        '-' + key.substring(6, 8) + '-' + key.substring(8, 10) + ', ' + records[key][1];
        if (typeof records[key][1] === 'undefined') {
            record = record.slice(0, record.length - 11);
        }
        result.push(record);
    }
    result.sort();

    return result;
}

/**
 * Импорт записей из csv-формата
 * @star
 * @param {String} csv
 * @returns {Number} – количество добавленных и обновленных записей
 */
function importFromCsv(csv) {
    let count = 0;
    if (typeof csv !== 'string' || csv.length === 0) {
        return count;
    }
    let str = csv.split('\n');
    let preResult = [];
    let phone;
    let name;
    let email;
    for (let p = 0; p < str.length; p++) {
        preResult[p] = str[p].split(';');
        phone = preResult[p][1];
        name = preResult[p][0];
        email = preResult[p][2];
        count += addOrUpdateBook(phone, name, email);
    }

    return count;
}
//  Попытки обновить запись или же добавить с подсчётом успешных операций
function addOrUpdateBook(phone, name, email) {
    if (update(phone, name, email)) {
        return 1;
    }
    if (add(phone, name, email)) {
        return 1;
    }

    return 0;
}

module.exports = {
    add,
    update,
    findAndRemove,
    find,
    importFromCsv,

    isStar
};
