'use strict';

/**
 * Сделано задание на звездочку
 * Реализован метод importFromCsv
 */
const isStar = true;

/**
 * Телефонная книга
 */
let phoneBook = new Map();

/**
 * Добавление записи в телефонную книгу
 * @param {String} phone
 * @param {String?} name
 * @param {String?} email
 * @returns {Boolean}
 */
function add(phone, name, email) {
    if (!validatePhoneAndEmail(phone, name)) {
        return false;
    }
    if (!phoneBook.get(phone)) {
        phoneBook.set(phone.trim(), [name.trim(), email || undefined]);
        phoneBook = mapSort(phoneBook);

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
    if (!validatePhoneAndEmail(phone, name)) {
        return false;
    }
    if (phoneBook.get(phone)) {
        phoneBook.set(phone.trim(), [name.trim(), email || undefined]);

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
    if (validateQuery(query)) {
        return 0;
    }
    if (query === '*') {
        query = '';
    }
    let size = phoneBook.size;
    phoneBook.forEach(function (key, value) {
        let phone = value;
        let email = '';
        if (key[1]) {
            email = key[1];
        }
        if (isInclude(phone, key[0], email, query)) {
            phoneBook.delete(phone);
        }
    });

    return size - phoneBook.size;
}

/**
 * Поиск записей по запросу в телефонной книге
 * @param {String} query
 * @returns {String[]}
 */
function find(query) {
    if (validateQuery(query)) {
        return [];
    }
    if (query === '*') {
        query = '';
    }
    let res = [];
    phoneBook.forEach(function (key, value) {
        let phone = value;
        let email = '';
        if (key[1]) {
            email = key[1];
        }
        if (isInclude(phone, key[0], email, query)) {
            res.push(arrayToString([key[0], formattingPhone(phone), email]));
        }
    });

    return res;
}

/**
 * Импорт записей из csv-формата
 * @star
 * @param {String} csv
 * @returns {Number} – количество добавленных и обновленных записей
 */
function importFromCsv(csv) {
    let temp;
    let res = 0;
    let person = [];
    temp = csv.split('\n');
    for (let i = 0; i < temp.length; i++) {
        person = temp[i].split(';');
        if (add(person[1], person[0], person[2]) || update(person[1], person[0], person[2])) {
            res ++;
        }
    }

    return res;
}

function isInclude(phone, name, email, query) {
    return phone.includes(query) || name.includes(query) || email.includes(query);
}

function mapSort(map) {
    map = new Map(
        Array
            .from(map)
            .sort((a, b) => {
                return a[0].toLowerCase() - b[0].toLowerCase();
            })
    );

    return map;
}

function arrayToString(array) {

    return array.filter(Boolean).join(', ');
}

function formattingPhone(phone) {
    phone = '+7 (' + phone.substr(0, 3) + ') ' + phone.substr(3, 3) + '-' + phone.substr(6, 2) +
        '-' + phone.substr(8, 2);

    return phone;

}

function validatePhoneAndEmail(phone, name) {
    const phoneRegexp = new RegExp('^[0-9]{10}$');

    return (typeof phone === 'string' && typeof name === 'string' && name.length !== 0 &&
        typeof phone !== undefined && typeof name !== undefined && phoneRegexp.test(phone));
}

console.info(typeof 0 === 'string' && typeof 'foo' === 'string');

function validateQuery(query) {

    return query === '' || query === undefined;
}

module.exports = {
    add,
    update,
    findAndRemove,
    find,
    importFromCsv,

    isStar
};
