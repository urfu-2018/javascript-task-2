'use strict';

/**
 * Сделано задание на звездочку
 * Реализован метод importFromCsv
 */
const isStar = true;

/**
 * Телефонная книга
 */
var phoneBook = {};
// exports.phoneBook = phoneBook;

function test(phone, name) {
    if (name !== '' && typeof(name) === 'string') {
        if (/^\d{10}$/.test(phone)) {
            return true;
        }
    }

    return false;
}

/**
 * Добавление записи в телефонную книгу
 * @param {String} phone
 * @param {String?} name
 * @param {String?} email
 * @returns {Boolean}
 */
function add(phone, name, email) {
    if (test(phone, name) && !(phone in phoneBook)) {
        phoneBook[phone] = email === undefined ? [phone, name] : [phone, name, email];

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
    if (test(phone, name) && phone in phoneBook) {
        phoneBook[phone] = (email === undefined) ? [phone, name] : [phone, name, email];

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
    var countDelete = 0;
    if (typeof(query) !== 'string' || !query.length) {

        return 0;
    }

    Object.keys(phoneBook).forEach(function (phone) {
        var value = search(query, phoneBook[phone]);
        if (value !== undefined) {
            delete phoneBook[phone];
            countDelete++;
        }
    });

    return countDelete;

}

function search(query, dictionary) {
    if (query === '*') {
        return dictionary;
    }
    if (dictionary[0].indexOf(query) !== -1 || dictionary[1].indexOf(query) !== -1 ||
     (dictionary[2] && dictionary[2].indexOf(query) !== -1)) {
        return dictionary;
    }
}

function formatPhone(phone) {
    return `+7 (${phone.slice(0, 3)}) ${phone.slice(3, 6)}-${phone.slice(6, 8)}-${phone.slice(8)}`;
}

function sorts(notSortedList) {
    // var finalStrings = notSortedList.map((entry) => {
    //     if (entry === undefined) {
    //         return [];
    //     }
    //     if (entry[2] !== undefined) {
    //         return `${entry[1]}, ${formatPhone(entry[0])}, ${entry[2]}`;
    //     }

    //     return `${entry[1]}, ${formatPhone(entry[0])}`;
    // });
    var finalStrings = [];
    for (var entry of notSortedList) {
        if (entry === undefined) {
            return [];
        }
        if (entry[2] !== undefined) {
            finalStrings.push(`${entry[1]}, ${formatPhone(entry[0])}, ${entry[2]}`);
        } else {
            finalStrings.push(`${entry[1]}, ${formatPhone(entry[0])}`);
        }
    }

    return finalStrings.sort();
}

/**
 * Поиск записей по запросу в телефонной книге
 * @param {String} query
 * @returns {String[]}
 */
function find(query) {
    if (typeof(query) !== 'string' || !query.length) {

        return [];
    }
    var value;
    var notSortedList = Object.keys(phoneBook).map((phone) => {
        value = search(query, phoneBook[phone]);
        if (value !== undefined) {
            return value;
        }

        return '';
    });
    // var notSortedList = [];
    // for (var phone of Object.keys(phoneBook)) {
    //     value = search(query, phoneBook[phone]);
    //     if (value !== undefined) {
    //         notSortedList.push(value);
    //     }
    // }

    return sorts(notSortedList);
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
    var data = csv.split('\n');
    var countCsv = 0;
    data.forEach(function (value) {
        var contact = value.split(';');
        if (add(contact[1], contact[0], contact[2]) || update(contact[1], contact[0], contact[2])) {
            countCsv++;
        }
    });

    return countCsv;
}

module.exports = {
    add,
    update,
    findAndRemove,
    find,
    importFromCsv,

    isStar
};
