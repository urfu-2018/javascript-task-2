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

/**
 * Добавление записи в телефонную книгу
 * @param {String} phone
 * @param {String?} name
 * @param {String?} email
 * @returns {Boolean}
 */
function correctPhone(phone) {
    return typeof phone === 'string' && /^\d{10}$/.test(phone);
}

function correctName(name) {
    return typeof name === 'string' && name.length > 0;
}

function correctNameAndPhone(name, phone) {
    return correctPhone(phone) && correctName(name);
}


function add(phone, name, email) {
    if (!correctNameAndPhone(name, phone)) {
        return false;
    }
    if (!phoneBook[phone]) {
        phoneBook[phone] = { name, email };

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
    if (!correctNameAndPhone(name, phone)) {
        return false;
    }
    if (phoneBook[phone]) {
        phoneBook[phone] = { name, email };

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
    return getProperties(query).map(phone => delete phoneBook[phone]).length;
}

/**
 * Поиск записей по запросу в телефонной книге
 * @param {String} query
 * @returns {String[]}
 */

function phoneView(phone) {
    let firstPart = phone.slice(0, 3);
    let secondPart = phone.slice(3, 6);
    let thirdPart = phone.slice(6, 8);
    let fourthPart = phone.slice(8, 10);

    return `+7 (${firstPart}) ${secondPart}-${thirdPart}-${fourthPart}`;
}

function contactView(phone) {
    return phoneBook[phone].email
        ? [phoneBook[phone].name, phoneView(phone), phoneBook[phone].email].join(', ')
        : [phoneBook[phone].name, phoneView(phone)].join(', ');
}

function sortByName(x, y) {
    return phoneBook[x].name > phoneBook[y].name;
}

function propertiesIncludes(phone, query) {
    return phone.includes(query) ||
    phoneBook[phone].name.includes(query) ||
    (phoneBook[phone].email && phoneBook[phone].email.includes(query));
}

function getProperties(query) {
    if (!query) {
        return [];
    }

    if (query === '*') {
        return Object.keys(phoneBook);
    }

    return Object.keys(phoneBook)
        .filter(phone => propertiesIncludes(phone, query));
}

function find(query) {
    return getProperties(query)
        .sort(sortByName)
        .map(contactView);
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
    if (!csv || typeof csv !== 'string') {
        return 0;
    }

    return csv.split('\n')
        .map(contact => {
            const [name, phone, email] = contact.split(';');
            if (phoneBook[phone]) {
                return update(phone, name, email);
            }

            return add(phone, name, email);
        }
        )
        .filter(Boolean)
        .length;
}

module.exports = {
    add,
    update,
    findAndRemove,
    find,
    importFromCsv,

    isStar
};
