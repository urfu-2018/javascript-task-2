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
    if (isUndefined(phone) || isUndefined(name)) {
        return false;
    }
    if (!(/^\d{10}$/g.test(phone) && findContact(phone) === -1)) {
        return false;
    }
    let phoneContact = {
        phone: phone,
        name: name
    };
    if (!isUndefined(email)) {
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
    if (isUndefined(phone) || isUndefined(name)) {
        return false;
    }
    let index = findContact(phone);
    if (index === -1) {
        return false;
    }
    phoneBook[index].name = name;
    if (isUndefined(email)) {
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
    let count = 0;
    for (let i = 0; i < phoneBook.length; i++) {
        if (objectIncludes(phoneBook[i], query)) {
            phoneBook.splice(i, 1);
            i--;
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
    if (!query) {
        return null;
    }
    if (query === '*') {
        return phoneBook
            .sort(shortContacts)
            .map(renderContact);
    }
    let result = phoneBook.filter((contact) => {
        return objectIncludes(contact, query);
    });

    return result
        .sort(shortContacts)
        .map(renderContact);
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
function isUndefined(value) {
    return typeof value === 'undefined';
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
* Сортировка контактов
*/
function shortContacts(a, b) {
    if (a.name !== b.name) {
        return a.name > b.name ? 1 : -1;
    }

    return a.phone.localeCompare(b.phone);
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

        if (findContact(contact[1]) === -1) {
            countAdded += add(contact[1], contact[0], contact[2]) ? 1 : 0;
        } else {
            countAdded += update(contact[1], contact[0], contact[2]) ? 1 : 0;
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
