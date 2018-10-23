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

function createEntry(name, email) {
    let entry = {};
    entry.name = name;
    entry.email = email;

    return entry;
}

/**
 * Добавление записи в телефонную книгу
 * @param {String} phone
 * @param {String?} name
 * @param {String?} email
 * @returns {Boolean}
 */
function add(phone, name, email) {
    if (!/^\d{10}$/.test(phone) || !name || phoneBook[phone]) {
        return false;
    }
    phoneBook[phone] = createEntry(name, email);

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
    if (!name || !phoneBook[phone]) {
        return false;
    }
    if (name !== undefined && name !== '') {
        phoneBook[phone] = createEntry(name, email);

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
        const keys = Object.keys(phoneBook);
        phoneBook = {};

        return keys.length;
    }

    var results = findByAllFields(takeAllEntries(), query);

    results.forEach(result => {
        delete phoneBook[result.phone];
    });

    return results.length;
}

var compareEntry = function (a, b) {
    return a.name > b.name;
};

function createFindResult(array) {
    return array.sort(compareEntry).map(x => {
        let correctPhone = getCorrectPhone(x.phone);

        return x.email
            ? `${x.name}, ${correctPhone}, ${x.email}`
            : `${x.name}, ${correctPhone}`;
    });
}

function createFindEntry(phone, name, email) {
    let entry = {};
    entry.name = name;
    entry.email = email;
    entry.phone = phone;

    return entry;
}

function getCorrectPhone(phone) {
    var phone1 = phone.substring(0, 3);
    var phone2 = phone.substring(3, 6);
    var phone3 = phone.substring(6, 8);
    var phone4 = phone.substring(8, 10);

    return `+7 (${phone1}) ${phone2}-${phone3}-${phone4}`;
}

function findByAllFields(entries, query) {
    if (query === undefined || query === '') {
        return [];
    }

    return entries.filter(entry => {
        return entry.name.includes(query) ||
            entry.phone.includes(query) ||
            (entry.email && entry.email.includes(query));
    });
}

function takeAllEntries() {
    var entries = [];
    let keys = Object.keys(phoneBook);
    keys.forEach(key => {
        let value = phoneBook[key];
        entries.push(createFindEntry(key, value.name, value.email));
    });

    return entries;
}

/**
 * Поиск записей по запросу в телефонной книге
 * @param {String} query
 * @returns {String[]}
 */
function find(query) {
    var entries = takeAllEntries();

    if (query === '*') {
        return createFindResult(entries);
    }

    return createFindResult(findByAllFields(entries, query));
}

/**
 * Импорт записей из csv-формата
 * @star
 * @param {String} csv
 * @returns {Number} – количество добавленных и обновленных записей
 */
function importFromCsv(csv) {
    let newEntries = csv.split('\n');

    let count = 0;
    newEntries.forEach(entry => {
        let r = entry.split(';');
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
