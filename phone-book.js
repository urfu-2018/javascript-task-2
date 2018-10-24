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
    if (!isString(name) || !isPhone(phone) || findContact(phone) > 0) {
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

/**
 * Обновление записи в телефонной книге
 * @param {String} phone
 * @param {String?} name
 * @param {String?} email
 * @returns {Boolean}
 */
function update(phone, name, email) {
    if (!isString(phone) || !isString(name) || findContact(phone) < 0) {
        return false;
    }
    let index = findContact(phone);
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
    if (!isString(query) || query.length === 0) {
        return [];
    }
    let count = 0;
    for (let i = 0; i < phoneBook.length; i++) {
        if (objectIncludes(phoneBook[i], query)) {
            phoneBook.splice(i--, 1);
            count++;
        }
    }

    return count;
}

/**
 * Поиск записей по запросу в телефонной книге
 * @param {String} query
 * @returns {String[]}
 */
function find(query) {
    if (!isString(query) || query.length === 0) {
        return [];
    }
    let result;
    if (query === '*') {
        result = phoneBook;
    } else {
        result = phoneBook.filter((contact) => {
            return objectIncludes(contact, query);
        });
    }

    return result
        .sort((a, b) => a.name.localeCompare(b.name))
        .map(renderContact);
}

function isPhone(phone) {
    let phoneMask = /^\d{10}$/;

    return isString(phone) && phoneMask.test(phone);
}

/*
* Поиск контакта по номеру
*/
function findContact(phone) {
    for (let i = 0; i < phoneBook.length; i++) {
        if (phoneBook[i].phone === phone) {
            return i;
        }
    }

    return -1;
}

/*
* Проверка на undefined
*/
function isString(value) {
    return typeof value === 'string';
}

/*
* Поиск вхождения строки в контакте
*/
function objectIncludes(contact, query) {
    for (let key in contact) {
        if (contact[key].includes(query)) {
            return true;
        }
    }

    return false;
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
        if (add(contact[1], contact[0], contact[2]) ||
            update(contact[1], contact[0], contact[2])) {
            countAdded++;
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
