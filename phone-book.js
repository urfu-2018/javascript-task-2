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
function add(phone, name, email) {
    const correctPhone = /^\d{10}$/.test(phone);
    if (!correctPhone || phoneBook.hasOwnProperty(phone) ||
    name === undefined || name === '') {
        return false;
    }
    phoneBook[phone] = {
        name: name,
        email: email
    };

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
    if (Object.keys(phoneBook).includes(phone) && name !== undefined && name !== '') {
        phoneBook[phone] = {
            name: name,
            email: email
        };

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
    const res = findKeys(query);

    for (let i of res) {
        delete phoneBook[i];
    }

    return res.length;
}

/**
 * Поиск записей по запросу в телефонной книге
 * @param {String} query
 * @returns {String[]}
 */
function find(query) {
    const res = findKeys(query);

    return res.map(
        phone =>
            phoneBook[phone].email
                ? `${phoneBook[phone].name}, ${getPhone(phone)}, ${phoneBook[phone].email}`
                : `${phoneBook[phone].name}, ${getPhone(phone)}`);
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
    const lines = csv.split('\n');

    let count = 0;
    for (let i of lines) {
        const parts = i.split(';');
        if (phoneBook[parts[1]]) {
            count += update(parts[1], parts[0], parts[2]) ? 1 : 0;
        } else {
            count += add(parts[1], parts[0], parts[2]) ? 1 : 0;
        }
    }

    return count;
}

function findKeys(query) {
    if (query === undefined || query === '') {
        return [];
    }

    if (query === '*') {
        return Object.keys(phoneBook)
            .sort((a, b) => phoneBook[a].name > phoneBook[b].name);
    }

    return Object.keys(phoneBook)
        .filter(phone => phone.includes(query) ||
        phoneBook[phone].name.includes(query) ||
        (phoneBook[phone].email !== undefined && phoneBook[phone].email.includes(query)))
        .sort((a, b) => phoneBook[a].name > phoneBook[b].name);
}

function getPhone(phone) {
    const part1 = phone.substring(0, 3);
    const part2 = phone.substring(3, 6);
    const part3 = phone.substring(6, 8);
    const part4 = phone.substring(8, 10);

    return `+7 (${part1}) ${part2}-${part3}-${part4}`;
}

module.exports = {
    add,
    update,
    findAndRemove,
    find,
    importFromCsv,

    isStar
};
