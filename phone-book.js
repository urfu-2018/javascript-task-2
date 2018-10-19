'use strict';

/**
 * Сделано задание на звездочку
 * Реализован метод importFromCsv
 */
const isStar = true;

/**
 * Телефонная книга
 */
let phoneBook = {};

function isValidName(name) {
    return typeof name === 'string' && name !== '';
}

function isValidPhone(phone) {
    return typeof phone === 'string' && /^\d{10}$/.test(phone);
}

/**
 * Добавление записи в телефонную книгу
 * @param {String} phone
 * @param {String?} name
 * @param {String?} email
 * @returns {Boolean}
 */
function add(phone, name, email) {
    if (!isValidPhone(phone) || !isValidName(name) || phoneBook[phone]) {
        return false;
    }

    phoneBook[phone] = { name, email };

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
    if (!isValidPhone(phone) || !isValidName(name) || !phoneBook[phone]) {
        return false;
    }

    phoneBook[phone] = { name, email };

    return true;
}

function queryPhones(query) {
    if (query === '') {
        return [];
    }
    if (query === '*') {
        return Object.keys(phoneBook);
    }


    return Object.keys(phoneBook)
        .filter(
            phone => phone.includes(query) ||
                phoneBook[phone].name.includes(query) ||
                (phoneBook[phone].email && phoneBook[phone].email.includes(query))
        );
}

function formatPhone(phone) {
    const groups = /(\d{3})(\d{3})(\d{2})(\d{2})/.exec(phone);

    return `+7 (${groups[1]}) ${groups[2]}-${groups[3]}-${groups[4]}`;
}

function comparePhoneByOwner(first, second) {
    return phoneBook[first].name.localeCompare(phoneBook[second].name);
}

function getFormattedEntry(phone) {
    const entry = phoneBook[phone];

    if (entry.email) {
        return `${entry.name}, ${formatPhone(phone)}, ${entry.email}`;
    }

    return `${entry.name}, ${formatPhone(phone)}`;
}

/**
 * Удаление записей по запросу из телефонной книги
 * @param {String} query
 * @returns {Number}
 */
function findAndRemove(query) {
    const resp = queryPhones(query);

    resp.forEach(phone => {
        delete phoneBook[phone];
    });

    return resp.length;
}

/**
 * Поиск записей по запросу в телефонной книге
 * @param {String} query
 * @returns {String[]}
 */
function find(query) {
    return queryPhones(query)
        .sort(comparePhoneByOwner)
        .map(getFormattedEntry);
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
    return csv.split('\n')
        .map(entry => {
            const [name, phone, email] = entry.split(';');

            return phoneBook[phone] ? update(phone, name, email) : add(phone, name, email);
        })
        .reduce((totalCount, importedFromEntry) => totalCount + importedFromEntry);
}

module.exports = {
    add,
    update,
    findAndRemove,
    find,
    importFromCsv,

    isStar
};
