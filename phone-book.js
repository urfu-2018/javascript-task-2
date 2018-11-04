'use strict';

/**
 * Сделано задание на звездочку
 * Реализован метод importFromCsv
 */
const isStar = false;
var phoneBook;

/**
 * Телефонная книга
 */
const phonePattern = /^\d{10}$/;
// const mailPattern = /\w+@\w+\.\w+/;
/**
 * Добавление записи в телефонную книгу
 * @param {String} phone
 * @param {String?} name
 * @param {String?} email
 * @returns {Boolean}
 */
function add(phone, name, email = '') {
    if (!phoneBook) {
        phoneBook = [];
    }
    if (typeof(phone) === 'string' &&
        typeof(name) === 'string' &&
        phonePattern.test(phone) &&
        phoneBook[phone] === undefined) {
        phoneBook[phone] = {
            name: name,
            email: email
        };

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
function update(phone, name, email = '') {
    if (typeof(phone) === 'string' &&
        typeof(name) === 'string' &&
        phonePattern.test(phone) &&
        phoneBook[phone] !== undefined) {
        phoneBook[phone].email = email;
        phoneBook[phone].name = name;

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
    if (!query) {
        return [];
    }
    if (typeof(query) !== 'string' &&
        query !== 'string') {

        return 0;
    }
    let matchingArray = [];

    return getAllMatching(query, matchingArray).length;
}

/**
 * Поиск записей по запросу в телефонной книге
 * @param {String} query
 * @returns {String[]}
 */
function find(query) {
    var matchingArray = [];
    if (typeof(query) !== 'string' ||
        query === '') {
        return;
    }
    matchingArray = getAllMatching(query)
        .sort(function (a, b) {
            return a > b;
        });

    return matchingArray;
}


function getRepresentation(phone) {
    let name = phoneBook[phone].name;
    let email = phoneBook[phone].email;
    let repr = '';
    let phoneRepresentation = '+7 (' + phone.slice(0, 3) + ') ' +
    phone.slice(3, 6) + '-' + phone.slice(6, 8) + '-' + phone.slice(8, 10);
    if (email) {
        repr = name + ', ' + phoneRepresentation + ', ' + email;
    } else {
        repr = name + ', ' + phoneRepresentation;
    }

    return repr;
}

function getAllMatching(query) {
    return Object.keys(phoneBook)
        .reduce((result, phone) => {
            if ((query === '*') ||
                phone.includes(query) ||
                phoneBook[phone].name.includes(query) ||
                phoneBook[phone].email.includes(query)) {
                result.push(getRepresentation(phone));
            }

            return result;
        }, []);
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
