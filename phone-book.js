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
    if (phoneBook.has(phone)) {
        return false;
    }
    if (name && isCorrectString(name) && /^[0-9]{10}$/.test(phone)) {
        phoneBook.set(phone, { name, phone, email });

        return true;
    }

    return false;
}

function formatNumber(phone) {
    return phone.replace(/^(\d{3})(\d{3})(\d{2})(\d{2})$/, '+7 ($1) $2-$3-$4');
}

function formatLine(line) {
    return (`${line.name}, ${formatNumber(line.phone)}${line.email ? `, ${line.email}` : ''}`);
}

function phoneIsCorrect(phone) {
    return phone && typeof phone === 'string' && /^[0-9]{10}$/.test(phone);
}

function isCorrectString(str) {
    return str && typeof str === 'string' && str.length > 0;
}

function correctData(phone, name, email) {
    return isCorrectString(name) && phoneIsCorrect(phone) &&
        (!email || isCorrectString(email));
}

/**
 * Обновление записи в телефонной книге
 * @param {String} phone
 * @param {String?} name
 * @param {String?} email
 * @returns {Boolean}
 */
function update(phone, name, email) {
    correctData(phone, name, email);
    if (correctData(phone, name, email) && phoneBook.has(phone)) {
        phoneBook.set(phone, { name: name, phone: phone, email: email });

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
    if (typeof query !== 'string' || !query) {
        return 0;
    }
    let count = 0;
    for (var [key, value] of phoneBook.entries()) {
        if (query === '*' || findInLine(value, query)) {
            phoneBook.delete(key);
            count++;
        }
    }

    return count;
}

function findInLine(line, query) {
    return line.phone.indexOf(query) > -1 || line.name.indexOf(query) > -1 ||
        (line.email && line.email.indexOf(query) > -1);
}

/**
 * Поиск записей по запросу в телефонной книге
 * @param {String} query
 * @returns {String[]}
 */
function find(query) {
    if (typeof query !== 'string' || !query) {
        return [];
    }
    const res = [];
    for (var value of phoneBook.values()) {
        if (query === '*' || findInLine(value, query)) {
            res.push(value);
        }
    }

    return res.map(x => formatLine(x)).sort();
}

/**
 * Импорт записей из csv-формата
 * @star
 * @param {String} csv
 * @returns {Number} – количество добавленных и обновленных записей
 */
function importFromCsv(csv) {
    const data = csv.split('\n');
    let count = 0;

    data.forEach(line => {
        let splitedLine = line.split(';');
        splitedLine = [splitedLine[1], splitedLine[0], splitedLine[2]];
        count += add(...splitedLine) || update(...splitedLine);
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
