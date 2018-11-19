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


function findQuery(phone, data, query) {
    const hasPhoneQuery = phone.includes(query);
    const hasNameQuery = data.name.includes(query);
    const hasEmailQuery = data.email && data.email.includes(query);

    return hasPhoneQuery || hasNameQuery || hasEmailQuery || query === '*';
}

function formatLog(phone) {
    const phoneFormatted = phone
        .replace(/^(\d{3})(\d{3})(\d{2})(\d{2})$/, '+7 ($1) $2-$3-$4');
    const name = phoneBook.get(phone).name;
    const email = phoneBook.get(phone).email;

    return email
        ? [name, phoneFormatted, email].join(', ')
        : [name, phoneFormatted].join(', ');
}


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
    const isNameInPhoneBook = phoneBook.has(phone);

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
    if (phoneBook.has(phone) && name) {
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
    const oldPhoneBookLength = phoneBook.size;

    if (!query) {
        return 0;
    }

    for (let [phone, data] of phoneBook.entries()) {
        if (findQuery(phone, data, query)) {
            phoneBook.delete(phone);
        }
    }

    return oldPhoneBookLength - phoneBook.size;
}

/**
 * Поиск записей по запросу в телефонной книге
 * @param {String} query
 * @returns {String[]}
 */
function find(query) {
    let phoneArray = [];

    if (!query) {
        return phoneArray;
    }

    for (let [phone, data] of phoneBook.entries()) {
        if (findQuery(phone, data, query)) {
            phoneArray.push(phone);
        }
    }

    return phoneArray
        .sort((phoneOne, phoneTwo) => (
            phoneBook.get(phoneOne).name.localeCompare(phoneBook.get(phoneTwo).name))
        ).map(formatLog);
}

/**
 * Импорт записей из csv-формата
 * @star
 * @param {String} csv
 * @returns {Number} – количество добавленных и обновленных записей
 */
function importFromCsv(csv) {
    // Парсим csv
    if (typeof(csv) !== 'string' || !csv) {
        return 0;
    }

    const listOfPhoneLogs = csv.split('\n');
    const result = listOfPhoneLogs.filter(log => {
        const [name, phone, email] = log.split(';');

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
