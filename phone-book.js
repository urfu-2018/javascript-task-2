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

function isValidContact(param) {
    return param && typeof(param) === 'string';
}

function isValidPhone(phone) {
    return isValidContact(phone) && /^\d{10}$/.test(phone);
}

function hasPartialMatch(query, phone, name, email) {
    return phone.includes(query) || email.includes(query) ||
     name.indexOf(query) >= 0;
}

function toPhoneFormat(phone) {
    return `+7 (${phone.slice(0, 3)}) ${phone.slice(3, 6)}-${phone.slice(6, 8)}-${phone.slice(8)}`;
}

/**
 * Добавление записи в телефонную книгу
 * @param {String} phone
 * @param {String?} name
 * @param {String?} email
 * @returns {Boolean}
 */
function add(phone, name, email) {
    if (!isValidPhone(phone) || !isValidContact(name) || phoneBook.has(phone)) {
        return false;
    }
    phoneBook.set(phone, {
        name,
        email: isValidContact(email) ? email : ''
    });

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
    if (!isValidContact(name) || !isValidPhone(phone) || !phoneBook.has(phone)) {
        return false;
    }

    phoneBook.set(phone, {
        name,
        email: isValidContact(email) ? email : ''
    });

    return true;
}

/**
 * Удаление записей по запросу из телефонной книги
 * @param {String} query
 * @returns {Number}
 */
function findAndRemove(query) {
    if (!isValidContact(query)) {
        return 0;
    }
    let wereDeleted = 0;

    phoneBook.forEach((contacts, phone) => {
        const { email, name } = contacts;
        if (query === '*' || hasPartialMatch(query, phone, name, email)) {
            wereDeleted += phoneBook.delete(phone) ? 1 : 0;
        }
    });

    return wereDeleted;
}

/**
 * Поиск записей по запросу в телефонной книге
 * @param {String} query
 * @returns {String[]}
 */
function find(query) {
    if (!isValidContact(query)) {
        return [];
    }
    const data = [];

    phoneBook.forEach((contacts, phone) => {
        const email = contacts.email;
        const name = contacts.name;
        if (query === '*' || hasPartialMatch(query, phone, name, email)) {
            data.push({
                name,
                phone: toPhoneFormat(phone),
                email
            });
        }
    });

    return data
        .sort((firstContact, secondContact) => firstContact.name > secondContact.name)
        .map(contacts =>
            `${contacts.name}, ${contacts.phone}${contacts.email ? ', ' + contacts.email : ''}`);
}

/**
 * Импорт записей из csv-формата
 * @star
 * @param {String} csv
 * @returns {Number} – количество добавленных и обновленных записей
 */
function importFromCsv(csv) {
    const data = csv.split('\n');
    let countUpdatedOrAdded = 0;

    data.forEach(line => {
        const splitedLine = line.split(';');
        const name = splitedLine[0];
        const phone = splitedLine[1];
        const email = splitedLine[2];
        if (phoneBook.has(phone)) {
            countUpdatedOrAdded += update(phone, name, email) ? 1 : 0;
        } else {
            countUpdatedOrAdded += add(phone, name, email) ? 1 : 0;
        }
    });

    return countUpdatedOrAdded;
}

module.exports = {
    add,
    update,
    findAndRemove,
    find,
    importFromCsv,
    isStar
};
