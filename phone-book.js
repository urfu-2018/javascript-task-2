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
    if (!checking(phone, name)) {
        return false;
    }
    if (phoneBook.get(phone) === undefined) {
        phoneBook.set(phone, [name, email]);
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
    if (!checking(phone, name)) {
        return false;
    }
    if (phoneBook.get(phone) !== undefined) {
        if (email === undefined || email.length === 0) {
            phoneBook.set(phone, [name, undefined]);
        } else {
            phoneBook.set(phone, [name, email]);
        }

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
    if (query === '*') {
        query = '';
    }
    let res = 0;
    let iterator = phoneBook.keys();
    let size = phoneBook.size;
    for (let i = 0; i < size; i++) {
        let phone = iterator.next().value.toString();
        let name = phoneBook.get(phone)[0].toString();
        let email = '';
        if (phoneBook.get(phone)[1] !== undefined) {
            email = phoneBook.get(phone)[1].toString();
        }
        if (isInclude([phone, name, email], query)) {
            phoneBook.delete(phone);
            res ++;
        }
    }

    return res;
}

/**
 * Поиск записей по запросу в телефонной книге
 * @param {String} query
 * @returns {String[]}
 */
function find(query) {
    if (query === '*') {
        query = '';
    }
    let res = [];
    let iterator = phoneBook.keys();
    for (let i = 0; i < phoneBook.size; i++) {
        let phone = iterator.next().value.toString();
        let name = phoneBook.get(phone)[0].toString();
        let email = '';
        if (phoneBook.get(phone)[1] !== undefined) {
            email = phoneBook.get(phone)[1].toString();
        }
        if (isInclude([phone, name, email], query)) {
            res.push(arrayToString([name, phone = formatingPhone(phone), email]));
        }
    }

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
        if (add(person[1], person[0], person[2])) {
            res ++;
        } else if (update(person[1], person[0], person[2])) {
            res ++;
        }
    }

    return res;
}

function isInclude(strings, includingString) {
    for (let i = 0; i < strings.length; i++) {
        if (strings[i].includes(includingString)) {
            return true;
        }
    }

    return false;
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
    let res = '';
    for (let i = 0; i < array.length; i++) {
        if (array[i].length !== 0) {
            res += array[i] + ', ';
        }
    }
    res = res.substr(0, res.length - 2);

    return res;
}

function formatingPhone(phone) {
    phone = '+7 (' + phone.substr(0, 3) + ') ' + phone.substr(3, 3) + '-' + phone.substr(6, 2) +
        '-' + phone.substr(8, 2);

    return phone;

}

function checking(phone, name) {
    const phoneRegexp = new RegExp('^[0-9]{10}$');

    return ((typeof phone && typeof name) === 'string' && name.length !== 0 && (typeof phone &&
        typeof name) !== undefined && phoneRegexp.test(phone));
}

module.exports = {
    add,
    update,
    findAndRemove,
    find,
    importFromCsv,

    isStar
};
