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
    if (!name || !checkPhone(phone) || phoneBook.has(phone)) {
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
    if (!phoneBook.has(phone) || !isString(name) || !name) {
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
    const toDeleteSize = toDelete.size;
    for (const key of toDelete.keys()) {
        phoneBook.delete(key);
    }

    return toDeleteSize;
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

    return result.sort((a, b) => a.name.localeCompare(b.name)).map(personDataToString);
}

function personDataToString(x) {
    const res = `${x.name}, ${x.phone}`;
    if (x.email) {
        return `${res}, ${x.email}`;
    }

    return res;
}
function findByQuery(query) {
    if (!query) {
        return new Map();
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
    if (checkPerson(phone, personData, query)) {
        results.set(phone, personData);
    }
}

function checkPerson(phone, personData, query) {
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
        const [name, phone, email] = csvRows[i];
        if (update(phone, name, email) || add(phone, name, email)) {
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
