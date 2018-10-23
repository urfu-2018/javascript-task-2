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

function checkArgs(phone, name, email) {
    return !(typeof(email) !== 'string' ||
        typeof(name) !== 'string' || !name ||
        typeof(phone) !== 'string' || !(/^[0-9]{10}$/.test(phone)));
}

/**
 * Добавление записи в телефонную книгу
 * @param {String} phone
 * @param {String?} name
 * @param {String?} email
 * @returns {Boolean}
 */
function add(phone, name = '', email = '') {
    if (!checkArgs(phone, name, email) || phone in phoneBook) {
        return false;
    }
    phoneBook[phone] = { name, email };

    return true;
}

/**
 * Обновление записи в телефонной книге
 * @param {String} phone
 * @param {String?} name
 * @param {String?} email
 * @returns {Boolean}
 */
function update(phone, name = '', email = '') {
    if (!checkArgs(phone, name, email) || !(phone in phoneBook)) {
        return false;
    }
    phoneBook[phone] = { name, email };

    return true;
}

/**
 * Удаление записей по запросу из телефонной книги
 * @param {String} query
 * @returns {Number}
 */
function findAndRemove(query) {
    return query === '' || typeof(query) !== 'string' ? 0 : Object.keys(phoneBook)
        .filter((record)=>[record, ...Object.values(phoneBook[record])]
            .some((rec)=>(query !== '*' ? new RegExp(query) : /.?/).test(rec)))
        .filter((item)=>delete(phoneBook[item]))
        .length;
}

/**
 * Поиск записей по запросу в телефонной книге
 * @param {String} query
 * @returns {String[]}
 */
function find(query) {
    return query === '' || typeof(query) !== 'string' ? [] : Object.keys(phoneBook)
        .filter((record)=>[record, ...Object.values(phoneBook[record])]
            .some((rec)=>(query !== '*' ? new RegExp(query) : /.?/).test(rec)))
        .sort((a, b)=>phoneBook[a].name.localeCompare(phoneBook[b].name))
        .map((rec)=>[
            phoneBook[rec].name,
            `+7 (${rec.slice(0, 3)}) ${rec.slice(3, 6)}-${rec.slice(6, 8)}-${rec.slice(8, 10)}`,
            phoneBook[rec].email]
            .reduce((a, b)=>!b ? `${a}` : `${a}, ${b}`));
}

/**
 * Импорт записей из csv-формата
 * @star
 * @param {String} csv
 * @returns {Number} – количество добавленных и обновленных записей
 */
function importFromCsv(csv) {
    return csv
        .split('\n')
        .map(e => e.split(';'))
        .map(e => [e[1], e[0], e[2]])
        .filter((args)=>(update(...args) || add(...args)))
        .length;
}

module.exports = {
    add,
    update,
    findAndRemove,
    find,
    importFromCsv,

    isStar
};
