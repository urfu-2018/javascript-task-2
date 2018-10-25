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
    if (!isString(phone) || !isString(name)) {
        return false;
    }
    if (!/^\d{10}$/.test(phone) || isOldPhone(phone)) {
        return false;
    }
    let phoneContact = {
        phone: phone,
        name: name
    };
    if (isString(email)) {
        phoneContact.email = email;
    }
    phoneBook.push(phoneContact);

    return true;
}

function isOldPhone(phone) {
    return phoneBook.some(function (contact) {
        return contact.phone === phone;
    });
}

/**
 * Обновление записи в телефонной книге
 * @param {String} phone
 * @param {String?} name
 * @param {String?} email
 * @returns {Boolean}
 */
function update(phone, name, email) {
    if (!isString(phone) || !isString(name)) {
        return false;
    }
    let index = phoneBook.findIndex(x=>x.phone === phone);
    if (index === -1) {
        return false;
    }
    phoneBook[index].name = name;
    if (!isString(email)) {
        delete phoneBook[index].email;
    } else {
        phoneBook[index].email = email;
    }

    return true;
}

/**
 * Удаление записей по запросу из телефонной книги
 * @param {String} query
 * @returns {Number}
 */
function findAndRemove(query) {
    if (!isString(query)) {
        return [];
    }
    let count = 0;
    let index;
    while ((index = findContact(query)) !== -1) {
        phoneBook.splice(index, 1);
        count++;
    }

    return count;
}

/*
* Поиск индекса контакта по строке
*/
function findContact(query) {
    return phoneBook.findIndex(x => objectIncludes(x, query));
}

function objectIncludes(contact, query) {
    return contact.name.includes(query) ||
    contact.phone.includes(query) ||
    ('email' in contact && contact.email.includes(query));
}

/**
 * Поиск записей по запросу в телефонной книге
 * @param {String} query
 * @returns {String[]}
 */
function find(query) {
    if (!isString(query)) {
        return [];
    }
    let result = filterContact(query);

    return result
        .sort((a, b) => a.name.localeCompare(b.name))
        .map(renderContact);
}

function filterContact(query) {
    if (query === '*') {
        return phoneBook;
    }

    return phoneBook.filter((contact) => objectIncludes(contact, query));
}

/*
* Проверка на string
*/
function isString(value) {
    return typeof value === 'string' && value !== '';
}

/*
* Форматирование контакта
*/
function renderContact(contact) {
    let phone = editPhone(contact.phone);
    let result = [contact.name, phone];
    if ('email' in contact) {
        result.push(contact.email);
    }

    return result.join(', ');
}

/*
* Форматирование номера
*/
function editPhone(phone) {
    let p1 = phone.substr(0, 3);
    let p2 = phone.substr(3, 3);
    let p3 = phone.substr(6, 2);
    let p4 = phone.substr(8, 2);

    return `+7 (${p1}) ${p2}-${p3}-${p4}`;
}

/**
 * Импорт записей из csv-формата
 * @star
 * @param {String} csv
 * @returns {Number} – количество добавленных и обновленных записей
 */
function importFromCsv(csv) {
    let countAdded = 0;
    let contacts = csv.split('\n');
    for (let i = 0; i < contacts.length; i++) {
        let contact = contacts[i].split(';');
        if (isOldPhone(contact[1])) {
            countAdded += update(contact[1], contact[0], contact[2]) ? 1 : 0;
        } else {
            countAdded += add(contact[1], contact[0], contact[2]) ? 1 : 0;
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
