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

function getPhoneBookRecord(phone, name, email) {

    return {
        phone: phone,
        name: name,
        email: email
    };
}

function isNullOrUndefined(variable) {

    return variable === null || variable === undefined;
}

function findIndexOfPhone(phone) {

    return phoneBook
        .findIndex(record => record.phone === phone);
}

function isValidPhone(phone) {
    if (isNullOrUndefined(phone)) {

        return false;
    }
    const PHONE_REGEX = /^\d{10}$/;

    return PHONE_REGEX.test(phone);
}

function isQueryContainsInRecordFields(query, record) {

    return query === '*' ||
        record.phone.includes(query) ||
        record.name.includes(query) ||
        !isNullOrUndefined(record.email) &&
        record.email.includes(query);
}

function isBadNameOrPhone(phone, name) {

    return isNullOrUndefined(name) || !isValidPhone(phone);
}

function isNullOrUndefinedOrEmptyString(query) {
    return isNullOrUndefined(query) ||
        typeof query === 'string' &&
        query === '';
}

/**
 * Добавление записи в телефонную книгу
 * @param {String} phone
 * @param {String?} name
 * @param {String?} email
 * @returns {Boolean}
 */
function add(phone, name, email) {
    if (isBadNameOrPhone(phone, name)) {
        return false;
    }

    let indexOfRecord = findIndexOfPhone(phone);

    if (indexOfRecord !== -1) {

        return false;
    }

    phoneBook.push(getPhoneBookRecord(phone, name, email));

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
    if (isBadNameOrPhone(phone, name)) {
        return false;
    }

    let indexOfRecord = findIndexOfPhone(phone);

    if (indexOfRecord === -1) {

        return false;
    }

    phoneBook[indexOfRecord] = getPhoneBookRecord(phone, name, email);

    return true;
}

/**
 * Удаление записей по запросу из телефонной книги
 * @param {String} query
 * @returns {Number}
 */
function findAndRemove(query) {
    if (isNullOrUndefinedOrEmptyString(query)) {
        return 0;
    }

    let phoneBookBeforeDeleteLength = phoneBook.length;
    let phoneBookAfterDelete = phoneBook
        .filter(record => !isQueryContainsInRecordFields(query, record));
    phoneBook = phoneBookAfterDelete;

    return phoneBookBeforeDeleteLength - phoneBook.length;
}

/**
 * Поиск записей по запросу в телефонной книге
 * @param {String} query
 * @returns {String[]}
 */
function find(query) {
    if (isNullOrUndefinedOrEmptyString(query)) {
        return [];
    }

    const PHONE_REGEX = /^(\d{3})(\d{3})(\d{2})(\d{2})$/;
    let result = phoneBook
        .filter(record => isQueryContainsInRecordFields(query, record))
        .sort((a, b) => {
            return a.name > b.name;
        });

    return result.map((record) => {
        let matches = record.phone.match(PHONE_REGEX);
        let phone = `+7 (${matches[1]}) ${matches[2]}-${matches[3]}-${matches[4]}`;

        let string = `${record.name}, ${phone}`;

        if (!isNullOrUndefined(record.email)) {
            string = string + `, ${record.email}`;
        }

        return string;
    });
}

/**
 * Импорт записей из csv-формата
 * @star
 * @param {String} csv
 * @returns {Number} – количество добавленных и обновленных записей
 */
function importFromCsv(csv) {
    let counter = 0;
    let usedPhones = [];
    if (isNullOrUndefinedOrEmptyString(csv)) {
        return counter;
    }
    let stringsFromCsv = csv.split('\n');
    stringsFromCsv.forEach((record) => {
        let values = record.split(';');
        let name = values[0];
        let phone = values[1];
        let email = values[2];

        if (isBadNameOrPhone(phone, name)) {
            return;
        }

        let result = add(phone, name, email) || update(phone, name, email);

        if (result && !usedPhones.includes(phone)) {
            usedPhones.push(phone);
            counter++;
        }
    });


    return counter;
}

module.exports = {
    add,
    update,
    findAndRemove,
    find,
    importFromCsv,

    isStar
};
