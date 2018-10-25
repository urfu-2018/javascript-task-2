'use strict';

/**
 * Сделано задание на звездочку
 * Реализован метод importFromCsv
 */
const isStar = true;

/**
 * Телефонная книга
 */
let phoneBook = {};
const PHONE_REGEX = /^(\d{3})(\d{3})(\d{2})(\d{2})$/;

function checkFormat(str) {
    return PHONE_REGEX.test(str);
}

/**
 * Добавление записи в телефонную книгу
 * @param {String} phone
 * @param {String?} name
 * @param {String?} email
 * @returns {Boolean}
 */
function add(phone, name, email) {
    if (checkFormat(phone) && name && !(phone in phoneBook)) {
        phoneBook[phone] = { name, email };

        return true;
    }

    return;
}

/**
 * Обновление записи в телефонной книге
 * @param {String} phone
 * @param {String?} name
 * @param {String?} email
 * @returns {Boolean}
 */
function update(phone, name, email) {
    if (checkFormat(phone) && name && phone in phoneBook) {
        phoneBook[phone] = { name, email };

        return true;
    }

    return;
}

/**
 * Удаление записей по запросу из телефонной книги
 * @param {String} query
 * @returns {Number}
 */
function findAndRemove(query) {
    if (query === '') {
        return [];
    }
    if (query === '*') {
        query = '';
    }
    let numbers = Object.keys(phoneBook);

    let toDelete = numbers.filter(number => {
        return checkContain(number, query);
    });
    toDelete.forEach(number => delete phoneBook[number]);

    return toDelete.length;
}

function checkContain(number, query) {
    let emailCond = phoneBook[number].email && phoneBook[number].email.includes(query);

    return number.includes(query) || phoneBook[number].name.includes(query) || emailCond;
}

/**
 * Поиск записей по запросу в телефонной книге
 * @param {String} query
 * @returns {String[]}
 */
function find(query) {
    if (query === '') {
        return [];
    }
    if (query === '*') {
        query = '';
    }
    let numbers = Object.keys(phoneBook);

    return numbers.filter(number => {

        return checkContain(number, query);
    }) // contains condition
        .map(number => {
            return { name: phoneBook[number].name, number, email: phoneBook[number].email };
        })
        .sort(function (a, b) {
            if (a.name > b.name) {
                return 1;
            }
            if (a.name < b.name) {
                return -1;
            }

            return 0;
        })
        .map(record => {
            let digits = record.number.match(PHONE_REGEX);
            let str = `${record.name}, +7 (${digits[1]}) ${digits[2]}-${digits[3]}-${digits[4]}`;

            return record.email ? str + ', ' + record.email : str;

        });


}

/**
 * Импорт записей из csv-формата
 * @star
 * @param {String} csv
 * @returns {Number} – количество добавленных и обновленных записей
 */
function importFromCsv(csv) {
    return csv.split('\n')
        .map(line => line.split(';'))
        .reduce((count, record) => {
            if (add(record[1], record[0], record[2])) {
                count++;
            } else if (update(record[1], record[0], record[2])) {
                count++;
            }

            return count;
        }, 0);
}

module.exports = {
    add,
    update,
    findAndRemove,
    find,
    importFromCsv,

    isStar
};
