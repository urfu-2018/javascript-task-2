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
    if (!correctPhone(phone) || phoneBook[phone] || !correctName(name)) {
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
    if (!phoneBook[phone] || !correctName(name) || !correctPhone(phone)) {
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
    const foundedContacts = getPropertys(query);

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
    let fourthPart = phone.slice(8, 10);

    return `+7 (${firstPart}) ${secondPart}-${thirdPart}-${fourthPart}`;
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

function getPropertys(query) {
    if (!query) {
        return [];
    }

    if (query === '*') {
        return Object.keys(phoneBook);
    }

    return Object.keys(phoneBook)
        .filter(phone => phone.includes(query) ||
            phoneBook[phone].name.includes(query) ||
            (phoneBook[phone].email && phoneBook[phone].email.includes(query)));
}

function find(query) {
    return getPropertys(query)
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
