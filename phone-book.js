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
function checkPhone(phone) {
    return (/^\d{10}$/.test(phone) && typeof(phone) === 'string');
}

function checkName(name) {
    return (typeof(name) === 'string' && name !== undefined);
}

function add(phone, name, email) {
    if (!checkPhone(phone) || !checkName(name) || phoneBook.has(phone)) {
        return false;
    }
    phoneBook.set(phone,
        {
            phone: phone,
            name: name,
            email: email });

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
    if (!checkPhone(phone) || !checkName(name) || !phoneBook.has(phone)) {
        return false;
    }
    phoneBook.set(phone,
        {
            phone: phone,
            name: name,
            email: email });

    return true;
}

/**
 * Удаление записей по запросу из телефонной книги
 * @param {String} query
 * @returns {Number}
 */

function findAndRemove(query) {
    if (!query) {
        return 0;
    }
    let arrayWithDate = find(query);
    for (let i of arrayWithDate) {
        let phone = i.split(', ');
        phone = phone[1].replace(/[+7() -]/g, '');
        phoneBook.delete(phone);
    }

    return arrayWithDate.length;
}

/**
 * Поиск записей по запросу в телефонной книге
 * @param {String} query
 * @returns {String[]}
 */

function find(query) {
    let arrayWithDate = phoneBookToArray();
    if (query === '*') {
        return arrayWithDate.sort((a, b) => a[0].localeCompare(b[0]));
    } else if (!query || query === ' ') {

        return [];
    }

    return arrayWithDate.filter((e) =>
        e.indexOf(query) !== -1).sort((a, b) => a[0].localeCompare(b[0]));
}

function phoneBookToArray() {
    let arrayWithDate = [];
    for (let value of phoneBook.values()) {
        if (value.email === undefined) {
            let strWithContact = value.name + ', ' +
        value.phone.replace(value.phone, formatPhone(value.phone));
            arrayWithDate.push(strWithContact);
        } else {
            let strWithContact = value.name + ', ' +
        value.phone.replace(value.phone, formatPhone(value.phone)) + ', ' + value.email;
            arrayWithDate.push(strWithContact);
        }
    }

    return arrayWithDate;
}

function formatPhone(phone) {
    return ('+7 (' + phone.slice(0, 3) + ') ' + phone.slice(3, 6) + '-' + phone.slice(6, 8) +
    '-' + phone.slice(8, 10));
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
    let allContacts = csv.split('\n');
    let count = 0;
    for (let i = 0; i < allContacts.length; i++) {
        let contact = allContacts[i].split(';');
        if (add(contact[1], contact[0], contact[2]) || update(contact[1], contact[0], contact[2])) {
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
