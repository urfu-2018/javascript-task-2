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

function isCorrectPhone(phone) {
    return typeof phone === 'string' && /^\d{10}$/.test(phone);
}

function isCorrectName(name) {
    return typeof name === 'string' && name;
}

/**
 * Добавление записи в телефонную книгу
 * @param {String} phone
 * @param {String?} name
 * @param {String?} email
 * @returns {Boolean}
 */
function add(phone, name, email) {
    if (!isCorrectPhone(phone) || !isCorrectName(name) || phoneBook.has(phone)) {
        return false;
    }

    phoneBook.set(phone, {
        name,
        email
    });

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
    if (!isCorrectPhone(phone) || !isCorrectName(name) || !phoneBook.has(phone)) {
        return false;
    }

    phoneBook.set(phone, {
        name,
        email
    });

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

    const neededEntries = search(query);
    neededEntries.forEach(entry => {
        phoneBook.delete(entry[1]);
    });

    return neededEntries.length;
}

function phoneBookToArray() {
    return Array.from(phoneBook).map(entry => {
        if (typeof entry[1].email === 'undefined') {
            return [entry[1].name, transformPhone(entry[0])];
        }

        return [entry[1].name, transformPhone(entry[0]), entry[1].email];
    });
}

function search(query) {
    const phoneBookArray = phoneBookToArray();

    if (query === '*') {
        return phoneBookArray;
    }

    return phoneBookArray.filter(entry => {
        return entry.some(element => element.includes(query));
    });
}

function entriesToStringArray(entries) {
    return entries.sort((entry1, entry2) => entry1[0].localeCompare(entry2[0]))
        .map(entry => {
            return entry.join(', ');
        });
}

function transformPhone(phone) {
    return `+7 (${phone.slice(0, 3)}) ${phone.slice(3, 6)}-${phone.slice(6, 8)}-${phone.slice(8)}`;
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

    return entriesToStringArray(search(query));
}

/**
 * Импорт записей из csv-формата
 * @star
 * @param {String} csv
 * @returns {Number} – количество добавленных и обновленных записей
 */
function importFromCsv(csv) {
    const entriesArray = csv.split('\n');

    return entriesArray.reduce((acc, entry) => {
        const [name, phone, email] = entry.split(';');
        if (update(phone, name, email) || add(phone, name, email)) {
            acc++;
        }

        return acc;
    }, 0);
}

module.exports = {
    add,
    update,
    findAndRemove,
    find,
    importFromCsv,

    isStar
};
