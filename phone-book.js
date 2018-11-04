'use strict';

/**
 * Сделано задание на звездочку
 * Реализован метод importFromCsv
 */
const isStar = false;

/**
 * Телефонная книга
 */
const phoneBook = [];
const phoneRegExp = /^\d{10}$/;

function isCorrectPhone(phone) {
    return typeof phone === 'string' && phoneRegExp.test(phone);
}

function isCorrectName(name) {
    return typeof name === 'string' && name.trim() !== '';
}

function isCorrectEmail(email) {
    return typeof email === 'string' || email === undefined;
}

function isCorrectQuery(query) {
    return typeof(query) === 'string' && query;
}

function isCorrectRecord(phone, name, email) {
    return isCorrectPhone(phone) && isCorrectName(name) && isCorrectEmail(email);
}

function containsQuery(field, query) {
    return query === '*' || (field && field.includes(query));
}

function hasRecord(phoneRecord) {
    return phoneBook.some(element => element.phone === phoneRecord.phone);
}

/**
 * Добавление записи в телефонную книгу
 * @param {String} phone
 * @param {String?} name
 * @param {String?} email
 * @returns {Boolean}
 */
function add(phone, name, email) {
    if (!isCorrectRecord(phone, name, email)) {
        return false;
    }
    const phoneRecord = { phone: phone, name: name, email: email };

    if (hasRecord(phoneRecord)) {
        return false;
    }
    phoneBook.push(phoneRecord);

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
    if (!isCorrectRecord(phone, name, email)) {
        return false;
    }
    const newPhoneRecord = { phone: phone, name: name, email: email };

    if (!hasRecord(newPhoneRecord)) {
        return false;
    }
    const index = phoneBook.findIndex(element => element.phone === phone);

    phoneBook[index] = newPhoneRecord;

    return true;
}

/**
 * Удаление записей по запросу из телефонной книги
 * @param {String} query
 * @returns {Number}
 */
// need fix
function findAndRemove(query) {
    if (!isCorrectQuery(query)) {
        return [];
    }
    const foundRecords = find(query);
    for (let i = 0; i < foundRecords.length; i++) {
        const splited = foundRecords[i].split(', ');
        const phoneRecord = { phone: splited[0], name: splited[1], email: splited[2] };
        phoneBook.splice(phoneBook.indexOf(phoneRecord) - 1, 1);
    }

    return foundRecords.length;
}

function formatPhone(phone) {
    return '+7 ('
        .concat(phone.slice(0, 3))
        .concat(') ')
        .concat(phone.slice(3, 6))
        .concat('-')
        .concat(phone.slice(6, 8))
        .concat('-')
        .concat(phone.slice(8, 10));
}

function formatRecord(phone, name, email) {
    let result;

    if (email) {
        result = [name, phone, email].join(', ');
    } else {
        result = [name, phone].join(', ');
    }

    return result;
}

/**
 * Поиск записей по запросу в телефонной книге
 * @param {String} query
 * @returns {String[]}
 */
function find(query) {
    if (!isCorrectQuery(query)) {
        return [];
    }
    const result = [];
    for (let i = 0; i < phoneBook.length; i++) {
        const newPhone = formatPhone(phoneBook[i].phone);
        const record = [phoneBook[i].phone, phoneBook[i].name, phoneBook[i].email];
        if (record.some(field => containsQuery(field, query))) {
            result.push(formatRecord(newPhone, phoneBook[i].name, phoneBook[i].email));
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
