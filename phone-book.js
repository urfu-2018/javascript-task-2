'use strict';

/**
 * Сделано задание на звездочку
 * Реализован метод importFromCsv
 */
const isStar = true;

/**
 * Телефонная книга
 */
const phoneBook = new Map();

/**
 * Добавление записи в телефонную книгу
 * @param {String} phone
 * @param {String?} name
 * @param {String?} email
 * @returns {Boolean}
 */
function checkPhone(phone) {
    return /^\d{10}$/.test(phone) && typeof(phone) === 'string';
}

function checkName(name) {
    return typeof(name) === 'string' && name;
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
            phone,
            name,
            email });

    return true;
}

/**
 * Удаление записей по запросу из телефонной книги
 * @param {String} query
 * @returns {Number}
 */

function findAndRemove(query) {
    if (!query) {
        return [];
    }

    const arrayWithDate = find(query);
    arrayWithDate.forEach(entry => phoneBook.delete(entry[1]));

    return arrayWithDate.length;
}

/**
 * Поиск записей по запросу в телефонной книге
 * @param {String} query
 * @returns {String[]}
 */

function find(query) {
    if (!query) {
        return [];
    }

    const arrayWithDate = search(query).sort((a, b) => a[0].localeCompare(b[0]));

    return formatArray(arrayWithDate);
}

function formatArray(entries) {
    return entries.map(entry => {
        const [name, phone, email] = entry;
        if (entry.length === 3) {
            return `${name}, ${formatPhone(phone)}, ${email}`;
        }

        return `${name}, ${formatPhone(phone)}`;
    });
}

function search(query) {
    let arrayWithDate = phoneBookToArray();

    if (query === '*') {
        return arrayWithDate;
    }

    return arrayWithDate.filter(entry => {

        return entry.some(element => element.includes(query));
    });
}

function phoneBookToArray() {
    const arrayWithDate = [];
    for (let value of phoneBook.values()) {
        if (typeof value.email === 'undefined') {
            arrayWithDate.push([value.name, value.phone]);
        } else {
            arrayWithDate.push([value.name, value.phone, value.email]);
        }
    }

    return arrayWithDate;
}

function formatPhone(phone) {
    return `+7 (${phone.slice(0, 3)}) ${phone.slice(3, 6)}-${phone.slice(6, 8)}-${phone.slice(8)}`;
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
        const [name, phone, email] = allContacts[i].split(';');
        if (add(phone, name, email) || update(phone, name, email)) {
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
