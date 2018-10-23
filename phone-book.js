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
    if (find(phone).length > 0) {
        return false;
    }

    return update(phone, name, email);
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
    return notEmptyString(phone) && /^\d{10}$/.test(phone) &&
        notEmptyString(name) &&
        (email === undefined || notEmptyString(email));
}

/**
 * Обновление записи в телефонной книге
 * @param {String} phone
 * @param {String?} name
 * @param {String?} email
 * @returns {Boolean}
 */
function update(phone, name, email) {
    if (!dataChecks(phone, name, email)) {
        return false;
    }
    phoneBook[phone] = [name, email]; // { 5551110011: ['Алексей', 'noreply@gmail.com'] }

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

    const foundEntries = find(query);
    for (let entry of foundEntries) {
        const phone = entry.split(',')[1].match(/\d(\d+)/g).join('');
        delete phoneBook[phone];
    }

    return foundEntries.length;
}

/**
 * Проверяет, является строка подстрокой хотя бы одного элемента массива
 * @param {String[]} arr
 * @param {String} query
 * @returns {Boolean}
 */
function arrayIncludes(arr, query) {
    for (let str of arr) {
        if (str !== undefined && str.includes(query)) {
            return true;
        }
    }

    return false;
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
        const searchStrings = info.concat(p);
        const formattedPhone =
            `+7 (${p.slice(0, 3)}) ${p.slice(3, 6)}-${p.slice(6, 8)}-${p.slice(8)}`;

        let resultingString = info[0] + ', ' + formattedPhone;
        if (info[1] !== undefined) { // Если почта существует, добавляем ее.
            resultingString += ', ' + info[1];
        }
        if (arrayIncludes(searchStrings, query)) {
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
    const elements = csv.split('\n');
    const parsed = [];
    for (let i of elements) {
        parsed.push(i.split(';'));
    }

    let successCount = 0;
    for (let e of parsed) {
        if (e[2] === '') {
            e[2] = undefined;
        }
        if (update(e[1], e[0], e[2])) {
            successCount++;
        }
    }

    return successCount;
}

module.exports = {
    add,
    update,
    findAndRemove,
    find,
    importFromCsv,

    isStar
};
