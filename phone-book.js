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

function checkIncludingOfQueryInEmail(email, query) {
    return typeof email !== 'undefined' && email.includes(query);
}

function chechIncludingOfQueryInRecord(phone, record, query) {
    const anySymbol = '*';

    return query === anySymbol ||
            record.name.includes(query) ||
            checkIncludingOfQueryInEmail(record.email, query) ||
            phone.includes(query);
}

function checkNameAndPhone(name, phone) {
    return !isNameCorrect(name) || !isPhoneCorrect(phone);
}

function isNameCorrect(name) {
    return typeof name === 'string' && name !== '';
}

function isPhoneCorrect(phone) {
    if (typeof phone !== 'string' || phone === '') {
        return false;
    }

    const phonePattern = new RegExp(/^\d{10}$/);

    return phonePattern.test(phone);
}

/**
 * Парсинг csv строки. Приведение этой строки к массиву вида [phone, name, email]
 * @param {String} csvStrings
 * @returns {Any[]}
 */
function parseCsv(csvStrings) {
    return csvStrings
        .split('\n')
        .map(csvString => {
            const splittedString = csvString.split(';');

            return { phone: splittedString[1], name: splittedString[0], email: splittedString[2] };
        });
}

/**
 * Добавление записи в телефонную книгу
 * @param {String} phone
 * @param {String?} name
 * @param {String?} email
 * @returns {Boolean}
 */
function add(phone, name, email) {
    if (checkNameAndPhone(name, phone) || phoneBook.has(phone)) {

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
    if (checkNameAndPhone(name, phone) || !phoneBook.has(phone)) {

        return false;
    }
    phoneBook.set(phone, { name, email });

    return true;
}

/**
 * Конвертация номера из формата хххххххххх -> +7 (xxx) xxx-xx-xx
 * @param {String} phone
 * @returns {String}
 */
function convertPhoneToNormalFormat(phone) {
    return `+7 (${phone.slice(0, 3)}) ${phone.slice(3, 6)}-${phone.slice(6, 8)}-${phone.slice(8)}`;
}

/**
 * Поиск массива записей по запросу в телефонной книге
 * @param {String} query
 * @returns {Any[]}
 */
function search(query) {
    const result = [];
    phoneBook.forEach((record, phone) => {
        if (chechIncludingOfQueryInRecord(phone, record, query)) {
            result.push({ name: record.name, phone: phone, email: record.email });
        }
    });

    return result;
}

/**
 * Удаление записей по запросу из телефонной книги
 * @param {String} query
 * @returns {Number}
 */
function findAndRemove(query) {
    if (typeof query !== 'string' || !query) {
        return 0;
    }

    const foundRecords = search(query);
    foundRecords.forEach(record => {
        phoneBook.delete(record.phone);
    });

    return foundRecords.length;
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

    const foundRecords = search(query);
    foundRecords.sort((firstRecord, secondRecord) => {
        return firstRecord.name.localeCompare(secondRecord.name);
    });

    return foundRecords.map(record => {
        if (typeof record.email === 'undefined') {
            return `${record.name}, ${convertPhoneToNormalFormat(record.phone)}`;
        }

        return `${record.name}, ${convertPhoneToNormalFormat(record.phone)}, ${record.email}`;
    });
}

/**
 * Импорт записей из csv-формата
 * @star
 * @param {String} csv
 * @returns {Number} – количество добавленных и обновленных записей
 */
function importFromCsv(csv) {
    if (!csv) {

        return 0;
    }
    const parsedCsv = parseCsv(csv);

    return parsedCsv.reduce((acc, record) => {
        if (update(record.phone, record.name, record.email) ||
            add(record.phone, record.name, record.email)) {
            acc++;
        }

        return acc;
    }, 0);
}

module.exports = {
    add,
    update,
    findAndRemove,
    find,
    importFromCsv,

    isStar
};
