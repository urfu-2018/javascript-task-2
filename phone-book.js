'use strict';
const isStar = true;

let phoneBook = [];
const phoneTest = /^(\d{3})(\d{3})(\d{2})(\d{2})$/;

function validDate(phone, name) {
    return phoneTest.test(phone) && name;
}

function findPhone(phone) {
    for (let i = 0; i < phoneBook.length; i++) {
        if (phoneBook[i].phone === phone) {
            return i;
        }
    }

    return -1;
}

function add(phone, name, email) {
    if (!validDate(phone, name) || findPhone(phone) !== -1) {
        return false;
    }
    phoneBook.push({ name, phone, email });

    return true;
}

function update(phone, name, email) {
    const necessaryContact = findPhone(phone);
    if (!validDate(phone, name) || necessaryContact === -1) {
        return false;
    }
    phoneBook[necessaryContact] = { name, phone, email };

    return true;
}

function findQueryInContact(contact, query) {
    return (contact.email && contact.email.includes(query)) ||
        contact.name.includes(query) || contact.phone.includes(query);
}

function findAndRemove(query) {
    if (!query) {
        return 0;
    }
    const countContact = phoneBook.length;
    if (query === '*') {
        phoneBook = [];

        return countContact;
    }
    phoneBook = phoneBook.filter(contact => findQueryInContact(contact, query) === false);

    return countContact - phoneBook.length;
}

/**
 * Поиск записей по запросу в телефонной книге
 * @param {String} query
 * @returns {String[]}*/

function find(query) {
    if (!query) {
        return [];
    }
    let processed;
    if (query === '*') {
        processed = phoneBook;
    } else {
        processed = phoneBook.filter(contact => findQueryInContact(contact, query) === true);
    }

    return processed.map(function (contact) {
        const formattedPhone = contact.phone.replace(phoneTest, '+7 ($1) $2-$3-$4');
        let result = contact.name + ', ' + formattedPhone;
        if (contact.email) {
            result += ', ' + contact.email;
        }

        return result;
    }).sort();
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

    return csv.split('\n').filter(contact => {
        const [name, phone, email] = contact.split(';');

        return add(phone, name, email) || update(phone, name, email);
    }).length;
}

module.exports = {
    add,
    update,
    findAndRemove,
    find,
    importFromCsv,

    isStar
};
