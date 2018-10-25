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

function add(phone, name, email) {
    if (!correctPhone(phone) || !correctName(name) || phoneBook[phone]) {
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
    if (!correctName(name) || !correctPhone(phone)) {
        return false;
    }

    phoneBook[phone] = { name: name, email: email };

    return true;
}

/**
 * Удаление записей по запросу из телефонной книги
 * @param {String} query
 * @returns {Number}
 */
function findAndRemove(query) {
    const foundedContacts = Object.keys(phoneBook)
        .filter(phone => phone.includes(query) ||
            phoneBook[phone].name.includes(query) ||
            phoneBook[phone].email && phoneBook[phone].email.includes(query));

    foundedContacts.forEach(phone => delete phoneBook[phone]);

    return foundedContacts.length;
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
    let fouthPart = phone.slice(8, 10);

    return `+7 (${firstPart}) ${secondPart}-${thirdPart}-${fouthPart}`;
}

function contactView(phone) {
    if (typeof phoneBook[phone].email !== 'undefined') {
        return `${phoneBook[phone].name}, ${phoneView(phone)}, ${phoneBook[phone].email}`;
    }

    return `${phoneBook[phone].name}, ${phoneView(phone)}`;

}

function sortByName(x, y) {
    return phoneBook[x].name > phoneBook[y].name;
}


function find(query) {
    if (!query) {
        return [];
    }

    if (query === '*') {
        return Object.keys(phoneBook)
            .sort((x, y) => sortByName(x, y))
            .map(contactView);
    }

    return Object.keys(phoneBook)
        .filter(phone => phone.includes(query) ||
            phoneBook[phone].name.includes(query) ||
           phoneBook[phone].email && phoneBook[phone].email.includes(query))
        .sort((x, y) => sortByName(x, y))
        .map(phone => contactView(phone));
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

    return csv.split('\n').map(
        a => {
            const contact = a.split(';');

            if (phoneBook[contact[1]]) {
                return update(contact[1], contact[0], contact[2]);
            }

            return add(contact[1], contact[0], contact[2]);
        }
    )
        .filter(b =>b).length;
}

module.exports = {
    add,
    update,
    findAndRemove,
    find,
    importFromCsv,

    isStar
};
