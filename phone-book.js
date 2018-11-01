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

function isCorrectRecord(phone, name) {
    return (/^\d{10}$/.test(phone) && typeof(name) === 'string' &&
            name !== undefined && name !== null && name !== '');
}

/**
 * Добавление записи в телефонную книгу
 * @param {String} phone
 * @param {String?} name
 * @param {String?} email
 * @returns {Boolean}
 */
function add(phone, name, email) {
    if (!isCorrectRecord(phone, name) || phoneBook.has(phone)) {
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
    if (!isCorrectRecord(phone, name) || !phoneBook.has(phone)) {
        return false;
    }

    phoneBook.set(phone, { name, email });

    return true;
}

function findRecordsByQuery(query) {
    if (query === '') {
        return [];
    }

    const neededRecords = [];
    phoneBook.forEach(function ({ name, email }, phone) {
        if (query === '*' || phone.includes(query) || name.includes(query) ||
        (email !== undefined && email.includes(query))) {
            neededRecords.push({ phone, name, email });
        }
    });

    return neededRecords;
}

/**
 * Удаление записей по запросу из телефонной книги
 * @param {String} query
 * @returns {Number}
 */
function findAndRemove(query) {
    const neededRecords = findRecordsByQuery(query);
    neededRecords.forEach(function (record) {
        phoneBook.delete(record.phone);
    });

    return neededRecords.length;
}

function createRecord(name, phone, email) {
    const phoneString = `+7 (${phone.slice(0, 3)}) \
${phone.slice(3, 6)}-${phone.slice(6, 8)}-${phone.slice(8, 10)}`;

    const record = [name, phoneString];
    if (email !== undefined) {
        record.push(email);
    }

    return record.join(', ');
}

/**
 * Поиск записей по запросу в телефонной книге
 * @param {String} query
 * @returns {String[]}
 */
function find(query) {
    return findRecordsByQuery(query)
        .map(function (record) {
            return createRecord(record.name, record.phone, record.email);
        })
        .sort();
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
    records.forEach(function (record) {
        const [name, phone, email] = record.split(';');
        if (add(phone, name, email) || update(phone, name, email)) {
            goodRecordsCount++;
        }
    });

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
