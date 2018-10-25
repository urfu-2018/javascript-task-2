'use strict';

/**
 * Сделано задание на звездочку
 * Реализован метод importFromCsv
 */
const isStar = true;
const phoneRe = new RegExp('^[0-9]{10}$');

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
    if (Boolean(name) === false || !checkPhone(phone) ||
        phoneBook.has(phone) || !isString(name)) {
        return false;
    }
    phoneBook.set(phone, { name, email });

    return true;
}

function isString(obj) {
    return typeof obj === 'string';
}


function checkPhone(phone) {
    return isString(phone) && phoneRe.test(phone);
}

/**
 * Обновление записи в телефонной книге
 * @param {String} phone
 * @param {String?} name
 * @param {String?} email
 * @returns {Boolean}
 */
function update(phone, name, email) {
    if (!phoneBook.has(phone) || !isString(name) || Boolean(name) === false) {
        return false;
    }
    phoneBook.set(phone, { name, email });

    return true;
}

/**
 * Удаление записей по запросу из телефонной книги
 * @param {String} query
 * @returns {Number}
 */
function findAndRemove(query) {
    const toDelete = findByQuery(query);
    for (const key of toDelete.keys()) {
        phoneBook.delete(key);
    }


    return toDelete.size;
}

/**
 * Поиск записей по запросу в телефонной книге
 * @param {String} query
 * @returns {String[]}
 */
function find(query) {
    const findResults = findByQuery(query);
    const result = [];
    for (const phone of findResults.keys()) {
        const person = {
            'phone': transformPhone(phone),
            'name': findResults.get(phone).name,
            'email': findResults.get(phone).email
        };
        result.push(person);
    }

    return result.sort((a, b) => a.name.localeCompare(b.name)).map(x => dataToString(x));
}

function dataToString(x) {
    const res = `${x.name}, ${x.phone}`;
    if (x.email !== undefined) {
        return `${res}, ${x.email}`;
    }

    return res;
}
function findByQuery(query) {
    if (Boolean(query) === false || !isString(query)) {
        return [];
    }
    if (query === '*') {
        return phoneBook;
    }
    const results = new Map();
    for (const phone of phoneBook.keys()) {
        tryFindMatchAndUpdate(query, results, phone);
    }

    return results;
}
function tryFindMatchAndUpdate(query, results, phone) {
    const personData = phoneBook.get(phone);
    if (checkPerson(personData, query, phone)) {
        results.set(phone, personData);
    }
}

function checkPerson(personData, query, phone) {
    return (Boolean(personData.email) && personData.email.includes(query)) ||
        phone.includes(query) || personData.name.includes(query);
}

function transformPhone(phone) {
    return `+7 (${phone.slice(0, 3)}) ${phone.slice(3, 6)}\
-${phone.slice(6, 8)}-${phone.slice(8, 10)}`;
}

/**
 * Импорт записей из csv-формата
 * @star
 * @param {String} csv
 * @returns {Number} – количество добавленных и обновленных записей
*/
function importFromCsv(csv) {
    const csvRows = csv.split('\n').map(x => x.split(';'));
    let result = 0;
    for (var i = 0; i < csvRows.length; i++) {
        const row = csvRows[i];
        const phone = row[1];
        const name = row[0];
        const email = row[2];
        if (update(phone, name, email) ||
            add(phone, name, email)) {
            result += 1;
        }
    }

    return result;
}

module.exports = {
    add,
    update,
    findAndRemove,
    find,

    importFromCsv,

    isStar
};
