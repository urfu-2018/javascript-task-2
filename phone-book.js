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
    const correctInput = !phoneBook.has(phone) && checkPhone(phone) && checkName(name);
    if (correctInput) {
        phoneBook.set(phone, { name: name, email: email });
    }

    return correctInput;
}

/**
 * Обновление записи в телефонной книге
 * @param {String} phone
 * @param {String?} name
 * @param {String?} email
 * @returns {Boolean}
 */
function update(phone, name, email) {
    const correctInput = phoneBook.has(phone) && checkPhone(phone) && checkName(name);
    if (correctInput) {
        phoneBook.set(phone, { name: name, email: email });
    }

    return correctInput;
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
    let count = 0;
    for (let [key, value] of phoneBook) {
        if (gotIt(key, value, query)) {
            count++;
            phoneBook.delete(key);
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
    if (query === '') {
        return [];
    }
    let array = [];
    for (let [key, value] of phoneBook) {
        if (gotIt(key, value, query)) {
            array.push({ phone: key, name: value.name, email: value.email });
        }
    }

    return array.sort((a, b) => a.name.localeCompare(b.name)).map(formatRecord);
}

function gotIt(key, value, query) {
    if (query === '*') {
        return true;
    }
    let email = value.email || '';

    return key.includes(query) || value.name.includes(query) || email.includes(query);
}

function formatRecord({ name, email, phone }) {
    let result = `${name}, ${format(phone)}`;
    if (typeof email !== 'undefined') {
        result += `, ${email}`;
    }

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
    let records = csv.split('\n');
    for (let i = 0; i < records.length; i++) {
        const record = records[i].split(';');
        if (add(record[1], record[0], record[2]) || update(record[1], record[0], record[2])) {
            count++;
        }
    }

    return count;
}

function checkPhone(phone) {
    return typeof phone === 'string' && /^\d{10}$/.test(phone);
}
function checkName(name) {
    return typeof name === 'string' && name !== '';
}
function format(phone) {
    var part = `+7 (${phone.slice(0, 3)}) ${phone.slice(3, 6)}`;

    return part + `-${phone.slice(6, 8)}-${phone.slice(8)}`;
}
module.exports = {
    add,
    update,
    findAndRemove,
    find,
    importFromCsv,

    isStar
};
