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
    if (!phone.match(/^\d{10}$/)) {
        return false;
    }

    if (phoneBook[phone] !== undefined) {
        return false;
    }

    if (!name) {
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
    if (phoneBook[phone] === undefined) {
        return false;
    }

    if (!name) {
        return false;
    }

    phoneBook[phone] = {
        name: name,
        email: email
    };

    return true;
}

/**
 * Удаление записей по запросу из телефонной книги
 * @param {String} query
 * @returns {Number}
 */
function findAndRemove(query) {
    const phones = findPhones(query);
    phones.forEach(phone => {
        phoneBook[phone] = undefined;
    });

    return phones.length;
}

function findPhones(query) {

    if (query === '*') {
        return Object.keys(phoneBook)
            .filter(key => phoneBook[key] !== undefined);
    }

    if (query === '') {
        return [];
    }

    return Object.keys(phoneBook)
        .filter(key => phoneBook[key] !== undefined)
        .filter(key => key.includes(query) || phoneBook[key].name.includes(query) ||
            (phoneBook[key].email !== undefined && phoneBook[key].email.includes(query)));
}

/**
 * Поиск записей по запросу в телефонной книге
 * @param {String} query
 * @returns {String[]}
 */
function find(query) {
    const transformPhone = phone => `+7 (${phone.substr(0, 3)}) ` +
        `${phone.substr(3, 3)}-${phone.substr(6, 2)}-${phone.substr(8, 2)}`;

    return findPhones(query)
        .sort((firstPhone, secondPhone) =>
            phoneBook[firstPhone].name.localeCompare(phoneBook[secondPhone].name))
        .map(phone => [
            phoneBook[phone].name,
            transformPhone(phone),
            phoneBook[phone].email
        ]
            .filter(field => field !== undefined)
            .join(', '));
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
    let count = 0;
    csv.split('\n')
        .forEach(record => {
            const arr = record.split(';');
            if (add(arr[1], arr[0], arr[2]) || update(arr[1], arr[0], arr[2])) {
                count++;
            }
        });

    return count;
}

module.exports = {
    add,
    update,
    findAndRemove,
    find,
    importFromCsv,

    isStar
};
