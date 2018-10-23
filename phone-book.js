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

function createRecord(name, email) {
    let record = {};
    record.name = name;
    record.email = email;

    return record;
}

var regexGoodPhone = /^\d{10}$/;

/**
 * Добавление записи в телефонную книгу
 * @param {String} phone
 * @param {String?} name
 * @param {String?} email
 * @returns {Boolean}
 */
function add(phone, name, email) {
    if (!name || phoneBook[phone] || !regexGoodPhone.test(phone)) {
        return false;
    }
    phoneBook[phone] = createRecord(name, email);

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
    if (!phoneBook[phone]) {
        return false;
    }
    if (name !== undefined && name !== '') {
        phoneBook[phone] = createRecord(name, email);

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
    if (query === '*') {
        let keys = Object.keys(phoneBook);
        phoneBook = {};

        return keys.length;
    }

    var result = findByAllFields(takeAllRecords(), query);

    result.forEach(x => {
        delete phoneBook[x.phone];
    });

    return result.length;
}

var compareRecord = function (a, b) {
    return a.name > b.name;
};

function createFindResult(array) {
    return array.sort(compareRecord).map(x => {
        let nicePhone = getNicePhone(x.phone);

        return x.email
            ? `${x.name}, ${nicePhone}, ${x.email}`
            : `${x.name}, ${nicePhone}`;
    });
}

function createFindRecord(phone, name, email) {
    let record = {};
    record.name = name;
    record.email = email;
    record.phone = phone;

    return record;
}

function getNicePhone(phone) {
    var part1 = phone.substring(0, 3);
    var part2 = phone.substring(3, 6);
    var part3 = phone.substring(6, 8);
    var part4 = phone.substring(8, 10);

    return `+7 (${part1}) ${part2}-${part3}-${part4}`;
}
function findByAllFields(records, query) {
    if (query === undefined || query === '') {
        return [];
    }

    return records.filter(record => {
        return record.name.includes(query) ||
            record.phone.includes(query) ||
            (record.email && record.email.includes(query));
    });
}

function takeAllRecords() {
    var records = [];
    let keys = Object.keys(phoneBook);
    for (let i = 0; i < keys.length; i++) {
        let value = phoneBook[keys[i]];
        records.push(createFindRecord(keys[i], value.name, value.email));
    }

    return records;
}

/**
 * Поиск записей по запросу в телефонной книге
 * @param {String} query
 * @returns {String[]}
 */
function find(query) {
    var records = takeAllRecords();

    if (query === '*') {
        return createFindResult(records);
    }

    return createFindResult(findByAllFields(records, query));
}

/**
 * Импорт записей из csv-формата
 * @star
 * @param {String} csv
 * @returns {Number} – количество добавленных и обновленных записей
 */
function importFromCsv(csv) {
    let newRecords = csv.split('\n');

    let count = 0;
    newRecords.forEach(record => {
        let r = record.split(';');
        if (phoneBook[r[1]]) {
            count += update(r[1], r[0], r[2]);
        } else {
            count += add(r[1], r[0], r[2]);
        }
    });

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
