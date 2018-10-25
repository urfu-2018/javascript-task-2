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

function isPhoneValid(phone) {
    if (typeof phone !== 'undefined') {
        return /^\d{10}$/.test(phone);
    }

    return false;
}

function getContacts(query) {
    if (query === '') {
        return [];
    }
    const users = [];
    const isUniQuery = query === '*';
    phoneBook.forEach((info, phone) => {

        if (isUniQuery || info.name.includes(query) ||
            (typeof info.email === 'string' && info.email.includes(query)) ||
            phone.includes(query)) {
            users.push({ name: info.name, phone, email: info.email });
        }
    });

    return users;
}

/**
 * Добавление записи в телефонную книгу
 * @param {String} phone
 * @param {String?} name
 * @param {String?} email
 * @returns {Boolean}
 */
function add(phone, name, email) {
    const hasName = Boolean(name);
    if (isPhoneValid(phone) && hasName && !phoneBook.has(phone)) {
        phoneBook.set(phone, { name: name, email: email });

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
function update(phone, name, email) {
    const person = phoneBook.get(phone);
    if (typeof person === 'undefined' || typeof name === 'undefined') {
        return false;
    }
    person.name = name;
    person.email = email;

    return true;
}

/**
 * Удаление записей по запросу из телефонной книги
 * @param {String} query
 * @returns {Number}
 */
function findAndRemove(query) {
    const users = getContacts(query);
    users.forEach(e => phoneBook.delete(e.phone));

    return users.length;
}

/**
 * Поиск записей по запросу в телефонной книге
 * @param {String} query
 * @returns {String[]}
 */
function find(query) {
    const users = getContacts(query);

    users.sort(function (a, b) {
        if (a.name > b.name) {
            return 1;
        }
        if (a.name < b.name) {
            return -1;
        }

        return 0;
    });

    return users.map(function (value) {
        const phone = value.phone;
        const phoneInFormat =
            `+7 (${phone.slice(0, 3)}) ${phone.slice(3, 6)}-${phone.slice(6, 8)}-${phone.slice(8)}`;
        const result = `${value.name}, ${phoneInFormat}`;
        if (value.email) {
            return `${result}, ${value.email}`;
        }

        return result;
    });
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

    const users = csv.split('\n');
    let count = 0;
    users.forEach(function (user) {
        const args = user.split(';');
        const name = args[0];
        const phone = args[1];
        const email = args[2];

        if (add(phone, name, email) || update(phone, name, email)) {
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
