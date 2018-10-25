'use strict';

/**
 */
const isStar = false;

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
    if (phone !== undefined && typeof(phone) === 'string' && phone.length === 10 &&
     /^\d{10}$/.test(phone)) {
        return true;
    }

    return false;
}

function isCorrectName(name) {
    if (name !== undefined && typeof(name) === 'string' && name !== '') {
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
    if (typeof query !== 'string' || query === '') {
        return 0;
    }
    let findedRecords = search(query);
    for (let i = 0; i < findedRecords.length; i++) {
        phoneBook.splice(phoneBook.findIndex(element => element === findedRecords[i]), 1);
    }

    return findedRecords.length;
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
    if (query === undefined || typeof query !== 'string' || query === '') {
        return [];
    }
    let findedRecords = [];
    if (query === '*') {
        findedRecords = phoneBook.map(element => element.name + ', ' +
         toFullPhoneForm(element.phone) + ((typeof element.email === 'undefined')
            ? '' : ', ' + element.email));

        return findedRecords.sort();
    }

    findedRecords = phoneBook.filter(element => element.phone.includes(query) ||
     element.name.includes(query) || ((typeof element.email === 'undefined')
        ? false : element.email.includes(query)));

    return findedRecords;
}

function find(query) {
    let findedRecords = search(query);

    return findedRecords.map(element => element.name + ', ' +
         toFullPhoneForm(element.phone) + ((typeof element.email === 'undefined')
        ? '' : ', ' + element.email)).sort();
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
    let counter = 0;
    csv.split('\n').forEach(element => {
        const elements = element.split(';');
        let flag = add(elements[0], elements[1], elements[2]);
        if (!flag) {
            flag = update(elements[0], elements[1], elements[2]);
        }
        if (flag) {
            counter++;
        }
    });

    return counter;
}

module.exports = {
    add,
    update,
    findAndRemove,
    find,
    importFromCsv,

    isStar
};
