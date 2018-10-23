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
    return !(email !== undefined && typeof(email) !== 'string' ||
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
function add(phone, name, email) {
    return (!(!checkArgs(phone, name, email) || phoneBook[phone]) &&
        (phoneBook[phone] = { name, email }));
}

/**
 * Обновление записи в телефонной книге
 * @param {String} phone
 * @param {String?} name
 * @param {String?} email
 * @returns {Boolean}
 */
function update(phone, name, email) {
    return (!(!checkArgs(phone, name, email) || !phoneBook[phone]) &&
        (phoneBook[phone] = { name, email }));
}

/**
 * Удаление записей по запросу из телефонной книги
 * @param {String} query
 * @returns {Number}
 */
function findAndRemove(query) {
    return query === '' ? 0 : Object.keys(phoneBook)
        .filter((record)=>[record].concat(Object.values(phoneBook[record]))
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
    let formatPhone = (phone)=>
        `+7 (${phone
            .slice(0, 3)}) ${phone
            .slice(3, 6)}-${phone
            .slice(6, 8)}-${phone
            .slice(8, 10)}`;

    return query === '' ? [] : Object.keys(phoneBook)
        .filter((record)=>[record].concat(Object.values(phoneBook[record]))
            .some((rec)=>(query !== '*' ? new RegExp(query) : /.?/).test(rec)))
        .sort((a, b)=>phoneBook[a].name > phoneBook[b].name)
        .map((record)=>[phoneBook[record].name, formatPhone(record), phoneBook[record].email]
            .reduce((a, b)=>b === undefined ? `${a}` : `${a}, ${b}`));
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
