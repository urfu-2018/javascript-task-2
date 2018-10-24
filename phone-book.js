'use strict';

/**
 * Сделано задание на звездочку
 * Реализован метод importFromCsv
 */
const isStar = false;

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
    if (phoneBook.has(phone) || !isValidRecord(phone, name)) {
        return false;
    }

    if (!email) {
        phoneBook.set(phone, { name: name, phone: phone, email: '' });
    } else {
        phoneBook.set(phone, { name: name, phone: phone, email: email });
    }

    return true;
}

function isValidRecord(phone, name) {
    return phone && /^[0-9]{10}$/.test(phone) && isValidName(name);
}

function isValidName(name) {
    return name && typeof name === 'string' && name.length !== 0;
}

/**
 * Обновление записи в телефонной книге
 * @param {String} phone
 * @param {String?} name
 * @param {String?} email
 * @returns {Boolean}
 */
function update(phone, name, email) {
    if (!phoneBook.has(phone) && !isValidName(name)) {
        return false;
    }

    if (!email) {
        phoneBook.set(phone, { name: name, phone: phone, email: '' });
    } else {
        phoneBook.set(phone, { name: name, phone: phone, email: email });
    }

    return true;
}

/**
 * Удаление записей по запросу из телефонной книги
 * @param {String} query
 * @returns {Number}
 */
function findAndRemove(query) {

    if (!query) {
        return 0;
    }

    if (query === '*') {
        phoneBook.clear();
    }

    const res = Array.from(phoneBook.values()).filter(r => hasRecord(r, query));
    Array.from(res.map(p => p.phone)).forEach(p => phoneBook.delete(p));

    return res.length;
}

/**
 * Поиск записей по запросу в телефонной книге
 * @param {String} query
 * @returns {String[]}
 */
function find(query) {
    if (!query) {
        return [];
    }

    if (query === '*') {
        return Array.from(phoneBook.values())
            .map(r => formatRecord(r))
            .sort();
    }

    const result = Array.from(phoneBook.values()).filter(r => hasRecord(r, query));

    return result.map(r => formatRecord(r)).sort();
}

function hasRecord(record, query) {
    return record.name.includes(query) || record.phone.includes(query) ||
    record.email.includes(query);
}

function formatRecord(record) {
    if (!record.email) {
        return `${record.name}, ${formatNumber(record.phone)}`;
    }

    return `${record.name}, ${formatNumber(record.phone)}, ${record.email}`;
}

function formatNumber(phone) {
    const phoneNumber = `${phone.slice(3, 6)}-${phone.slice(6, 8)}-${phone.slice(8, 10)}`;

    return `+7 (${phone.slice(0, 3)}) ${phoneNumber}`;
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
