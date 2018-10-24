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

function isPhoneValid(phone) {
    return phone && phone.search('^[0-9]{10}$') !== -1;
}

function isNameValid(name) {
    return name && typeof(name) === 'string';
}

function addToPhoneBookSafely(phone, name, email) {
    phoneBook[phone] = {
        name,
        email
    };
}

function convertPhoneNumber(phone) {
    const regionPart = `+7 (${phone.substr(0, 3)}) `;
    const personalPhonePart = `${phone.substr(3, 3)}-${phone.substr(6, 2)}-${phone.substr(8, 2)}`;

    return regionPart + personalPhonePart;
}

/**
 * Добавление записи в телефонную книгу
 * @param {String} phone
 * @param {String?} name
 * @param {String?} email
 * @returns {Boolean}
 */
function add(phone, name, email) {
    if (!isNameValid(name) || !isPhoneValid(phone) || phoneBook[phone]) {
        return false;
    }

    addToPhoneBookSafely(phone, name, email);

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
    if (!isNameValid(name) || !isPhoneValid(phone) || !phoneBook[phone]) {
        return false;
    }

    addToPhoneBookSafely(phone, name, email);

    return true;
}

/**
 * Удаление записей по запросу из телефонной книги
 * @param {String} query
 * @returns {Number}
 */
function findAndRemove(query) {
    return Object.keys(phoneBook)
        .filter(function (phoneNumber) {
            return hasPhoneByQuery(phoneNumber, query);
        })
        .reduce((accumulator, currentValue) => {
            delete phoneBook[currentValue];

            return accumulator + 1;
        }, 0);
}


function hasPhoneByQuery(phoneNumber, query) {
    return query === '*' ||
        phoneNumber.indexOf(query) !== -1 ||
        phoneBook[phoneNumber].name.indexOf(query) !== -1 ||
        (phoneBook[phoneNumber].email &&
            phoneBook[phoneNumber].email.indexOf(query) !== -1);
}

function mapFindResult(phoneNumber) {
    const name = phoneBook[phoneNumber].name;
    const mail = phoneBook[phoneNumber].email;

    return phoneBook[phoneNumber].email
        ? `${name}, ${convertPhoneNumber(phoneNumber)}, ${mail}`
        : `${name}, ${convertPhoneNumber(phoneNumber)}`;
}

/**
 * Поиск записей по запросу в телефонной книге
 * @param {String} query
 * @returns {String[]}
 */
function find(query) {
    let findedRows = [];

    if (!query) {
        return findedRows;
    }

    return Object.keys(phoneBook)
        .filter(function (phoneNumber) {
            return hasPhoneByQuery(phoneNumber, query);
        })
        .sort((a, b) => phoneBook[a].name.localeCompare(phoneBook[b].name))
        .map(mapFindResult);
}

function reduceAddedOrUpdatedNumbers(accumulator, currentValue) {
    const phoneBookElements = currentValue.split(';');

    const name = phoneBookElements[0];
    const phoneNumber = phoneBookElements[1];
    const email = phoneBookElements[2];

    return add(phoneNumber, name, email) || update(phoneNumber, name, email)
        ? accumulator + 1
        : accumulator;
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

    return csv.split('\n').reduce(reduceAddedOrUpdatedNumbers, 0);
}

module.exports = {
    add,
    update,
    findAndRemove,
    find,
    importFromCsv,

    isStar
};
