'use strict';

/**
 * Сделано задание на звездочку
 * Реализован метод importFromCsv
 */
const isStar = true;

/**
 * Телефонная книга
 */
let phoneBook = [];
const regextel = /^\d{10}$/;

function check(phone, name) {
    return (name && phone && phone.match(regextel));
}

/**
 * Добавление записи в телефонную книгу
 * @param {String} phone
 * @param {String?} name
 * @param {String?} email
 * @returns {Boolean}
 */

function add(phone, name, email) {
    let record;
    if (!check(phone, name) || phoneBook.some(phones=>phones.phone === phone)) {
        return false;
    }
    if (email !== undefined) {
        record = { name, phone, email };
    } else {
        record = { name, phone };
    }
    phoneBook.push(record);

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
    let searchResult = phoneBook.find(x => x.phone === phone);
    if (!check(phone, name) || searchResult === undefined) {
        return false;
    }
    if (email !== undefined) {
        phoneBook[phoneBook.indexOf(searchResult)] = { name, phone, email };
    } else {
        phoneBook[phoneBook.indexOf(searchResult)] = { name, phone };
    }

    return true;
}

function searchString(query) {
    let result = phoneBook.filter(function (record) {
        if (record.hasOwnProperty('email')) {
            return (record.phone.includes(query)) ||
            (record.name.includes(query)) ||
            (record.email.includes(query));
        }

        return (record.phone.includes(query) ||
    record.name.includes(query));
    }).sort(function (a, b) {
        return a.name.localeCompare(b.name);
    });

    return result;
}

/**
 * Удаление записей по запросу из телефонной книги
 * @param {String} query
 * @returns {Number}
 */
function findAndRemove(query) {
    let firstLength = phoneBook.length;
    if (!query) {
        return 0;
    }
    if (query === '*') {
        query = '';
    }
    let search = searchString(query);
    phoneBook = phoneBook.filter(function (record) {
        return !search.includes(record);
    });

    return firstLength - phoneBook.length;
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
    if (query === '*') {
        query = '';
    }
    let search = searchString(query);
    let resultat = search.map(function (record) {
        let firstThree = record.phone.slice(0, 3);
        let secThree = record.phone.slice(3, 6);
        let firstTwo = record.phone.slice(6, 8);
        let secTwo = record.phone.slice(8, 10);

        let telprob = `+7 (${firstThree}) ${secThree}-${firstTwo}-${secTwo}`;
        let resulstr = [record.name, telprob];
        if (record.email !== undefined) {
            resulstr.push(record.email);

            return (resulstr.join(', '));
        }

        return resulstr.join(', ');
    });

    return resultat;
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
    let records = csv.split('\n');
    let count = 0;
    for (let i = 0; i < records.length; i++) {
        let record = records[i].split(';');
        if (add(record[1], record[0], record[2]) || update(record[1], record[0], record[2])) {
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
