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
function add(phone, name, email) {
    if (!phone.match(/^\d{10}$/)) {
        return false;
    }

    if (phoneBook.has(phone)) {
        return false;
    }

    if (typeof name !== 'string' || !name) {
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
    if (!phoneBook.has(phone)) {
        return false;
    }

    if (typeof name !== 'string' || !name) {
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
    const phones = findPhones(query);
    phones.forEach(phone => {
        phoneBook.delete(phone);
    });

    return phones.length;
}

function findPhones(query) {

    if (query === '*') {
        return [...phoneBook.keys()];
    }

    if (query === '') {
        return [];
    }

    return [...phoneBook.keys()]
        .filter(phone => {
            if (phone.includes(query)) {
                return true;
            }
            const phoneRecord = phoneBook.get(phone);

            return phoneRecord.name.includes(query) ||
                (phoneRecord.email !== undefined && phoneRecord.email.includes(query));
        });
}

/**
 * Поиск записей по запросу в телефонной книге
 * @param {String} query
 * @returns {String[]}
 */
function find(query) {
    const transformPhone = phone => `+7 (${phone.substr(0, 3)}) ` +
        `${phone.substr(3, 3)}-${phone.substr(6, 2)}-${phone.substr(8, 2)}`;

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
            .filter(field => field !== undefined)
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
            const arr = record.split(';');
            if (add(arr[1], arr[0], arr[2]) || update(arr[1], arr[0], arr[2])) {
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
