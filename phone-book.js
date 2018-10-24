'use strict';

/**
 * Сделано задание на звездочку
 * Реализован метод importFromCsv
 */
const isStar = true;

/**
 * Телефонная книга
 */
let phoneBook = new Set();


const phoneReg = /^\d{10}$/;
const isString = arg => typeof(arg) === 'string';
function replaceBadTypes(phone, name, email) {
    var args = [phone, name, email];

    return args.map((arg) => arg || '').map((arg) => arg.trim());
    // phone = phone || '';
    // name = name || '';
    // email = email || '';

    // return [phone.trim(), name.trim(), email.trim()];
}
const argsTypesAreCorrect = (phone, name, email) =>
    isString(phone) && isString(name) && isString(email);
const phoneIsSuitable = phone => phoneReg.test(phone);

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
    if (typeof name === 'undefined' || name === '' || name === null) {
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
    if (!isString(query)) {
        return new Set(); // как будто пустой запрос
    }
    if (query === '*') {
        return handleRecords(phoneBook);
    }
    var suitablesForQuery = new Set();
    phoneBook.forEach(element => {
        if (element.includes(query)) {
            suitablesForQuery.add(element);
        }
    });

    return handleRecords(suitablesForQuery);
}

function handleRecords(records) {
    var result = new Set();
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
        result.add(handledRecord);
    });

    return Array.from(result).sort();
}

// /**
//  * Удаление записей по запросу из телефонной книги
//  * @param {String} query
//  * @returns {Number}
//  */
// function findAndRemove(query) {

// }


// /**
//  * Импорт записей из csv-формата
//  * @star
//  * @param {String} csv
//  * @returns {Number} – количество добавленных и обновленных записей
//  */
// function importFromCsv(csv) {
//     // Парсим csv
//     // Добавляем в телефонную книгу
//     // Либо обновляем, если запись с таким телефоном уже существует

//     return csv.split('\n').length;
// }
// add('5554440044', 'Григорий', 'grisha@example.com');
// add('5552220022', 'Борис', 'boris@example.com');
// add('5551110011', 'Алекс');
// add('5551110011', 'Алекс');
// update('5551110011', 'Алексей', 'alex@example.com');

module.exports = {
    add,
    update,
    // findAndRemove,
    find,
    // importFromCsv,

    isStar
};
