'use strict';

/**
 * Сделано задание на звездочку
 * Реализован метод importFromCsv
 */
const isStar = true;

function isNonEmptyString(string) {
    return typeof(string) === 'string' && string.length > 0;
}

class Contact {
    constructor(phone, name, email) {
        this.name = name;
        this.phone = phone;
        this.email = email;
    }

    get phoneString() {
        const n = this.phone;

        return `+7 (${n.slice(0, 3)}) ${n.slice(3, 6)}-${n.slice(6, 8)}-${n.slice(8, 10)}`;
    }

    matches(query) {
        return isNonEmptyString(query) &&
            (query === '*' ||
                this.name.includes(query) ||
                this.phone.includes(query) ||
                (typeof(this.email) === 'string' && this.email.includes(query)));
    }

    toString() {
        return `${this.name}, ${this.phoneString}${this.email ? ', ' + this.email : ''}`;
    }
}

/**
 * Телефонная книга
 */
let phoneBook = new Map();

function isPhoneNumber(phone) {
    return typeof(phone) === 'string' && /^\d{10}$/.test(phone);
}

/**
 * Добавление записи в телефонную книгу
 * @param {String} phone
 * @param {String?} name
 * @param {String?} email
 * @returns {Boolean}
 */
function add(phone, name, email) {
    if (!isPhoneNumber(phone) ||
        !isNonEmptyString(name) ||
        phoneBook.get(phone) ||
        (typeof(email) !== 'string' && typeof(email) !== 'undefined')) {
        return false;
    }

    phoneBook.set(phone, new Contact(phone, name, email));

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
    const contact = phoneBook.get(phone);
    if (!contact ||
        !isNonEmptyString(name) ||
        (typeof(email) !== 'string' && typeof(email) !== 'undefined')) {
        return false;
    }

    contact.name = name;
    contact.email = email;

    return true;
}

/**
 * Удаление записей по запросу из телефонной книги
 * @param {String} query
 * @returns {Number}
 */
function findAndRemove(query) {
    const matchingContacts = findContacts(query);

    for (let i = 0; i < matchingContacts.length; i++) {
        phoneBook.delete(matchingContacts[i].phone);
    }

    return matchingContacts.length;
}

/**
 * Поиск записей по запросу в телефонной книге
 * @param {String} query
 * @returns {String[]}
 */
function find(query) {
    return findContacts(query).map(contact => contact.toString());
}

function findContacts(query) {
    if (!isNonEmptyString(query)) {
        return [];
    }

    let entries = [];
    for (let contact of phoneBook.values()) {
        if (contact.matches(query)) {
            entries.push(contact);
        }
    }

    entries.sort((a, b) => a.name.localeCompare(b.name));

    return entries;
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
    if (!isNonEmptyString(csv)) {
        return 0;
    }

    let addedEntries = 0;
    csv.split('\n').forEach(function (entry) {
        const entrySplit = entry.split(';');
        const phone = entrySplit[1];
        const name = entrySplit[0];
        const email = entrySplit[2];

        if (update(phone, name, email) || add(phone, name, email)) {
            addedEntries++;
        }
    });

    return addedEntries;
}

module.exports = {
    add,
    update,
    findAndRemove,
    find,
    importFromCsv,

    isStar
};
