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

function isMatchFound(query, phone, name, email) {
    if (query === '*') {
        return true;
    }

    return query && ((name.indexOf(query) >= 0 ||
        (email !== '' && email.indexOf(query) >= 0) ||
        phone.indexOf(query)) >= 0);
}

function getNote(phone) {
    let note;
    const name = phoneBook[phone].name;
    const email = phoneBook[phone].email;
    note = `${name}, ${getCorrectPhoneFormat(phone)}`;
    if (email !== '') {
        note += `, ${email}`;
    }

    return note;
}

function getCorrectPhoneFormat(phone) {
    return `+7 (${phone.slice(0, 3)}) ${phone.slice(3, 6)}-` +
        `${phone.slice(6, 8)}-${phone.slice(8, 10)}`;
}

/**
 * Добавление записи в телефонную книгу
 * @param {String} phone
 * @param {String?} name
 * @param {String?} email
 * @returns {Boolean}
 */
function add(phone, name, email) {
    if (!/^[0-9]{10}$/.test(phone) || typeof name !== 'string') {
        return false;
    }
    if (phone in phoneBook) {
        return false;
    }
    if (typeof email === 'undefined') {
        email = '';
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
function update(phone, name, email) {
    if (phoneBook.length === 0) {
        return false;
    }
    if (phone in phoneBook) {
        if (typeof name !== 'undefined') {
            phoneBook[phone].name = name;
        } else {
            return false;
        }
        if (typeof email === 'undefined') {
            email = '';
        }
        phoneBook[phone].email = email;

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
    let count = 0;
    for (const phone in phoneBook) {
        if (isMatchFound(query, phone, phoneBook[phone].name, phoneBook[phone].email)) {
            delete phoneBook[phone];
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
    let notes = [];

    for (let phone in phoneBook) {
        if (isMatchFound(query, phone, phoneBook[phone].name, phoneBook[phone].email)) {
            notes.push(getNote(phone));
        }
    }

    return notes.sort(function (a, b) {
        if (a.split(', ')[0] > b.split(', ')[0]) {
            return 1;
        }

        return 0;
    });
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
    let count = 0;
    csv = csv.split('\n');
    for (let i = 0; i < csv.length; i++) {
        let note = csv[i].split(';');
        if (update(note[1], note[0], note[2])) {
            count++;
            continue;
        }
        if (add(note[1], note[0], note[2])) {
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
