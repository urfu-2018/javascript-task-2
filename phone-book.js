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

/**
 * Добавление записи в телефонную книгу
 * @param {String} phone
 * @param {String?} name
 * @param {String?} email
 * @returns {Boolean}
 */
function add(phone, name, email) {
    const isPhoneValid = /^\d{10}$/.test(phone);
    const isNameValid = name && name.length > 0;
    const isNameInPhoneBook = phoneBook.get(phone);

    if (isPhoneValid && isNameValid && !isNameInPhoneBook) {
        phoneBook.set(phone, { name, email });

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

    if (phoneBook.get(phone)) {
        phoneBook.set(phone, { name, email });

        return true;
    }

    return false;
}

/**
 * Удаление записей по запросу из телефонной книги
 * @param {String} query
 * @returns {Number}
 */
function findAndRemove(query) {
    const oldPhoneBookLength = Array.from(phoneBook.keys()).length;

    if (!query) {
        return 0;
    }

    if (query === '*') {
        phoneBook.clear();

        return oldPhoneBookLength;
    }

    let phoneArray = Array.from(phoneBook.keys()).filter(phone => {
        const email = phoneBook.get(phone).email;
        const hasPhoneQuery = phone.includes(query);
        const hasNameQuery = phoneBook.get(phone).name.includes(query);
        if (!email) {
            return !(hasPhoneQuery || hasNameQuery);
        }
        const hasEmailQuery = phoneBook.get(phone).email.includes(query);

        const filterPredicate = hasPhoneQuery || hasNameQuery || hasEmailQuery;

        if (filterPredicate) {
            phoneBook.delete(phone);
        }

        return !filterPredicate;
    });

    return oldPhoneBookLength - phoneArray.length;
}

/**
 * Поиск записей по запросу в телефонной книге
 * @param {String} query
 * @returns {String[]}
 */
function find(query) {
    const formatLog = phone => {
        const phoneFormatted = `+7 (${phone.substring(0, 3)}) ${phone.substring(3, 6)}-` +
            `${phone.substring(6, 8)}-${phone.substring(8, 10)}`;

        if (!phoneBook.get(phone).email) {
            return [phoneBook.get(phone).name, phoneFormatted]
                .join(', ');
        }

        return [phoneBook.get(phone).name, phoneFormatted, phoneBook.get(phone).email]
            .join(', ');
    };

    if (!query) {
        return [];
    }

    let phoneArray = Array.from(phoneBook.keys());

    if (query === '*') {
        return phoneArray
            .sort((phoneOne, phoneTwo) => (phoneBook.get(phoneOne).name
                .localeCompare(phoneBook.get(phoneTwo).name)))
            .map(formatLog);
    }

    let phoneBookQuerySet = phoneArray.filter(phone => {
        const email = phoneBook.get(phone).email;
        const hasPhoneQuery = phone.includes(query);
        const hasNameQuery = phoneBook.get(phone).name.includes(query);
        if (!email) {
            return hasPhoneQuery || hasNameQuery;
        }
        const hasEmailQuery = email.includes(query);

        return hasPhoneQuery || hasNameQuery || hasEmailQuery;
    });

    return phoneBookQuerySet
        .sort((phoneOne, phoneTwo) => (phoneBook.get(phoneOne).name
            .localeCompare(phoneBook.get(phoneTwo).name)))
        .map(formatLog);
}

/**
 * Импорт записей из csv-формата
 * @star
 * @param {String} csv
 * @returns {Number} – количество добавленных и обновленных записей
 */
function importFromCsv(csv) {
    if (typeof(csv) !== 'string' || !csv) {
        return 0;
    }

    const listOfPhoneLogs = csv.split('\n');
    const result = listOfPhoneLogs.filter(log => {
        const logData = log.split(';');
        const name = logData[0];
        const phone = logData[1];
        const email = logData[2];

        return add(phone, name, email) || update(phone, name, email);
    });

    return result.length;
}

module.exports = {
    add,
    update,
    findAndRemove,
    find,
    importFromCsv,

    isStar
};
