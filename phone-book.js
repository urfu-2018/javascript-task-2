'use strict';

/**
 * Сделано задание на звездочку
 * Реализован метод importFromCsv
 */
const isStar = true;

/**
 * Телефонная книга
 */
const phoneBook = {};

function phoneIsCorrect(phone) {
    return /^[0-9]{10}$/.test(phone);
}

/**
 * Добавление записи в телефонную книгу
 * @param {String} phone
 * @param {String?} name
 * @param {String?} email
 * @returns {Boolean}
 */
function add(phone, name = '', email = '') {
    name = name.trim();
    email = email.trim();
    if (phoneIsCorrect(phone) && !phoneBook[phone] && name.length) {
        phoneBook[phone] = { 'name': name, 'email': email };

        return true;
    }

    return false;
}

/**
 * Обновление записи в телефонной книге
 * @param {String} phone
 * @param {String?} name
 * @param {String?} email
 * @returns {Boolean}
 */
function update(phone, name = '', email = '') {
    name = name.trim();
    email = email.trim();
    if (phoneIsCorrect(phone) && phoneBook[phone] && name.length) {
        phoneBook[phone] = { 'name': name, 'email': email };

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
    const phones = find(query).map(([phone]) => phone);
    phones.forEach(phone => delete phoneBook[phone]);

    return phones.length;
}

function formatPhone(phone) {
    return `+7 (${phone.slice(0, 3)}) ${phone.slice(3, 6)}-${phone.slice(6, 8)}-${phone.slice(-2)}`;
}


function checkRegExp(str) {
    return str.replace(/[.?*+^$[\]\\(){}|-]/g, '\\$&');
}

function getRegex(query) {
    if (!query.length) {
        return { test: () => false };
    }
    if (query === '*') {
        return { test: () => true };
    }

    return new RegExp(checkRegExp(query));
}

function findFormatted(query) {
    return find(query)
        .map(([phone, user]) => [formatPhone(phone), user])
        .map(([phone, user]) => `${user.name}, ${phone}${user.email ? ', ' + user.email : ''}`)
        .sort();
}

/**
 * Поиск записей по запросу в телефонной книге
 * @param {String} query
 * @returns {String[]}
 */
function find(query) {
    const re = getRegex(query);

    return Object.entries(phoneBook)
        .filter(([phone, user]) => re.test(phone) || re.test(user.name) || re.test(user.email));
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
    const records = csv.split('\n');
    let validRecords = 0;
    for (let i = 0; i < records.length; i++) {
        const [name, phone, email] = records[i].split(';');
        if (add(phone, name, email) || update(phone, name, email)) {
            validRecords ++;
        }
    }

    return validRecords;
}

module.exports = {
    add,
    update,
    findAndRemove,
    find: findFormatted,
    importFromCsv,
    isStar
};
