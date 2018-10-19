'use strict';

/**
 * Сделано задание на звездочку
 * Реализован метод importFromCsv
 */
const isStar = true;

/**
 * Телефонная книга
 */
let phoneBook = {};

class PhoneBookEntry {
    constructor(phone, name, email) {
        this.phone = phone; // +7 (555) 666-77-88
        this.name = name;
        this.email = email;
    }

    toString() {
        let str = `${this.name}, ${this.phone}`;
        if (this.email) {
            str += `, ${this.email}`;
        }

        return str;
    }
}

function extractPhone(str) {
    const regexp = /.*, \+7 \((\d{3})\) (\d{3})-(\d{2})-(\d{2}),*.*/;
    const match = str.match(regexp);

    return `${match[1]}${match[2]}${match[3]}${match[4]}`;
}

/**
 * Добавление записи в телефонную книгу
 * @param {String} phone
 * @param {String?} name
 * @param {String?} email
 * @returns {Boolean}
 */
function add(phone, name, email) {
    const correctPhone = /^\d{3}\d{3}\d{2}\d{2}$/g;
    if (!correctPhone.test(phone) || !isString(name) || phoneBook[phone]) {
        return false;
    }

    phoneBook[phone] = new PhoneBookEntry(formatPhone(phone), name, email);

    return true;
}

function isTypeOf(obj, type) {
    return typeof obj === type;
}

function isString(obj) {
    return isTypeOf(obj, 'string');
}

function findByPhone(phone) {
    return phoneBook[phone];
}

function getAllEntries() {
    const phones = allPhones();

    return phones.map((phone) => phoneBook[phone].toString());
}

function allPhones() {
    return Object.keys(phoneBook);
}


function formatPhone(phone) {
    const correctPhone = /^(\d{3})(\d{3})(\d{2})(\d{2})$/; // 5556667788
    const match = phone.match(correctPhone);

    return `+7 (${match[1]}) ${match[2]}-${match[3]}-${match[4]}`; // +7 (555) 666-77-88
}

/**
 * Обновление записи в телефонной книге
 * @param {String} phone
 * @param {String?} name
 * @param {String?} email
 * @returns {Boolean}
 */
function update(phone, name, email) {
    const correctPhone = /^\d{3}\d{3}\d{2}\d{2}$/g;
    if (!correctPhone.test(phone) || !isString(name)) {
        return false;
    }

    let entry = findByPhone(phone);
    if (!entry) {
        return false;
    }

    entry.name = name;
    entry.email = email;

    return true;
}

/**
 * Удаление записей по запросу из телефонной книги
 * @param {String} query
 * @returns {Number}
 */
function findAndRemove(query) {
    const found = find(query);
    found.map(entry => delete phoneBook[extractPhone(entry)]);

    return found.length;
}

/**
 * Поиск записей по запросу в телефонной книге
 * @param {String} query
 * @returns {String[]}
 */
function find(query) {
    if (query === '') {
        return [];
    }

    let entries = getAllEntries();
    entries.sort();
    if (query === '*') {
        return entries;
    }

    return entries.filter(entry => entry.includes(query));
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

    let split = csv.split('\n');
    let total = 0;
    split.forEach(line => {
        let [name, phone, email] = line.split(';');
        if (addOrUpdate(phone, name, email)) {
            total++;
        }
    });

    return total;
}

function addOrUpdate(phone, name, email) {
    return add(phone, name, email) || update(phone, name, email);
}

module.exports = {
    add,
    update,
    findAndRemove,
    find,
    importFromCsv,

    isStar
};
