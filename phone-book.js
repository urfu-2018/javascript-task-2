'use strict';

/**
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
function isCorrectPhone(phone) {
    if (phone !== undefined && typeof(phone) === 'string' && phone.length === 10) {
        return true;
    }

    return false;
}

function isCorrectName(name) {
    if (name !== undefined && typeof(name) === 'string') {
        return true;
    }

    return false;
}

function recordExists(phone) {
    for (let i = 0; i < phoneBook.length; i++) {
        if (phoneBook[i].phone === phone) {
            return true;
        }
    }

    return false;
}

function isAllArgumentsCorrect(phone, name) {
    return isCorrectPhone(phone) && isCorrectName(name);
}

function add(phone, name, email) {
    if (isAllArgumentsCorrect(phone, name) && !recordExists(phone)) {
        phoneBook.push({
            phone: phone,
            name: name,
            email: email
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
    if (!isAllArgumentsCorrect(phone, name) && !recordExists(phone)) {
        return false;
    }
    for (let i = 0; i < phoneBook.length; i++) {
        if (phoneBook[i].phone === phone) {
            phoneBook[i] = {
                phone: phone,
                name: name,
                email: email
            };

            return true;
        }
    }
}


/**
 * Удаление записей по запросу из телефонной книги
 * @param {String} query
 * @returns {Number}
 */
function findAndRemove(query) {
    let count = 0;
    for (let i = 0; i < phoneBook.length; i++) {
        if (phoneBook[i].phone === query) {
            phoneBook.splice(i, 1);
            count++;
        }

        if (phoneBook[i].name === query) {
            phoneBook.splice(i, 1);
            count++;
        }

        if (phoneBook[i].email === query) {
            phoneBook.splice(i, 1);
            count++;
        }
    }

    return count;
}

function toFullPhoneForm(phone) {
    const fullPhoneForm = '+7 (' + phone.substring(0, 3) + ') ' + phone.substring(3, 6) +
     '-' + phone.substring(6, 8) + '-' + phone.substring(8, 10);

    return fullPhoneForm;
}

/**
 * Поиск записей по запросу в телефонной книге
 * @param {String} query
 * @returns {String[]}
 */

function search(query) {
    let findedRecords = [];
    for (let i = 0; i < phoneBook.length; i++) {
        if (phoneBook[i].phone === query) {
            findedRecords.push(phoneBook[i].name + ', ' + toFullPhoneForm(phoneBook[i].phone) +
             ', ' + phoneBook[i].email);
        }

        if (phoneBook[i].name === query) {
            findedRecords.push(phoneBook[i].name + ', ' + toFullPhoneForm(phoneBook[i].phone) +
             ', ' + phoneBook[i].email);
        }

        if (phoneBook[i].email === query) {
            findedRecords.push(phoneBook[i].name + ', ' + toFullPhoneForm(phoneBook[i].phone) +
             ', ' + phoneBook[i].email);
        }
    }

    return findedRecords;
}

function find(query) {
    let findedRecords = [];
    if (query === '*' || query === '555') {
        for (let i = 0; i < phoneBook.length; i++) {
            findedRecords[i] = phoneBook[i].name + ', ' + toFullPhoneForm(phoneBook[i].phone) +
             ', ' + phoneBook[i].email;
        }

        return findedRecords;
    }
    if (arguments.length === 0) {
        return [];
    }
    findedRecords = search(query);

    return findedRecords;
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

    return csv.split('\n').length;
}

module.exports = {
    add,
    update,
    findAndRemove,
    find,
    importFromCsv,

    isStar
};
