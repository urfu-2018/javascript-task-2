'use strict';

/**
 * Сделано задание на звездочку
 * Реализован метод importFromCsv
 */
const isStar = true;

/**
 * Телефонная книга
 */
let phoneBook = new Map();

/**
 * Добавление записи в телефонную книгу
 * @param {String} phone
 * @param {String?} name
 * @param {String?} email
 * @returns {Boolean}
 */
function add(phone, name, email) {
    if (!checking(phone, name)) {
        return false;
    }
    if (phoneBook.get(phone) === undefined) {
        phoneBook.set(phone, [name, email]);

        // console.info(phoneBook);

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
function update(phone, name, email) {
    if (!checking(phone, name)) {
        throw new TypeError();
    }
    if (phoneBook.get(phone) !== undefined) {
        phoneBook.set(phone, [name, email]);
        // console.info(phoneBook);

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
    let res = 0;
    let iterator = phoneBook.keys();
    let size = phoneBook.size;
    for (let i = 0; i < size; i++) {
        let phone = iterator.next().value.toString();
        let name = phoneBook.get(phone)[0].toString();
        let email = '';
        if (phoneBook.get(phone)[1] !== undefined) {
            email = phoneBook.get(phone)[1].toString();
        }
        if (isIncludes([phone, name, email], query)) {
            phoneBook.delete(phone);
            res ++;
        }
    }

    return res;
}

/**
 * Поиск записей по запросу в телефонной книге
 * @param {String} query
 * @returns {String[]}
 */
function find(query) {
    if (query === '*') {
        query = '';
    }
    let res = [];
    let iterator = phoneBook.keys();
    for (let i = 0; i < phoneBook.size; i++) {
        let phone = iterator.next().value.toString();
        let name = phoneBook.get(phone)[0].toString();
        let email = '';
        if (phoneBook.get(phone)[1] !== undefined) {
            email = phoneBook.get(phone)[1].toString();
        }
        if (isIncludes([phone, name, email], query)) {
            res.push([phone, name, email]);
        }
    }

    return res;
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

function isIncludes(strings, includingString) {
    let res = false;
    for (let i = 0; i < strings.length; i++) {
        if (strings[i].includes(includingString)) {
            res = true;
        }
        if (res) {
            return res;
        }
    }

    return false;
}

function checking(phone, name) {
    const phoneRegexp = new RegExp('^[0-9]{10}$|^[0-9]{6}$');

    return ((typeof phone && typeof name) === 'string' && name.length !== 0 &&
        phoneRegexp.test(phone));
}

module.exports = {
    add,
    update,
    findAndRemove,
    find,
    importFromCsv,

    isStar
};
