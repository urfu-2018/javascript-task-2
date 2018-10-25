'use strict';

/**
 * Сделано задание на звездочку
 * Реализован метод importFromCsv
 */
const isStar = true;

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
function add(phone, name, email) {
    if (!/^\d{10}$/.test(phone) || phoneBook.has(phone) || name === undefined || name === '') {
        return false;
    }

    phoneBook.set(phone, { name, email });

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
    if (!phoneBook.has(phone) || name === undefined) {
        return false;
    }

    phoneBook.set(phone, { name, email });

    return true;
}

function checkQuery(query, phone, name, email) {
    if (query === '') {
        return false;
    }

    return query === '*' || phone.includes(query) || name.includes(query) ||
           email !== undefined && email.includes(query);
}

/**
 * Удаление записей по запросу из телефонной книги
 * @param {String} query
 * @returns {Number}
 */
function findAndRemove(query) {
    const badPhones = [];

    for (const [phone, { name, email }] of phoneBook) {
        if (checkQuery(query, phone, name, email)) {
            badPhones.push(phone);
        }
    }

    for (let i = 0; i < badPhones.length; i++) {
        phoneBook.delete(badPhones[i]);
    }

    return badPhones.length;
}

function createRecord(name, phone, email) {
    let record = name + ', +7 (' + phone.slice(0, 3) + ') ';
    record += phone.slice(3, 6) + '-' + phone.slice(6, 8) + '-' + phone.slice(8, 10);
    if (email !== undefined) {
        record += ', ' + email;
    }

    return record;
}

/**
 * Поиск записей по запросу в телефонной книге
 * @param {String} query
 * @returns {String[]}
 */
function find(query) {
    const result = [];

    for (const [phone, { name, email }] of phoneBook) {
        if (checkQuery(query, phone, name, email)) {
            result.push(createRecord(name, phone, email));
        }
    }

    return result.sort();
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

    const records = csv.split('\n');
    let goodRecordsCount = 0;
    for (let i = 0; i < records.length; i++) {
        const [name, phone, email] = records[i].split(';');
        if (add(phone, name, email) || update(phone, name, email)) {
            goodRecordsCount++;
        }
    }

    return goodRecordsCount;
}

module.exports = {
    add,
    update,
    findAndRemove,
    find,
    importFromCsv,

    isStar
};
