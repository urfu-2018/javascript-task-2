'use strict';

/**
 * Сделано задание на звездочку
 * Реализован метод importFromCsv
 */
const isStar = true;


const phoneBook = {};


const PHONE_RE = /^(\d{3})(\d{3})(\d{2})(\d{2})$/;


class Contact {
    constructor(phone, name, email) {
        this.phone = phone;
        this.name = name;
        this.email = email;
    }

    static fromStr(str) {
        const parts = str.split(';');

        return new Contact(parts[1], parts[0], parts[2]);
    }

    isValid() {
        return this.name && PHONE_RE.test(this.phone);
    }

    isMatch(query) {
        return this.phone.includes(query) || this.name.includes(query) ||
            (this.email && this.email.includes(query));
    }

    get formattedPhone() {
        const phoneParts = PHONE_RE.exec(this.phone);

        return `+7 (${phoneParts[1]}) ${phoneParts.slice(2)
            .join('-')}`;
    }

    toString() {
        return `${this.name}, ${this.formattedPhone}${this.email ? ', ' + this.email : ''}`;
    }
}


function addToContactsByPredicate(contact, predicate) {
    if (!predicate()) {
        return false;
    }

    phoneBook[contact.phone] = contact;

    return true;
}

/**
 * Добавление записи в телефонную книгу
 * @param {String} phone
 * @param {String?} name
 * @param {String?} email
 * @returns {Boolean}
 */
function add(phone, name, email) {
    const contact = new Contact(phone, name, email);

    return addToContactsByPredicate(contact,
        () => contact.isValid() && !phoneBook.hasOwnProperty(contact.phone));
}

/**
 * Обновление записи в телефонной книге
 * @param {String} phone
 * @param {String?} name
 * @param {String?} email
 * @returns {Boolean}
 */
function update(phone, name, email) {
    const contact = new Contact(phone, name, email);

    return addToContactsByPredicate(contact,
        () => name && phoneBook.hasOwnProperty(contact.phone));
}

function findContacts(query) {
    if (!query) {
        return [];
    }

    return Object.entries(phoneBook)
        .map(e => e[1])
        .filter(c => query === '*' || c.isMatch(query));
}

/**
 * Удаление записей по запросу из телефонной книги
 * @param {String} query
 * @returns {Number}
 */
function findAndRemove(query) {
    return findContacts(query)
        .filter(e => delete phoneBook[e.phone])
        .length;
}

/**
 * Поиск записей по запросу в телефонной книге
 * @param {String} query
 * @returns {String[]}
 */
function find(query) {
    return findContacts(query)
        .sort((a, b) => a.name.localeCompare(b.name))
        .map(e => e.toString());
}

/**
 * Импорт записей из csv-формата
 * @star
 * @param {String} csv
 * @returns {Number} – количество добавленных и обновленных записей
 */
function importFromCsv(csv) {
    return csv.split('\n')
        .map(Contact.fromStr)
        .filter(e => addToContactsByPredicate(e, () => e.isValid()))
        .length;
}

module.exports = {
    add,
    update,
    findAndRemove,
    find,
    importFromCsv,

    isStar
};
