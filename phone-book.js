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
    if (!dataChecks(phone, name, email) || find(phone).length > 0) {
        return false;
    }
    phoneBook[phone] = { name: name, email: email };

    return true;
}

/**
 * Проверяет, является ли аргумент не пустой строкой.
 * @param {Object} str
 * @returns {Boolean}
 */
function notEmptyString(str) {
    return typeof str === 'string' && str.length > 0;
}

/**
 * Проводит необходимые для add и update проверки.
 * @param {String} phone
 * @param {String} name
 * @param {String} email
 * @returns {boolean}
 */
function dataChecks(phone, name, email) {
    return typeof phone === 'string' && /^\d{10}$/.test(phone) &&
        notEmptyString(name) &&
        (email === undefined || email.length > 0);
}

/**
 * Обновление записи в телефонной книге
 * @param {String} phone
 * @param {String?} name
 * @param {String?} email
 * @returns {Boolean}
 */
function update(phone, name, email) {
    if (!dataChecks(phone, name, email) || phoneBook[phone] === undefined) {
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
    if (!notEmptyString(query)) {
        return 0;
    }

    return find(query).map(entry =>
        delete phoneBook[entry.split(',')[1].match(/\d(\d+)/g).join('')]).length;
}

/**
 * Проверяет, является строка подстрокой хотя бы одного элемента массива
 * @param {String[]} arr
 * @param {String} query
 * @returns {Boolean}
 */
function arrayIncludes(arr, query) {
    return arr.map(str => str !== undefined && str.includes(query))
        .reduce((a, b) => a || b);
}

/**
 * Поиск записей по запросу в телефонной книге
 * @param {String} query
 * @returns {String[]}
 */
function find(query) {
    if (!notEmptyString(query)) {
        return [];
    }
    if (query === '*') { // Пустая строка содержится везде.
        query = '';
    }
    let result = [];
    for (let [p, info] of Object.entries(phoneBook)) {
        const formattedPhone =
            `+7 (${p.slice(0, 3)}) ${p.slice(3, 6)}-${p.slice(6, 8)}-${p.slice(8)}`;
        let resultingString = info.name + ', ' + formattedPhone;
        if (info.email !== undefined) {
            resultingString += ', ' + info.email;
        }
        if (arrayIncludes([info.name, info.email, p], query)) {
            result.push(resultingString);
        }
    }

    return result.sort();
}

/**
 * Импорт записей из csv-формата
 * @star
 * @param {String} csv
 * @returns {Number} – количество добавленных и обновленных записей
 */
function importFromCsv(csv) {
    return csv.split('\n').map(a => a.split(';'))
        .map(e => add(e[1], e[0], e[2]) || update(e[1], e[0], e[2]))
        .filter(a => a).length; // Фильтруем все true
}

module.exports = {
    add,
    update,
    findAndRemove,
    find,
    importFromCsv,

    isStar
};
