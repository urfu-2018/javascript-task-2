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
let phoneBook = {};

/**
 * Добавление записи в телефонную книгу
 * @param {String} phone
 * @param {String?} name
 * @param {String?} email
 * @returns {Boolean}
 */
function add(phone, name, email) {
    if (name === undefined || !checkPhone(phone) || phone in phoneBook) {
        return false;
    }
    const person = {
        'name': name,
        'email': email
    };
    phoneBook[phone] = person;

    return true;
}

function checkPhone(phone) {
    if (typeof (phone) !== 'string') {
        return false;
    }

    return phoneRe.test(phone);
}

/**
 * Обновление записи в телефонной книге
 * @param {String} phone
 * @param {String?} name
 * @param {String?} email
 * @returns {Boolean}
 */
function update(phone, name, email) {
    if (!(phone in phoneBook)) {
        return false;
    }
    const person = phoneBook[phone];
    if (person !== null) {
        person.email = email;
        if (name !== null) {
            person.name = name;
        }

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
    const toDelete = findByQuery(query);
    const res = {};
    for (var key in phoneBook) {
        if (!(key in toDelete)) {
            res[key] = phoneBook[key];
        }
    }
    phoneBook = res;

    return Object.keys(toDelete).length;
}

/**
 * Поиск записей по запросу в телефонной книге
 * @param {String} query
 * @returns {String[]}
 */
function find(query) {
    const findResults = findByQuery(query);
    const result = [];
    const keys = Object.keys(findResults);
    for (var i = 0; i < keys.length; i++) {
        const key = keys[i];
        const person = {
            'phone': transformPhone(key),
            'name': findResults[key].name,
            'email': findResults[key].email
        };
        result.push(person);
    }

    return result.sort(compare).map(x => dataToString(x));
}

function compare(a, b) {
    if (a.name < b.name) {
        return -1;
    }
    if (a.name > b.name) {
        return 1;
    }

    return 0;
}

function dataToString(x) {
    const res = `${x.name}, ${x.phone}`;
    if (x.email !== undefined) {
        return `${res}, ${x.email}`;
    }

    return res;
}
function findByQuery(query) {
    if (query === '' || query === null) {
        return new Array(0);
    }
    let results;
    if (query === '*') {
        results = phoneBook;
    } else {
        results = {};
        var keys = Object.keys(phoneBook);

        for (var i = 0; i < keys.length; i++) {
            const key = keys[i];
            const x = phoneBook[key];
            checkPersonAndUpdate(x, query, results, key);
        }
    }

    return results;
}
function checkPersonAndUpdate(x, query, results, key) {
    if (checkPerson(x, query, key)) {
        results[key] = x;
    }
}

function checkPerson(x, query, key) {
    return (x.email !== undefined && x.email.includes(query)) ||
        key.includes(query) ||
        x.name.includes(query);
}

function transformPhone(phone) {
    const firstPart = phone.slice(0, 3);
    const secondPart = phone.slice(3, 6);

    return `+7 (${firstPart}) ${secondPart}-${phone.slice(6, 8)}-${phone.slice(8, 10)}`;
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
        if (update(phone, row[0], row[2]) ||
            add(phone, row[0], row[2])) {
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
