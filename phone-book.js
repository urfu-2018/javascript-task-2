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

function isString(v) {
    return typeof v === 'string';
}

/**
 * Добавление записи в телефонную книгу
 * @param {String} phone
 * @param {String?} name
 * @param {String?} email
 * @returns {Boolean}
 */
function add(phone, name, email) {
    if (!isString(phone) || !isString(name) || !/^\d{10}$/.test(phone)) {
        return false;
    }
    if (phoneBook.has(phone) || name.trim().length === 0) {
        return false;
    }

    phoneBook.set(phone, { name: name, email: email });

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
    if (!isString(phone) || !isString(name) || !/^\d{10}$/.test(phone)) {
        return false;
    }
    if (/* !phoneBook.has(phone) || */ name.trim().length === 0) {
        return false;
    }

    phoneBook.set(phone, { name: name, email: email });

    return true;
}

/**
 * Удаление записей по запросу из телефонной книги
 * @param {String} query
 * @returns {Number}
 */
function findAndRemove(query) {
    const foundRecords = findRecords(query);
    foundRecords.forEach(v => phoneBook.set(v.phone, undefined));

    return foundRecords.length;
}

function recordToString(obj) {
    const a = obj.phone.slice(0, 3);
    const b = obj.phone.slice(3, 6);
    const c = obj.phone.slice(6, 8);
    const d = obj.phone.slice(8, 10);

    if (obj.email !== undefined) {
        return `${obj.name}, +7 (${a}) ${b}-${c}-${d}, ${obj.email}`;
    }

    return `${obj.name}, +7 (${a}) ${b}-${c}-${d}`;
}

function findRecords(query) {
    if (!isString(query) || query.length === 0) {
        return [];
    }

    return [...phoneBook.keys()]
        .map(k => ({ phone: k, name: phoneBook.get(k).name, email: phoneBook.get(k).email }))
        .sort((x, y) => x.name.localeCompare(y.name))
        .filter(
            k => {
                const isWildcard = query === '*';
                const isInPhone = k.phone.indexOf(query) !== -1;
                const isInName = k.name.indexOf(query) !== -1;
                const isInEmail = k.email === undefined ? false : k.email.indexOf(query) !== -1;

                return isWildcard || isInPhone || isInName || isInEmail;
            });
}

/**
 * Поиск записей по запросу в телефонной книге
 * @param {String} query
 * @returns {String[]}
 */
function find(query) {
    return findRecords(query).map(recordToString);
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
