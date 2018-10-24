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
function add(phone, name, email) {
    if (!isDataValid(phone, name)) {
        return false;
    }

    if (phoneBook.has(phone)) {
        return false;
    }

    phoneBook.set(phone, { name, email });

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
    if (!isDataValid(phone, name)) {
        return false;
    }

    if (!phoneBook.has(phone)) {
        return false;
    }

    phoneBook.set(phone, { name, email });

    return true;
}

function isDataValid(phone, name) {
    if (!phone || !name) {
        return false;
    }

    return phone.match(/^\d{10}$/);
}

/**
 * Удаление записей по запросу из телефонной книги
 * @param {String} query
 * @returns {Number}
 */
function findAndRemove(query) {
    const phones = findPhones(query);
    phones.forEach(phone => {
        phoneBook.delete(phone);
    });

    return phones.length;
}

function findPhones(query) {
    if (query === '*') {
        return Array.from(phoneBook.keys());
    }

    if (query === '') {
        return [];
    }

    return Array.from(phoneBook.entries())
        .filter(([phone, record]) => {

            return phone.includes(query) || record.name.includes(query) ||
                (record.email !== undefined && record.email.includes(query));
        })
        .map(entry => entry[0]);
}

function transformPhone(phone) {
    return `+7 (${phone.substr(0, 3)}) ` +
        `${phone.substr(3, 3)}-${phone.substr(6, 2)}-${phone.substr(8, 2)}`;
}

/**
 * Поиск записей по запросу в телефонной книге
 * @param {String} query
 * @returns {String[]}
 */
function find(query) {

    return findPhones(query)
        .sort((firstPhone, secondPhone) => {
            const firstRecord = phoneBook.get(firstPhone);
            const secondRecord = phoneBook.get(secondPhone);

            return firstRecord.name.localeCompare(secondRecord.name);
        })
        .map(phone => [
            phoneBook.get(phone).name,
            transformPhone(phone),
            phoneBook.get(phone).email
        ]
            .filter(Boolean)
            .join(', '));
}

/**
 * Импорт записей из csv-формата
 * @star
 * @param {String} csv
 * @returns {Number} – количество добавленных и обновленных записей
 */
function importFromCsv(csv) {
    let count = 0;
    csv.split('\n')
        .forEach(record => {
            const fields = record.split(';');
            if (add(fields[1], fields[0], fields[2]) || update(fields[1], fields[0], fields[2])) {
                count++;
            }
        });

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
