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
        let preparedParams = prepareInputParams({ phone, name, email });
        phoneBook.set(preparedParams[0], [preparedParams[1], preparedParams[2]]);
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
        let preparedParams = prepareInputParams({ phone, name, email });
        phoneBook.set(preparedParams[0], [preparedParams[1], preparedParams[2]]);

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
    let phoneBookSize = phoneBook.size;
    if (validateQuery(query)) {
        return 0;
    }
    if (query === '*') {
        query = '';
    }
    findByQuery(query).forEach((key) => {
        phoneBook.delete(key);
    });

    return phoneBookSize - phoneBook.size;
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
    let lul = findByQuery(query);
    lul.forEach((value) => {
        res.push(arrayToString([phoneBook.get(value)[0], formattingPhone(value),
            phoneBook.get(value)[1]]));
    });

    return res;
}

function findByQuery(query) {
    let res = [];
    phoneBook.forEach((value, key) => {
        let phone = key;
        let email = value[1] || '';
        if (isInclude(phone, value[0], email, query)) {
            res.push(phone);
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

function validateQuery(query) {

    return query === '' || query === undefined;
}

function prepareInputParams(arr) {
    if (arr.email) {
        return [arr.phone.trim(), arr.name.trim(), arr.email.trim()];
    }

    return [arr.phone.trim(), arr.name.trim(), arr.email];
}

module.exports = {
    add,
    update,
    findAndRemove,
    find,
    importFromCsv,

    isStar
};
