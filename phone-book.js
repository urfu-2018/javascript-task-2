'use strict';

/**
 * Сделано задание на звездочку
 * Реализован метод importFromCsv
 */
const isStar = true;

function isType(object, typeName) {
    return typeof(object) === typeName;
}

function isNonEmptyString(string) {
    return isType(string, 'string') && string.length > 0;
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
        return isNonEmptyString(query) && (query === '*' ||
            this.name.includes(query) ||
            this.phone.includes(query) ||
            (isType(this.email, 'string') && this.email.includes(query)));
    }

    toString() {
        return `${this.name}, ${this.phoneString}${this.email ? ', ' + this.email : ''}`;
    }
}

/**
 * Телефонная книга
 */
let phoneBook = [];

const phonePattern = /^\d{10}$/;

function isPhoneNumber(phone) {
    return isType(phone, 'string') && phonePattern.test(phone);
}

/**
 * Добавление записи в телефонную книгу
 * @param {String} phone
 * @param {String?} name
 * @param {String?} email
 * @returns {Boolean}
 */
function add(phone, name, email) {
    if (!isPhoneNumber(phone)) {
        return false;
    }

    if (!isNonEmptyString(name)) {
        return false;
    }

    if (findByPhone(phone)) {
        return false;
    }

    if (!(isType(email, 'string') || isType(email, 'undefined'))) {
        return false;
    }

    phoneBook.push(new Contact(phone, name, email));

    return true;
}

function findByPhone(phone) {
    for (let i = 0; i < phoneBook.length; i++) {
        if (phone === phoneBook[i].phone) {
            return phoneBook[i];
        }
    }

    return null;
}

/**
 * Обновление записи в телефонной книге
 * @param {String} phone
 * @param {String?} name
 * @param {String?} email
 * @returns {Boolean}
 */
function update(phone, name, email) {
    const contact = findByPhone(phone);
    if (contact === null) {
        return false;
    }
    if (!isNonEmptyString(name)) {
        return false;
    }

    if (!(isType(email, 'string') || isType(email, 'undefined'))) {
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
    if (!isNonEmptyString(query)) {
        return 0;
    }

    let deleted = 0;
    for (let i = 0; i < phoneBook.length; i++) {
        if (phoneBook[i].matches(query)) {
            phoneBook.splice(i, 1);
            i--;
            deleted++;
        }
    }

    return deleted;
}

/**
 * Поиск записей по запросу в телефонной книге
 * @param {String} query
 * @returns {String[]}
 */
function find(query) {
    if (!isNonEmptyString(query)) {
        return [];
    }

    let entries = [];
    for (let i = 0; i < phoneBook.length; i++) {
        if (phoneBook[i].matches(query)) {
            entries.push(phoneBook[i].toString());
        }
    }
    entries.sort();

    return entries;
}

function addOrUpdate(phone, name, email) {
    if (findByPhone(phone)) {
        return update(phone, name, email);
    }

    return add(phone, name, email);
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
        if (addOrUpdate(entrySplit[1], entrySplit[0], entrySplit[2])) {
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
