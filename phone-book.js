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
 * Добавление записи в телефонную книгу
 * @param {String} phone
 * @param {String?} name
 * @param {String?} email
 * @returns {Boolean}
 */
function add(phone, name, email) {
    if (!name || !/^\d{10}$/.test(phone) || phoneBook[phone]) {
        return false;
    }
    phoneBook[phone] = { name: name, email: email };

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
    if (!name || !/^\d{10}$/.test(phone) || !phoneBook[phone]) {
        return false;
    }
    phoneBook[phone] = { name: name, email: email };

    return true;
}

/**
 * Удаление записей по запросу из телефонной книги
 * @param {String} query
 * @returns {Number}
 */
function findAndRemove(query) {
    let foundKeys = findKeys(query);
    foundKeys.forEach(element => {
        delete(phoneBook[element]);
    });

    return foundKeys.length;
}

/**
 * Поиск записей по запросу в телефонной книге
 * @param {String} query
 * @returns {String[]}
 */
function find(query) {
    if (query === '' || query === undefined) {
        return [];
    }
    let foundKeys = sortByName(findKeys(query));

    return formatRecords(foundKeys);
}

function findKeys(query) {
    let foundKeys = Object.keys(phoneBook);
    if (query === '*') {
        return foundKeys;
    }

    return foundKeys.filter(phone => {
        return `${phone} ${phoneBook[phone].name} ${phoneBook[phone].email}`.includes(query);
    });
}

function sortByName(records) {
    return records.sort((a, b) => phoneBook[a].name > phoneBook[b].name);
}

function formatRecords(records) {
    return records.map(phone => {
        let email = phoneBook[phone].email ? ', ' + phoneBook[phone].email : '';

        return phoneBook[phone].name +
        ', +7 (' + phone.slice(0, 3) + ') ' + phone.slice(3, 6) +
        '-' + phone.slice(6, 8) + '-' + phone.slice(8, 10) +
        email;
    });
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

    let records = csv.split('\n');
    let modifiedRecords = 0;
    records.forEach(record => {
        let phone = record.split(';')[1].replace(/\D/);
        let name = record.split(';')[0];
        let email = record.split(';')[2];
        if (add(phone, name, email) || update(phone, name, email)) {
            modifiedRecords++;
        }
    });

    return modifiedRecords;
}

module.exports = {
    add,
    update,
    findAndRemove,
    find,
    importFromCsv,

    isStar
};
