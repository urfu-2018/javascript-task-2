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
 * Проводит необходимые для add и update проверки.
 * @param {String} phone
 * @param {String} name
 * @param {String} email
 * @returns {boolean}
 */
function dataChecks(phone, name, email) {
    return !(!(notEmptyString(phone) && /^\d{10}$/.test(phone)) ||
        !(notEmptyString(name)) ||
        !(email === undefined || notEmptyString(email)));
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
 * Добавление записи в телефонную книгу
 * @param {String} phone
 * @param {String?} name
 * @param {String?} email
 * @returns {Boolean}
 */
function add(phone, name, email) {
    if (!dataChecks(phone, name, email) || phoneBook[phone] !== undefined) {
        return false;
    }
    phoneBook[phone] = [name, email]; // { 5551110011: ['Алексей', 'noreply@gmail.com'] }

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
    if (!dataChecks(phone, name, email) || phoneBook[phone] === undefined) {
        return false;
    }
    phoneBook[phone] = [name, email]; // { 5551110011: ['Алексей', 'noreply@gmail.com'] }

    return true;
}

/**
 * Проверяет, является строка подстрокой любого элемента массива
 * @param {String[]} arr
 * @param {String} query
 * @returns {Boolean}
 */
function arrayIncludes(arr, query) {
    for (let i in arr) {
        if (arr[i] !== undefined && arr[i].includes(query)) {
            return true;
        }
    }

    return false;
}

/**
 * Удаление записей по запросу из телефонной книги
 * @param {String} query
 * @returns {Number}
 */
function findAndRemove(query) {
    if (query === undefined) {
        return 0;
    }

    if (query === '*') {
        const count = Object.keys(phoneBook).length;
        phoneBook = {};

        return count;
    }

    let count = 0;
    for (let [phone, info] of Object.entries(phoneBook)) {
        info.push(phone); // Вынести в промежуточный результат?
        if (arrayIncludes(info, query)) {
            delete phoneBook.phone;
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
    if (query === undefined) {
        return [];
    }

    if (query === '*') {
        query = '';
    }

    let result = [];
    for (let [p, info] of Object.entries(phoneBook)) {
        info.push(p);
        const formattedPhone =
            `+7 (${p.slice(0, 3)}) ${p.slice(3, 6)}-${p.slice(6, 8)}-${p.slice(8)}`;

        let resultingString = info[0] + ', ' + formattedPhone;
        if (info[1] !== undefined) { // Если почта существует, добавляем ее.
            resultingString += ', ' + info[1];
        }
        if (arrayIncludes(info, query)) {
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
    // Парсим csv
    // Добавляем в телефонную книгу
    // Либо обновляем, если запись с таким телефоном уже существует
    if (csv === undefined) {
        return 0;
    }

    if (typeof csv !== 'string') {
        return 0;
    }

    const elements = csv.split('\n');
    const parsed = [];
    for (let i of elements) {
        parsed.push(i.split(';'));
    }

    let count = 0;
    for (let i in parsed) {
        if (update(parsed[i][1], parsed[i][0], parsed[i][2])) {
            count++;
        }
    }

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
