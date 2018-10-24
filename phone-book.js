'use strict';

/**
 * Сделано задание на звездочку
 * Реализован метод importFromCsv
 */
const isStar = true;


const phoneBook = {};


const PHONE_RE = /^(\d{3})(\d{3})(\d{2})(\d{2})$/;


function isValidContact(phone, name) {
    return name && PHONE_RE.test(phone);
}


function addToContactByPredicate(phone, name, email, predicate) {
    if (!predicate(phone, name, email)) {
        return false;
    }

    phoneBook[phone] = { name, email };

    return true;
}

/**
 * Добавление записи в телефонную книгу
 * @param {String} phone
 * @param {String?} name
 * @param {String?} email
 * @returns {Boolean}
 */
function add(phone, name, email) {
    return addToContactByPredicate(phone, name, email,
        (p, n) => isValidContact(p, n) && !phoneBook.hasOwnProperty(p));
}

/**
 * Обновление записи в телефонной книге
 * @param {String} phone
 * @param {String?} name
 * @param {String?} email
 * @returns {Boolean}
 */
function update(phone, name, email) {
    return addToContactByPredicate(phone, name, email, (p, n) => n && phoneBook.hasOwnProperty(p));
}

function findContacts(query) {
    if (!query) {
        return [];
    }

    return Object.entries(phoneBook)
        .map(e => [e[0], e[1].name, e[1].email])
        .filter(e => query === '*' || e.some(q => q && q.includes(query)));
}

/**
 * Удаление записей по запросу из телефонной книги
 * @param {String} query
 * @returns {Number}
 */
function findAndRemove(query) {
    return findContacts(query)
        .filter(k => delete phoneBook[k])
        .length;
}

/**
 * Поиск записей по запросу в телефонной книге
 * @param {String} query
 * @returns {String[]}
 */
function find(query) {
    return findContacts(query)
        .sort((a, b) => a[1].localeCompare(b[1]))
        .map(e => {
            const [phone, name, email] = e;
            const phoneParts = PHONE_RE.exec(phone);
            const formattedPhone = `+7 (${phoneParts[1]}) ${phoneParts.slice(2, 5).join('-')}`;

            return `${name}, ${formattedPhone}${email ? ', ' + email : ''}`;
        });
}

/**
 * Импорт записей из csv-формата
 * @star
 * @param {String} csv
 * @returns {Number} – количество добавленных и обновленных записей
 */
function importFromCsv(csv) {
    return csv.split('\n')
        .map(l => {
            const parts = l.split(';');

            return [parts[1], parts[0], parts[2]];
        })
        .filter(e => addToContactByPredicate(...e, isValidContact))
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
