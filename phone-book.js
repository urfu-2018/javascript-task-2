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
 * @param {String} name
 * @param {String?} email
 * @returns {Boolean}
 */
function add(phone, name, email) {
    if (/^\d{10}$/.test(phone) && name !== undefined &&
    (!phoneBook.reduce((acc, contact) => {
        acc += (contact.phone === phone);

        return acc;
    }, false))) {
        const lenghtBeforeСhanges = phoneBook.length;
        phoneBook.push({
            name,
            phone,
            email
        });
        if (lenghtBeforeСhanges === phoneBook.length - 1) {
            return true;
        }
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
    if (phone !== undefined && (name !== undefined || email !== undefined) &&
    (phoneBook.reduce((acc, contact, index) => {
        acc += (contact.phone === phone);
        if (contact.phone === phone) {
            requiredPhoneIndex = index;
        }

        return acc;
    }, false))) {
        phoneBook[requiredPhoneIndex].name = name;
        phoneBook[requiredPhoneIndex].phone = phone;
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
    let requiredPhoneIndexes = [];
    phoneBook.forEach((contact, index) => {
        if (contact.email === undefined) {
            if (contact.phone.includes(query) ||
            contact.name.includes(query)) {
                requiredPhoneIndexes.push(index);
            }
        }
    });
    phoneBook.forEach((contact, index) => {
        if (contact.email !== undefined && (contact.name.includes(query) ||
        contact.phone.includes(query) || contact.email.includes(query))) {
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
            if (contact.email === undefined) {
                return contact.phone.includes(query) ||
                contact.name.includes(query);
            }

            return contact.name.includes(query) || contact.phone.includes(query) ||
            contact.email.includes(query);
        });
    }
    requiredPhoneIndexes = requiredPhoneIndexes.map(contact => {
        if (contact.email === undefined) {
            return contact.name + ', +7 (' + contact.phone.substr(0, 3) +
            ') ' + contact.phone.substr(3, 3) + '-' +
            contact.phone.substr(6, 2) + '-' + contact.phone.substr(8, 2);
        }

        return contact.name + ', +7 (' + contact.phone.substr(0, 3) +
        ') ' + contact.phone.substr(3, 3) + '-' +
        contact.phone.substr(6, 2) + '-' + contact.phone.substr(8, 2) + ', ' +
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
    let amountUpdatedOrAddeddContacts = 0;
    csvArrContacts.forEach((csvArrContact) => {
        csvArrContact = csvArrContact.split(';');
        const name = csvArrContact[0];
        const phone = csvArrContact[1];
        const email = csvArrContact[2];
        if (phoneBook.reduce((acc, contact) => {
            acc += (contact.phone === phone);

            return acc;
        }, false)) { // Обновляем, если запись с таким телефоном уже существует
            if (update(phone, name, email)) {
                amountUpdatedOrAddeddContacts++;
            }
            update(phone, name, email);
        } else { // Либо добавляем
            if (add(phone, name, email)) {
                amountUpdatedOrAddeddContacts++;
            }
            add(phone, name, email);
        }
    });

    return amountUpdatedOrAddeddContacts;
}

module.exports = {
    add,
    update,
    findAndRemove,
    find,
    importFromCsv,

    isStar
};
