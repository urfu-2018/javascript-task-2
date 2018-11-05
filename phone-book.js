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
    if (!isPhone(phone) || isOldPhone(phone) || !isCorrectValue(name)) {
        return false;
    }
    let phoneContact = { phone, name };
    if (isCorrectValue(email)) {
        phoneContact.email = email;
    }
    phoneBook.push(phoneContact);

    return true;
}

function isPhone(phone) {
    return /^\d{10}$/.test(phone) && phone.length === 10 && typeof phone === 'string';
}

function isOldPhone(phone) {
    return phoneBook.some((contact) => contact.phone === phone);
}

/**
 * Обновление записи в телефонной книге
 * @param {String} phone
 * @param {String?} name
 * @param {String?} email
 * @returns {Boolean}
 */
function update(phone, name, email) {
    if (!isPhone(phone) || !isCorrectValue(name) || !isOldPhone(phone)) {
        return false;
    }
    const INDEX = phoneBook.findIndex(contact=>contact.phone === phone);
    phoneBook[INDEX].name = name;
    if (isCorrectValue(email)) {
        phoneBook[INDEX].email = email;
    } else if (phoneBook[INDEX].email) {
        delete phoneBook[INDEX].email;
    }

    return true;
}

/**
 * Удаление записей по запросу из телефонной книги
 * @param {String} query
 * @returns {Number}
 */
function findAndRemove(query) {
    if (!isCorrectValue(query)) {
        return 0;
    }
    let count = 0;
    if (query === '*') {
        count = phoneBook.length;
        phoneBook = [];

        return count;
    }
    count = phoneBook.length;
    let clearContacts = phoneBook.filter((contact) => !contactIncludes(contact, query));
    phoneBook = clearContacts;

    return count - clearContacts.length;
}

function contactIncludes(contact, query) {
    return contact.name.includes(query) ||
        contact.phone.includes(query) ||
        (contact.email && contact.email.includes(query));
}

/**
 * Поиск записей по запросу в телефонной книге
 * @param {String} query
 * @returns {String[]}
 */
function find(query) {
    if (!isCorrectValue(query)) {
        return [];
    }

    return filterContact(query)
        .sort(contactComparer)
        .map(renderContact);
}

function contactComparer(a, b) {
    return a.name.localeCompare(b.name);
}

function filterContact(query) {
    if (query === '*') {
        return phoneBook;
    }

    return phoneBook.filter((contact) => contactIncludes(contact, query));
}

/*
* Проверка на string
*/
function isCorrectValue(value) {
    return typeof value === 'string' && value !== '';
}

/*
* Форматирование контакта
*/
function renderContact(contact) {
    let result = [contact.name, editPhone(contact.phone)];
    if (contact.email) {
        result.push(contact.email);
    }

    return result.join(', ');
}

/*
* Форматирование номера
*/
function editPhone(phone) {
    const PARTS = [phone.substr(0, 3),
        phone.substr(3, 3),
        phone.substr(6, 2),
        phone.substr(8, 2)];

    return `+7 (${PARTS[0]}) ${PARTS[1]}-${PARTS[2]}-${PARTS[3]}`;
}

/**
 * Импорт записей из csv-формата
 * @star
 * @param {String} csv
 * @returns {Number} – количество добавленных и обновленных записей
 */
function importFromCsv(csv) {
    if (!isCorrectValue(csv)) {
        return 0;
    }
    let countAdded = 0;
    const CONTACTS = csv.split('\n');
    for (const contact of CONTACTS) {
        const [name, phone, email] = contact.split(';');
        if (isOldPhone(phone)) {
            countAdded += update(phone, name, email) ? 1 : 0;
        } else {
            countAdded += add(phone, name, email) ? 1 : 0;
        }
    }

    return countAdded;
}

module.exports = {
    add,
    update,
    findAndRemove,
    find,
    importFromCsv,

    isStar
};
