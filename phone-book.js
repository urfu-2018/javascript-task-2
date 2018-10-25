'use strict';

/**
 * Сделано задание на звездочку
 * Реализован метод importFromCsv
 */
const isStar = false;

/**
 * Телефонная книга
 */
let phoneBook = new Set();


const phoneReg = /^\d{10}$/;
const isString = arg => typeof(arg) === 'string';
const phoneIsSuitable = phone => phoneReg.test(phone);
const hasWrongValue = arg => arg === '' || typeof arg === 'undefined' || arg === null;
const argsTypesAreCorrect = (phone, name, email) =>
    isString(phone) && isString(name) && isString(email);

function replaceBadTypes(phone, name, email) {
    var args = [phone, name, email];

    return args.map((arg) => arg || '').map((arg) => arg.trim());
}


function telInPhoneBook(phone) {
    for (let element of phoneBook) {
        if (element.slice(0, 10) === phone) {
            return true;
        }
    }

    return false;
}

function areArgsCorrect(phone, name, email) {
    if (!argsTypesAreCorrect(phone, name, email)) {
        return false;
    }
    if (hasWrongValue(name)) {
        return false;
    }
    if (!phoneIsSuitable(phone)) {
        return false;
    }

    return true;
}

/**
 * Добавление записи в телефонную книгу
 * @param {String} phone
 * @param {String?} name
 * @param {String?} email
 * @returns {Boolean}
 */
function add(phone, name, email) {
    let result = replaceBadTypes(phone, name, email);
    phone = result[0];
    name = result[1];
    email = result[2];
    if (!areArgsCorrect(phone, name, email)) {
        return false;
    }
    if (telInPhoneBook(phone)) {
        return false;
    }
    phoneBook.add(`${phone}|${name}|${email}`);

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
    let result = replaceBadTypes(phone, name, email);
    phone = result[0];
    name = result[1];
    email = result[2];
    if (!areArgsCorrect(phone, name, email)) {
        return false;
    }
    if (!telInPhoneBook(phone)) {
        return false;
    }
    updatePhoneBook(phone, name, email);

    return true;
}

function updatePhoneBook(phone, name, email) {
    for (let element of phoneBook) {
        if (element.slice(0, 10) === phone) {
            phoneBook.delete(element);
            phoneBook.add(`${phone}|${name}|${email}`);
            break;
        }
    }
}


/**
 * Поиск записей по запросу в телефонной книге
 * @param {String} query
 * @returns {String[]}
 */
function find(query) {
    if (!isString(query) || hasWrongValue(query)) {
        return []; // как будто пустой запрос
    }
    if (query === '*') {
        return handleRecords(phoneBook);
    }
    var suitablesForQuery = [];
    phoneBook.forEach(element => {
        if (element.includes(query)) {
            suitablesForQuery.push(element);
        }
    });
    if (suitablesForQuery.length === 0) {
        return [];
    }

    return handleRecords(suitablesForQuery);
}

function handleRecords(records) {
    var result = [];
    records.forEach(record => {
        var splittedRecord = record.split('|');
        var phone = splittedRecord[0];
        var handledEmail = ', ' + splittedRecord[2];
        if (splittedRecord[2] === '') {
            handledEmail = '';
        }
        var handledPhone = `+7 (${phone.slice(0, 3)}) ${phone.slice(3, 6)}-` +
            `${phone.slice(6, 8)}-${phone.slice(8, 10)}`;
        var handledRecord = `${splittedRecord[1]}, ${handledPhone}${handledEmail}`;
        result.push(handledRecord);
    });

    return result.sort();
}

/**
 * Удаление записей по запросу из телефонной книги
 * @param {String} query
 * @returns {Number}
 */
function findAndRemove(query) {
    var findResult = find(query);
    for (var element of findResult) {
        phoneBook.delete(element);
    }

    return findResult.length;
}


/**
 * Импорт записей из csv-формата
 * @star
 * @param {String} csv
 * @returns {Number} – количество добавленных и обновленных записей
 */
function importFromCsv(csv) {
    if (!isString(csv) || hasWrongValue(csv)) {
        return 0;
    }
    csv = csv.split('\n');
    var addedRecordsCount = 0;
    for (var record of csv) {
        var splittedRecord = record.split(';');
        var name = splittedRecord[0];
        var phone = splittedRecord[1];
        var email = splittedRecord[2];
        if (add(phone, name, email) || update(phone, name, email)) {
            addedRecordsCount++;
        }
    }

    return addedRecordsCount;
}

module.exports = {
    add,
    update,
    findAndRemove,
    find,
    importFromCsv,

    isStar
};
