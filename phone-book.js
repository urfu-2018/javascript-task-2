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

function validatePhone(phone) {
    return typeof(phone) === 'string' && /^\d{10}$/.test(phone);
}

/**
 * Добавление записи в телефонную книгу
 * @param {String} phone
 * @param {String?} name
 * @param {String?} email
 * @returns {Boolean}
 */
function add(phone, name, email) {
    if (!validatePhone(phone) || phoneBook.has(phone) || !name) {
        return false;
    }
    if (!email) {
        email = '';
    }
    phoneBook.set(phone, [name, email]);

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
    if (!phoneBook.has(phone) || !name) {
        return false;
    }
    phoneBook.delete(phone);

    return add(phone, name, email);
}

function checkEmptyRequest(query) {
    return query === '';
}

/*R * Удаление записей по запросу из телефонной книги
 * @param {String} query
 * @returns {Number}
 */
function findAndRemove(query) {
    let count = 0;
    if (checkEmptyRequest(query)) {
        return count;
    }
    for (let i of phoneBook) {
        if (query === '*' || i[0].indexOf(query) > -1 || i[1][0].indexOf(query) > -1 ||
        i[1][1].indexOf(query) > -1) {
            phoneBook.delete(i[0]);
            count++;
        }
    }

    return count;
}

/**
 * Поиск записей по запросу в телефонной книге
 * @param {String} query
 * @returns {String[]}
 */
function find(query) {
    let str = [];
    if (checkEmptyRequest(query)) {
        return str;
    }
    for (let i of phoneBook) {
        let email = checkEmail(i[1][1]);
        if (query === '*' || i[0].indexOf(query) > -1 || i[1][0].indexOf(query) > -1 ||
        i[1][1].indexOf(query) > -1) {
            str.push(i[1][0] + ', +7 (' + i[0].substr(0, 3) + ') ' + i[0].substr(3, 3) + '-' +
            i[0].substr(6, 2) + '-' + i[0].substr(8, 2) + email);
        }
    }
    str.sort();

    return str;
}

/**
 * @param {String} email
 * @returns {String}
 */
function checkEmail(email) {
    if (email) {
        return ', ' + email;
    }

    return '';
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
