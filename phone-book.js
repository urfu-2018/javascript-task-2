'use strict';

/**
 * Сделано задание на звездочку
 * Реализован метод importFromCsv
 */
const isStar = false;

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

function findRecordByPhone(phone) {

    return phoneBook.find(r => r.phone === phone);
}

function isValidPhone(phone) {
    if (isNullOrUndefined(phone)) {

        return false;
    }
    const PHONE_REGEX = /^\d{10}$/;

    return PHONE_REGEX.test(phone);
}


/**
 * Добавление записи в телефонную книгу
 * @param {String} phone
 * @param {String?} name
 * @param {String?} email
 * @returns {Boolean}
 */
function add(phone, name, email) {
    if (isNullOrUndefined(name) || !isValidPhone(phone)) {
        return false;
    }
    let phoneIsInPhoneBook = findRecordByPhone(phone) !== undefined;
    if (phoneIsInPhoneBook) {

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
    if (isNullOrUndefined(name) || isNullOrUndefined(phone)) {
        return false;
    }

    let indexOfRecord = phoneBook.findIndex((element) => {
        return element.phone === phone;
    });

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
    if (isNullOrUndefined(query)) {
        return 0;
    }
    let phoneBookBeforeDeleteLength = phoneBook.length;
    var phoneBookAfterDelete = phoneBook
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
    if (isNullOrUndefined(query)) {
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

function isQueryContainsInRecordFields(query, record) {

    return query === '*' ||
        record.phone.includes(query) ||
        record.name.includes(query) ||
        !isNullOrUndefined(record.email) &&
        record.email.includes(query);
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
