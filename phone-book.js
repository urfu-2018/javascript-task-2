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

function isCurrectPhone(phone) {
    return typeof phone === 'string' && /^\d{10}$/.test(phone);
}

function isCurrectName(name) {
    return typeof name === 'string' && name !== '';
}

/**
 * Добавление записи в телефонную книгу
 * @param {String} phone
 * @param {String?} name
 * @param {String?} email
 * @returns {Boolean}
 */
function add(phone, name, email) {
    if (!isCurrectPhone(phone) || !isCurrectName(name) || phoneBook.has(phone)) {
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
    if (!isCurrectPhone(phone) || !isCurrectName(name) || !phoneBook.has(phone)) {
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
    const neededEntries = search(query);
    neededEntries.forEach(entry => {
        phoneBook.delete(entry[1]);
    });

    return neededEntries.length;
}

function phoneBookToArray() {
    return Array.from(phoneBook).map(entry => {
        if (typeof entry[1].email === 'undefined') {
            return [entry[1].name, entry[0]];
        }

        return [entry[1].name, entry[0], entry[1].email];
    });
}

function search(query) {
    const phoneBookArray = phoneBookToArray();

    if (query === '*') {
        return phoneBookArray;
    }

    return phoneBookArray.reduce((acc, entry) => {
        for (let i = 0; i < entry.length; i++) {
            if (entry[i].includes(query)) {
                acc.push(entry);
                break;
            }
        }

        return acc;
    }, []);
}

function entriesToStringArray(entries) {
    return entries.sort((a, b) => a[0].localeCompare(b[0]))
        .map(entry => {
            if (entry[2]) {
                return `${entry[0]}, ${transformPhone(entry[1])}, ${entry[2]}`;
            }

            return `${entry[0]}, ${transformPhone(entry[1])}`;
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
    if (typeof query !== 'string') {
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
    let counter = 0;
    entriesArray.forEach(entry => {
        const parametrsArray = entry.split(';');
        if (isCurrectName(parametrsArray[0]) && isCurrectPhone(parametrsArray[1])) {
            if (phoneBook.has(parametrsArray[1])) {
                update(parametrsArray[1], parametrsArray[0], parametrsArray[2]);
            } else {
                add(parametrsArray[1], parametrsArray[0], parametrsArray[2]);
            }
            counter++;
        }
    });

    return counter;
}

module.exports = {
    add,
    update,
    findAndRemove,
    find,
    importFromCsv,

    isStar
};
