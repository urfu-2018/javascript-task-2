'use strict';

/**
 * Сделано задание на звездочку
 * Реализован метод importFromCsv
 */
const isStar = false;

/**
 * Телефонная книга
 */
let phoneBook = [];

function validateName(name) {
    return typeof name === 'string' && name.length;
}

function validateNumber(phone) {
    return typeof phone === 'string' && /^\d{10}$/.test(phone);
}

/**
 * Добавление записи в телефонную книгу
 * @param {String} phone
 * @param {String?} name
 * @param {String?} email
 * @returns {Boolean}
 */
function add(phone, name, email = '') {
    if (!validateNumber(phone) || !validateName(name) ||
        indexOfPhone(phone) !== -1) {
        return false;
    }
    if (arguments.length < 3) {
        email = '';
    }
    phoneBook.push([phone, name, email]);

    return true;
}

function indexOfPhone(phone) {
    for (let i = 0; i < phoneBook.length; i++) {
        if (phoneBook[i][0] === phone) {
            return i;
        }
    }

    return -1;
}

/**
 * Обновление записи в телефонной книге
 * @param {String} phone
 * @param {String?} name
 * @param {String?} email
 * @returns {Boolean}
 */
function update(phone, name, email = '') {
    let index = indexOfPhone(phone);
    if (!validateName(name) || !validateNumber(phone) ||
        index === -1) {
        return false;
    }
    if (arguments.length === 2) {
        email = '';
    }
    phoneBook[index] = [phone, name, email];

    return true;
}

/**
 * Удаление записей по запросу из телефонной книги
 * @param {String} query
 * @returns {Number}
 */
function findAndRemove(query) {
    let count;
    if (query === '') {
        return 0;
    }
    if (query === '*') {
        count = phoneBook.length;
        phoneBook.length = 0;
    } else {
        let deleted = searchIndexOfDeleted(query);
        count = deleted.length;
        for (let i = 0; i < count; i++) {
            phoneBook.splice(deleted[i], 1);
        }
    }

    return count;
}

function searchIndexOfDeleted(query) {
    const indexes = [];
    phoneBook.forEach((item, index) => {
        item.forEach((element) => {
            if (element.indexOf(query) !== -1) {
                indexes.push(index);
            }
        });
    });

    return indexes;
}

/**
 * Поиск записей по запросу в телефонной книге
 * @param {String} query
 * @returns {String[]}
 */

function find(query) {
    if (query === '') {
        return [];
    }
    if (query === '*') {
        return phoneBook.map(formatPhoneBook).sort();
    }
    let resultArray = filterPhoneBook(query);

    return resultArray.map(formatPhoneBook).sort();
}

/**
 * @return {boolean}
 */

function filterPhoneBook(query) {
    return phoneBook.filter(function (el) {
        return el[0].indexOf(query) !== -1 ||
            el[1].indexOf(query) !== -1 ||
            el[2].indexOf(query) !== -1;
    });
}

function formatPhoneBook(value) {
    let str = value[1] + ', ' +
        '+7 (' + value[0].substring(0, 3) + ') ' +
        value[0].substring(3, 6) + '-' +
        value[0].substring(6, 8) + '-' +
        value[0].substring(8, 10);
    if (value[2].length !== 0) {
        str = str + ', ' + value[2];
    }

    return str;
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
