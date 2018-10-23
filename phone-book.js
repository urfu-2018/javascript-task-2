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

/**
 * Добавление записи в телефонную книгу
 * @param {String} phone
 * @param {String?} name
 * @param {String?} email
 * @returns {Boolean}
 */
function add(phone, name, email) {
    const isPhoneValid = /^\d{10}$/.test(phone);
    if (!isPhoneValid || !name) {
        return false;
    }
    const containsPhone = phoneBook.find(
        (entry) => {
            return entry.phone === phone;
        }
    );
    if (containsPhone) {
        return false;
    }

    phoneBook.push({
        phone: phone,
        name: name,
        email: email
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
    if (name === undefined || name.length === 0) {
        return false;
    }

    const found = phoneBook.find(
        (entry) => entry.phone === phone
    );
    if (found) {
        found.name = name;
        found.email = email;

        return true;
    }

    return false;
}

function findEntries(query) {
    if (query === undefined || query.length === 0) {
        return [];
    }

    if (query === '*') {
        return phoneBook.slice();
    }
    const result = phoneBook.filter(
        (entry) => {
            return entry.phone.includes(query) ||
                entry.name.includes(query) ||
                entry.email !== undefined && entry.email.includes(query);
        }
    );

    return result;
}

/**
 * Удаление записей по запросу из телефонной книги
 * @param {String} query
 * @returns {Number}
 */
function findAndRemove(query) {
    const findResult = findEntries(query);
    phoneBook = phoneBook.filter(
        (entry) => !findResult.includes(entry)
    );

    return findResult.length;
}

function formatPhone(phone) {
    return `+7 (${phone.substring(0, 3)}) ` +
        `${phone.substring(3, 6)}-` +
        `${phone.substring(6, 8)}-` +
        `${phone.substring(8, 10)}`;
}

function formatContact(contact) {
    if (contact.email) {
        return `${contact.name}, ${formatPhone(contact.phone)}, ${contact.email}`;
    }

    return `${contact.name}, ${formatPhone(contact.phone)}`;
}

/**
 * Поиск записей по запросу в телефонной книге
 * @param {String} query
 * @returns {String[]}
 */
function find(query) {
    const result = findEntries(query);
    result.sort((e1, e2) => {
        return e1.name > e2.name;
    });

    return result.map(formatContact);
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
    return csv.split('\n').map(i => {
        const parts = i.split(';');
        if (update(parts[1], parts[0], parts[2])) {
            return true;
        }

        return add(parts[1], parts[0], parts[2]);
    })
        .filter(success => success).length;
}

module.exports = {
    add,
    update,
    findAndRemove,
    find,
    importFromCsv,

    isStar
};
