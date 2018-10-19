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
    if (!checkFields(phone, name, email)) {
        return false;
    }

    if (phoneBook.some(contact => contact.phone === phone)) {
        return false;
    }
    phoneBook.push({
        name,
        phone,
        email
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
    if (!checkFields(phone, name, email)) {
        return false;
    }
    let modifiedContact = phoneBook.findIndex(contact => contact.phone === phone);

    if (modifiedContact === -1) {
        return false;
    }

    phoneBook[modifiedContact].email = email;
    phoneBook[modifiedContact].name = name;

    return true;
}

/**
 * Удаление записей по запросу из телефонной книги
 * @param {String} query
 * @returns {Number}
 */
function findAndRemove(query) {
    let deleteContacts = find(query);

    deleteContacts.forEach(deleteContact => {
        phoneBook.splice(phoneBook.indexOf(deleteContact.split(', ')[1]), 1);
    });

    return deleteContacts.length;
}

/**
 * Поиск записей по запросу в телефонной книге
 * @param {String} query
 * @returns {String[]}
 */
function find(query) {
    if (!query) {
        return [];
    }
    const sortedPhoneBook = phoneBook.sort(sortContactsByName);
    if (query === '*') {
        return phoneBook.map(contactToString);
    }

    return sortedPhoneBook.filter(contact =>
        contact.name.includes(query) || contact.phone.includes(query) ||
        (contact.email !== undefined && contact.email.includes(query)))
        .map(contactToString);
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
    if (!csv) {
        return 0;
    }
    let contactCount = 0;
    csv.split(/\n/).forEach(contact => {
        let [name, phone, mail] = contact.split(/;/);
        if (add(phone, name, mail) || update(phone, name, mail)) {
            ++contactCount;
        }
    });

    return contactCount;
}

function checkFields(phone, name, email) {
    return checkPhone(phone) && checkName(name) && checkEmail(email);
}

function checkName(name) {
    return typeof name === 'string' && name.trim() !== '';
}

function checkEmail(email) {
    return email === undefined || (typeof email === 'string' && email.trim() !== '');
}

function checkPhone(phone) {
    return typeof phone === 'string' && /^\d{10}$/.test(phone);
}

function sortContactsByName(firstContact, secondContact) {
    let firstName = firstContact.name.toUpperCase();
    let secondName = secondContact.name.toUpperCase();
    if (firstName < secondName) {
        return -1;
    }
    if (firstName > secondName) {
        return 1;
    }

    return 0;
}

function contactToString(contact) {
    if (contact.email === undefined) {
        return [contact.name, formatPhone(contact.phone)].join(', ');
    }

    return [contact.name, formatPhone(contact.phone), contact.email].join(', ');
}

function formatPhone(phone) {
    return phone.replace(/^(\d\d\d)(\d\d\d)(\d\d)(\d\d)$/, '+7 ($1) $2-$3-$4');

}

module.exports = {
    add,
    update,
    findAndRemove,
    find,
    importFromCsv,

    isStar
};
