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

function containsPhone(phone) {
    return phoneBook.filter(contact => contact.phone === phone).length > 0;
}

function checkParamters(phone, name) {
    return !/^\d{10}$/.test(phone) || typeof name !== 'string' ||
        typeof phone !== 'string' || name === '';
}

/**
 * Добавление записи в телефонную книгу
 * @param {String} phone
 * @param {String?} name
 * @param {String?} email
 * @returns {Boolean}
 */
function add(phone, name, email) {
    if (checkParamters(phone, name) || containsPhone(phone)) {
        return false;
    }

    if (typeof email === 'undefined') {
        phoneBook.push({ phone, name });
    } else {
        phoneBook.push({ phone, name, email });
    }

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
    if (checkParamters(phone, name)) {
        return false;
    }

    for (let i = 0; i < phoneBook.length; i++) {
        if (phoneBook[i].phone === phone) {
            phoneBook[i].name = name;
            phoneBook[i].email = email;

            return true;
        }
    }

    return false;
}

/**
 * Удаление записей по запросу из телефонной книги
 * @param {String} query
 * @returns {Number}
 */
function findAndRemove(query) {
    if (typeof query !== 'string') {
        return 0;
    }

    const contacts = find(query);

    if (contacts.length !== 0) {
        phoneBook = phoneBook.filter(contact => !contacts.includes(contact));

        return contacts.length;
    }

    return 0;
}

function makeNewFormatPhone(phone) {
    return `+7 (${phone.substring(0, 3)}) ${phone.substring(3, 6)}-${phone.substring(6, 8)}` +
        `-${phone.substring(8)}`;
}

function returnAllBook() {
    const res = [];

    for (let i = 0; i < phoneBook.length; i++) {
        const oldPhone = phoneBook[i].phone;
        const newPhone = makeNewFormatPhone(oldPhone);

        if (typeof phoneBook[i].email !== 'undefined') {
            res.push(`${phoneBook[i].name}, ${newPhone}, ${phoneBook[i].email}`);
        } else {
            res.push(`${phoneBook[i].name}, ${newPhone}`);
        }
    }

    return res.sort();
}

function findElement(query) {
    const res = [];

    for (let i = 0; i < phoneBook.length; i++) {
        const newPhone = makeNewFormatPhone(phoneBook[i].phone);
        const phone = `${phoneBook[i].phone} ${phoneBook[i].name} ${phoneBook[i].email}`;

        if (phone.indexOf(query) > -1 && typeof phoneBook[i].email !== 'undefined') {
            res.push(`${phoneBook[i].name}, ${newPhone}, ${phoneBook[i].email}`);
        } else if (phone.indexOf(query) > -1) {
            res.push(`${phoneBook[i].name}, ${newPhone}`);
        }
    }

    return res.sort();
}

/**
 * Поиск записей по запросу в телефонной книге
 * @param {String} query
 * @returns {String[]}
 */
function find(query) {
    if (query === '*') {
        return returnAllBook();
    }

    if (query === '' || typeof query !== 'string') {
        return [];
    }

    return findElement(query);
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
    if (typeof csv !== 'string') {
        return 0;
    }

    const contact = csv.replace(/;/g, ' ').split('\n');
    let count = 0;

    for (let i = 0; i < contact.length; i++) {
        const temp = contact[i].split(' ');
        const data = {
            phone: temp[1],
            name: temp[0],
            email: temp[2]
        };

        if (add(data.phone, data.name, data.email) ||
            update(data.phone, data.name, data.email)) {
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
