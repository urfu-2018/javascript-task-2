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

function isNameCorrect(name) {
    if (typeof (name) !== 'string' || name === '') {
        return false;
    }

    return true;
}

function isPhoneCorrect(phone) {
    if (typeof (phone) !== 'string' || phone === '') {
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

    return csvStrings.split('\n').map(csvString => {
        const splittedString = csvString.split(';');

        return [splittedString[1], splittedString[0], splittedString[2]];
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
    if (!isNameCorrect(name) || !isPhoneCorrect(phone) || phoneBook.has(phone)) {

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
    if (!isNameCorrect(name) || !isPhoneCorrect(phone) || !phoneBook.has(phone)) {

        return false;
    }
    if (typeof (email) === 'undefined') {
        email = '';
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
    const resultBook = [];

    phoneBook.forEach((value, phone) => {
        if (query === '*' ||
            value.name.includes(query) ||
            value.email.includes(query) ||
            phone.includes(query)) {
            resultBook.push([value.name, phone, value.email]);
        }
    });

    return resultBook;
}

/**
 * Удаление записей по запросу из телефонной книги
 * @param {String} query
 * @returns {Number}
 */
function findAndRemove(query) {
    if (typeof(query) !== 'string' || query === '') {
        return 0;
    }

    const foundRecords = search(query);
    foundRecords.forEach(record => {
        phoneBook.delete(record[1]);
    });

    return foundRecords.length;
}

/**
 * Поиск записей по запросу в телефонной книге
 * @param {String} query
 * @returns {String[]}
 */
function find(query) {
    if (typeof (query) !== 'string' || query.length === 0) {
        return [];
    }

    const foundRecords = search(query);
    foundRecords.sort((firstElement, secondElement) => {
        return firstElement[0] > secondElement[0];
    });

    return foundRecords.map(record => {
        if (record[2] === '') {
            return `${record[0]}, ${convertPhoneToNormalFormat(record[1])}`;
        }

        return `${record[0]}, ${convertPhoneToNormalFormat(record[1])}, ${record[2]}`;
    });
}

/**
 * Импорт записей из csv-формата
 * @star
 * @param {String} csv
 * @returns {Number} – количество добавленных и обновленных записей
 */
function importFromCsv(csv) {
    const parsedCsv = parseCsv(csv);

    return parsedCsv.reduce((acc, record) => {
        if (update(record[0], record[1], record[2]) || add(record[0], record[1], record[2])) {
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
