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

function phoneInPhoneBook(phone) {
    return phoneBook.some(contact => {
        return contact.phone === phone;
    });
}

function outputNameAndPhone(name, phone) {
    return name + ', +7 (' + phone.substr(0, 3) + ') ' + phone.substr(3, 3) +
    '-' + phone.substr(6, 2) + '-' + phone.substr(8, 2);
}

function queryMatches(query, name, phone, email) {
    if (email === undefined) {
        email = '';
    }

    return name.includes(query) || phone.includes(query) ||
    email.includes(query);
}

/**
 * Добавление записи в телефонную книгу
 * @param {String} phone
 * @param {String} name
 * @param {String?} email
 * @returns {Boolean}
 */
function add(phone, name, email) {
    if (/^\d{10}$/.test(phone) && name && !phoneInPhoneBook(phone)) {
        phoneBook.push({
            name,
            phone,
            email
        });

        return true;
    }

    return false;
}

/**
 * Обновление записи в телефонной книге
 * @param {String} phone
 * @param {String?} name
 * @param {String?} email
 * @returns {Boolean}
 */
function update(phone, name, email) {
    let requiredPhoneIndex;
    if (phone && (name || email) && phoneInPhoneBook(phone)) {
        requiredPhoneIndex = phoneBook.findIndex(contact =>
            contact.phone === phone);
        phoneBook[requiredPhoneIndex].name = name;
        phoneBook[requiredPhoneIndex].email = email;

        return true;
    }

    return false;
}

/**
 * Удаление записей по запросу из телефонной книги
 * @param {String} query
 * @returns {Number}
 */
function findAndRemove(query) {
    let countDeletedContacts;
    if (!query) {
        return 0;
    }
    if (query === '*') {
        countDeletedContacts = phoneBook.length;
        phoneBook = [];

        return countDeletedContacts;
    }
    let requiredPhoneIndexes = [];
    phoneBook.forEach((contact, index) => {
        if (((!contact.email) &&
        queryMatches(query, contact.name, contact.phone)) || (contact.email &&
        queryMatches(query, contact.name, contact.phone, contact.email))) {
            requiredPhoneIndexes.push(index);
        }
    });
    let indexTransfer = 0;
    for (let i = 0; i < requiredPhoneIndexes.length; i++) {
        phoneBook.splice(requiredPhoneIndexes[i] - indexTransfer, 1);
        indexTransfer++;
    }

    return requiredPhoneIndexes.length;
}

/**
 * Поиск записей по запросу в телефонной книге
 * @param {String} query
 * @returns {String[]}
 */
function find(query) {
    let requiredPhoneIndexes = phoneBook;
    if (!query) {
        return [];
    } else if (query !== '*') {
        requiredPhoneIndexes = phoneBook.filter(contact => {
            if (!contact.email) {

                return queryMatches(query, contact.name, contact.phone);
            }

            return queryMatches(query, contact.name, contact.phone,
                contact.email);
        });
    }
    requiredPhoneIndexes = requiredPhoneIndexes.map(contact => {
        if (!contact.email) {
            return outputNameAndPhone(contact.name, contact.phone);
        }

        return outputNameAndPhone(contact.name, contact.phone) + ', ' +
        contact.email;
    });

    return requiredPhoneIndexes.sort();
}

/**
 * Импорт записей из csv-формата
 * @star
 * @param {String} csv
 * @returns {Number} – количество добавленных и обновленных записей
 */
function importFromCsv(csv) {
    // Парсим csv
    let csvArrContacts = csv.split('\n');
    let amountUpdatedOrAddedContacts = 0;
    csvArrContacts.forEach((csvArrContact) => {
        csvArrContact = csvArrContact.split(';');
        const [name, phone, email] = csvArrContact;
        if (phoneInPhoneBook(phone) && update(phone, name, email)) { // Обновляем
            amountUpdatedOrAddedContacts++;
        } else if (add(phone, name, email)) { // Либо добавляем
            amountUpdatedOrAddedContacts++;
        }
    });

    return amountUpdatedOrAddedContacts;
}

module.exports = {
    add,
    update,
    findAndRemove,
    find,
    importFromCsv,

    isStar
};
