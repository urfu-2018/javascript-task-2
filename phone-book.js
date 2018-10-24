'use strict';

/**
 * Сделано задание на звездочку
 * Реализован метод importFromCsv
 */
const isStar = false;

/**
 * Телефонная книга
 */
let phoneBook = new Map();


const isParamsCorrect = (phone, name, email) => {
    let isPhoneCorrect = /^\d{10}$/.test(phone);
    let isNameFormatCorrect = name !== undefined;
    let isEmailFormatCorrect =
        /^[0-9a-z]+@[a-z0-9]+\.[a-z0-9]+$/i.test(email) || email === undefined;

    return isPhoneCorrect && isNameFormatCorrect && isEmailFormatCorrect;
};

const convertAnswer = userInf => {
    userInf = userInf.split(' ');
    let phone = userInf[0];

    return `${userInf[1]}, +7 (${
        phone.slice(0, 3)}) ${phone.slice(3, 6)}-${phone.slice(6, 8)}-${phone.slice(8, 10)}` +
        String(userInf[2] !== 'undefined' ? `, ${userInf[2]}` : '');
};

/**
 * Добавление записи в телефонную книгу
 * @param {String} phone
 * @param {String?} name
 * @param {String?} email
 * @returns {Boolean}
 */
function add(phone, name, email) {
    if (!isParamsCorrect(phone, name, email) || phoneBook.has(phone)) {
        return false;
    }

    phoneBook.set(phone, `${phone} ${name} ${email}`);

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
    if (!phoneBook.has(phone) && !isParamsCorrect(phone, name, email)) {
        return false;
    }

    phoneBook.set(phone,
        `${phone} ${name} ${email}`);

    return true;
}

/**
 * Удаление записей по запросу из телефонной книги
 * @param {String} query
 * @returns {Number}
 */
function findAndRemove(query) {
    if (query === '*') {
        let phoneBookLen = phoneBook.length;
        phoneBook = new Map();

        return phoneBookLen;
    }
    let contactsToDelete = [];
    let queryRegEx = new RegExp(query);
    phoneBook.forEach((value, key) => {
        if (queryRegEx.test(value)) {
            contactsToDelete.push(key);
        }
    });
    contactsToDelete.forEach(item => phoneBook.delete(item));

    return contactsToDelete.length;
}

/**
 * Поиск записей по запросу в телефонной книге
 * @param {String} query
 * @returns {String[]}
 */
function find(query) {
    let contacts = [];
    if (query === '*') {
        phoneBook.forEach((value) => contacts.push(convertAnswer(value)));
    } else {
        let queryRegEx = new RegExp(query);
        phoneBook.forEach((value) => {
            if (queryRegEx.test(value)) {
                contacts.push(convertAnswer(value));
            }
        });
    }

    return contacts.sort();
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
