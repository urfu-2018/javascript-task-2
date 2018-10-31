'use strict';

/**
 * Сделано задание на звездочку
 * Реализован метод importFromCsv
 */
const isStar = true;

/**
 * Телефонная книга
 */
let phoneBook = [];

function phoneIsValid(phone) {

    return phone && phone.match(/^\d{10}$/);
}

/**
 * Добавление записи в телефонную книгу
 * @param {String} phone
 * @param {String?} name
 * @param {String?} email
 * @returns {Boolean}
 */
function add(phone, name, email) {
    if (typeof name !== 'string' || !name || !phoneIsValid(phone)) {
        return false;
    }

    const checkPhoned = phoneBook.some(function (record) {

        return record.phone === phone;
    });

    if (!checkPhoned) {
        phoneBook.push({ name, phone, email });

        return true;
    }

    return false;
}

/**
 * Обновление записи в телефонной книге
 * @param {String} phone
 * @param {String?} name
 * @param {String?} email
 * @returns {Boolean}
 */
function update(phone, name, email) {
    if (typeof name !== 'string' || !(name.length > 0)) {
        return false;
    }
    let elem = phoneBook.find(record => record.phone === phone && name);
    if (elem === undefined) {

        return false;
    }
    elem.name = name;
    elem.phone = phone;
    elem.email = email;

    return true;
}

/**
 * Удаление записей по запросу из телефонной книги
 * @param {String} query
 * @returns {Number}
 */
function findAndRemove(query) {
    if (query === '*') {
        let result = phoneBook.length;
        phoneBook = [];

        return result;
    }
    if (query === '') {
        return 0;
    }
    let result = 0;
    phoneBook = phoneBook.filter(elem => {
        if (checkRecord(elem, query)) {
            result = result + 1;

            return false;
        }

        return true;
    });

    return result;
}

function checkRecord(record, query) {
    if (record.name.indexOf(query) > -1 || record.phone.indexOf(query) > -1) {
        return true;
    }
    if (record.email) {
        return record.email.indexOf(query) > -1;
    }

    return false;

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
    if (query === '*') {
        return phoneBook.map(elem => outString(elem.name, elem.phone, elem.email)).sort();
    }
    let result = phoneBook.filter(elem => checkRecord(elem, query))
        .map(elem => outString(elem.name, elem.phone, elem.email));

    return result.sort();
}

function outString(name, phone, email) {
    let result = name;
    if (phone !== undefined) {
        result = `${result}, ${makeFormatPhone(phone)}`;
    }
    if (email !== undefined) {
        result = `${result}, ${email}`;
    }

    return result;
}

function makeFormatPhone(phone) {
    return '+7 (' + phone.slice(0, 3) + ') ' + phone.slice(3, 6) + '-' +
     phone.slice(6, 8) + '-' + phone.slice(8, 10);
}

function addRecordInBook(record) {
    const cont = record.split(';');
    const name = cont[0];
    const phone = cont[1];
    const email = cont[2];
    if (add(phone, name, email) ||
        update(phone, name, email)) {
        return true;
    }

    return false;
}


/**
 * Импорт записей из csv-формата
 * @star
 * @param {String} csv
 * @returns {Number} – количество добавленных и обновленных записей
 */
function importFromCsv(csv) {

    const book = csv.split('\n');
    const addRecord = book.reduce((accum, elem) => {
        return accum + addRecordInBook(elem);
    }, 0);

    return addRecord;
}

module.exports = {
    add,
    update,
    findAndRemove,
    find,
    importFromCsv,

    isStar
};
