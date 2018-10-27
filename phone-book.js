'use strict';

/**
 * Сделано задание на звездочку
 * Реализован метод importFromCsv
 */
const isStar = true;

function checkPhone(phone) {
    var re = /^\d{10}$/;

    return re.test(phone);
}

function checkName(name) {
    return name && name.length > 0;
}

function sortPhoneBook(a, b) {
    return a[0] > b[0];
}

function phoneFormat(phone) {
    return '+7 (' + phone.slice(0, 3) + ') ' +
        phone.slice(3, 6) + '-' + phone.slice(6, 8) +
        '-' + phone.slice(8, 10);
}

function recordFormat(key, record) {
    var result = '';
    result += record.name;
    result += ', ';
    result += phoneFormat(key);
    if (record.email) {
        result += ', ';
        result += record.email;
    }

    return result;
}

/**
 * Телефонная книга
 */
let phoneBook = new Map();

/**
 * Добавление записи в телефонную книгу
 * @param {String} phone
 * @param {String?} name
 * @param {String?} email
 * @returns {Boolean}
 */
function add(phone, name, email = '') {
    if (checkPhone(phone) &&
        !phoneBook.has(phone) &&
        checkName(name)) {
        phoneBook.set(phone, { name: name, email: email });

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
function update(phone, name, email = '') {
    if (phoneBook.has(phone) && checkName(name)) {
        phoneBook.set(phone, { name: name, email: email });

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
    var keys = findKeys(query);
    for (var i = 0; i < keys.length; i++) {
        phoneBook.delete(keys[i]);
    }

    return keys.length;
}

function checkQuery(query, key) {
    return query === '*' ||
        key.indexOf(query) !== -1 ||
        (phoneBook.get(key).name && phoneBook.get(key).name.indexOf(query) !== -1) ||
        (phoneBook.get(key).email && phoneBook.get(key).email.indexOf(query) !== -1);
}

function findKeys(query) {
    var result = [];
    if (!query || query.length === 0) {
        return result;
    }
    var keys = phoneBook.keys();
    for (let key of keys) {
        if (checkQuery(query, key)) {
            result.push(key);
        }
    }

    return result.sort(sortPhoneBook);
}

/**
 * Поиск записей по запросу в телефонной книге
 * @param {String} query
 * @returns {String[]}
 */
function find(query) {
    var result = [];
    var keys = findKeys(query);
    for (var i = 0; i < keys.length; i++) {
        var key = keys[i];
        result.push(recordFormat(key, phoneBook.get(key)));
    }

    return result.sort(sortPhoneBook);
}

function parseCsv(record) {
    var parse = record.split(';');
    if (parse.length < 2) {
        return null;
    }

    var result = { name: parse[0], phone: parse[1] };

    if (parse.length >= 3) {
        result.email = parse[2];
    }

    return result;
}

function addOrUpdate(record) {
    if (!phoneBook.has(record.phone)) {
        return add(record.phone, record.name, record.email);
    }

    return update(record.phone, record.name, record.email);
}

/**
 * Импорт записей из csv-формата
 * @star
 * @param {String} csv
 * @returns {Number} – количество добавленных и обновленных записей
 */
function importFromCsv(csv) {
    var countAdded = 0;
    var records = csv.split('\n');

    for (var i = 0; i < records.length; i++) {
        var e = records[i];
        var record = parseCsv(e);
        if (!record) {
            continue;
        }
        if (addOrUpdate(record)) {
            countAdded++;
        }
    }

    return countAdded;
}

module.exports = {
    add,
    update,
    findAndRemove,
    find,
    importFromCsv,

    isStar
};
