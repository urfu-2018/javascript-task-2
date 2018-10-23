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

function isPhoneValid(phone) {
    if (typeof phone !== 'undefined') {
        return phone.match(/^\d{10}$/);
    }

    return false;
}

function getUsers(query) {
    if (query === '') {
        return [];
    }
    const users = [];
    const isUniQuery = query === '*';
    phoneBook.forEach((v, k) => {
        const emailResult = typeof v.email === 'undefined' ? false : v.email.includes(query);

        if (isUniQuery || v.name.includes(query) || emailResult || k.includes(query)) {
            users.push({ name: v.name, phone: k, email: v.email });
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
    const hasName = typeof name !== 'undefined' && name !== '';
    email = email === '' ? undefined : email;
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
    person.name = (name === '') ? person.name : name;
    person.email = email === '' ? undefined : email;

    return true;
}

/**
 * Удаление записей по запросу из телефонной книги
 * @param {String} query
 * @returns {Number}
 */
function findAndRemove(query) {
    const users = getUsers(query);
    users.forEach(e => phoneBook.delete(e.phone));

    return users.length;
}

/**
 * Поиск записей по запросу в телефонной книге
 * @param {String} query
 * @returns {String[]}
 */
function find(query) {
    const users = getUsers(query);

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
        const p = value.phone;
        const phone = `+7 (${p.slice(0, 3)}) ${p.slice(3, 6)}-${p.slice(6, 8)}-${p.slice(8)}`;
        const result = `${value.name}, ${phone}`;
        if (typeof value.email !== 'undefined') {
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
