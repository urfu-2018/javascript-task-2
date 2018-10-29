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

function isValidContact(param) {
    return typeof(param) === 'string' && param.trim();
}

function hasMatches(query, phone, name, email) {
    return phone.includes(query) ||
        name.includes(query) ||
        email !== undefined && email.includes(query);
}

function isValidPhone(phone) {
    return isValidContact(phone) && /^\d{10}$/.test(phone);
}

/**
 * Добавление записи в телефонную книгу
 * @param {String} phone
 * @param {String?} name
 * @param {String?} email
 * @returns {Boolean}
 */
function add(phone, name, email) {
    if (!isValidContact(name) || !isValidPhone(phone) || phoneBook.has(phone)) {
        return false;
    }

    phoneBook.set(phone, {
        name,
        email: isValidContact(email) ? email : undefined
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
        email: isValidContact(email) ? email : undefined
    });

    return true;
}

/**
 * Удаление записей по запросу из телефонной книги
 * @param {String} query
 * @returns {Number}
 */
function findAndRemove(query) {
    let deleted = 0;

    if (!isValidContact(query)) {
        return deleted;
    }

    if (query === '*') {
        deleted = phoneBook.size;
        phoneBook.clear();
    } else {
        phoneBook.forEach((contacts, phone) => {
            const email = contacts.email;
            const name = contacts.name;

            if (hasMatches(query, phone, name, email) && phoneBook.delete(phone)) {
                deleted += 1;
            }
        });
    }

    return deleted;
}

function phoneAnotherFormat(phone) {
    const splited = phone
        .split(/(\d{3})(\d{3})(\d{2})(\d{2})/)
        .slice(1, 6);

    return `+7 (${splited[0]}) ${splited[1]}-${splited[2]}-${splited[3]}`;
}

/**
 * Поиск записей по запросу в телефонной книге
 * @param {String} query
 * @returns {String[]}
 */
function find(query) {
    const data = [];

    if (!isValidContact(query)) {
        return data;
    }

    phoneBook.forEach((contact, phone) => {
        const email = contact.email;
        const name = contact.name;

        if (query === '*' || hasMatches(query, phone, name, email)) {
            data.push({
                name,
                phone: phoneAnotherFormat(phone),
                email
            });
        }
    });

    return data
        .sort((firstContact, secondContact) =>
            firstContact.name.localeCompare(secondContact.name)
        )
        .map(contact =>
            `${contact.name}, ${contact.phone}${contact.email ? `, ${contact.email}` : ''}`
        );
}

/**
 * Импорт записей из csv-формата
 * @star
 * @param {String} csv
 * @returns {Number} – количество добавленных и обновленных записей
 */
function importFromCsv(csv) {
    return csv
        .split('\n')
        .reduce((count, line) => {
            const [name, phone, email] = line.split(';');

            if (add(phone, name, email) || update(phone, name, email)) {
                count += 1;
            }

            return count;
        }, 0);
}

module.exports = {
    add,
    update,
    findAndRemove,
    find,
    importFromCsv,

    isStar
};
