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

function check(phone, name) {
    if (typeof phone !== 'string' || typeof name !== 'string' || name === '' || name.trim === '') {
        return false;
    }
    if (phone.search(/^\d{10}$/) === -1) {

        return false;
    }

    return true;
}

function check2(email) {
    if (email !== undefined) {
        if (typeof email !== 'string' || email === '' || email.trim === '') {
            return false;
        }

        return true;
    }

    return 1;
}

function generalCheck(phone, name, email) {
    if (check(phone, name) === false || check2(email) === false) {
        return false;
    }


    return true;
}

function checkPhone(phoneBookk, phone) {
    return phoneBookk.some(function (element) {
        return (element.phone === phone);
    });
}

/**
 * Добавление записи в телефонную книгу
 * @param {String} phone
 * @param {String?} name
 * @param {String?} email
 * @returns {Boolean}
 */
function add(phone, name, email) {
    if (generalCheck(phone, name, email) === false) {
        return false;
    }
    if (checkPhone(phoneBook, phone) === true) {
        return false;
    }
    var entry = { phone: phone, name: name, email: email,
        getphone: function () {
            return this.phone.toString();
        },
        getname: function () {
            return this.name.toString();
        },
        getemail: function () {
            return this.email.toString();
        }
    };

    phoneBook.push(entry);

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
    if (generalCheck(phone, name, email) === false) {
        return false;
    }
    phoneBook.forEach(element => {
        if (element.phone === phone) {
            element.name = name;
            element.email = email;
        }
    });

    return true;
}

/**
 * Удаление записей по запросу из телефонной книги
 * @param {String} query
 * @returns {Number}
 */
function findAndRemove(query) {
    var numberRecords = 0;
    phoneBook.forEach(element => {
        if (element.email === undefined) {
            if (element.phone.includes(query) === true ||
            element.name.includes(query) === true) {
                delete phoneBook[element];
                numberRecords++;
            }
        }
        if (element.email !== undefined) {
            if (element.email.includes(query) === true) {
                delete phoneBook[element];
                numberRecords++;
            }
        }
    });

    return numberRecords;
}

/**
 * Поиск записей по запросу в телефонной книге
 * @param {String} query
 * @returns {String[]}
 */

function findMore(query, string, found) {
    phoneBook.forEach(element => {
        if (element.email !== undefined) {
            if (element.email.includes(query) === true || element.phone.includes(query) === true ||
            element.name.includes(query) === true) {
                string = element.name + ', +7 (' + String(element.phone).slice(0, 3) + ') ' +
                String(element.phone).slice(3, 6) + '-' + String(element.phone).slice(6, 8) +
                '-' + String(element.phone).slice(8, 10) + ', ' + element.email;
                found.push(string);
            }
        }

    });
}

function findStar(query, string, found) {
    phoneBook.forEach(element => {
        if (element.email !== undefined && query === '*') {
            string = element.name + ', +7 (' + String(element.phone).slice(0, 3) + ') ' +
            String(element.phone).slice(3, 6) + '-' + String(element.phone).slice(6, 8) +
            '-' + String(element.phone).slice(8, 10) + ', ' + element.email;
            found.push(string);
        }
        if (query === '*' && element.email === undefined) {
            string = element.name + ', +7 (' + String(element.phone).slice(0, 3) + ') ' +
            String(element.phone).slice(3, 6) + '-' + String(element.phone).slice(6, 8) +
            '-' + String(element.phone).slice(8, 10);
            found.push(string);
        }
    });
}

function find(query) {
    var string;
    var found = [];
    if (query === '') {
        return;
    }
    phoneBook.forEach(element => {
        if (element.email === undefined) {
            if (element.phone.includes(query) === true ||
            element.name.includes(query) === true) {
                string = element.name + ', +7 (' + String(element.phone).slice(0, 3) + ') ' +
                String(element.phone).slice(3, 6) + '-' + String(element.phone).slice(6, 8) +
                '-' + String(element.phone).slice(8, 10);
                found.push(string);
            }
        }
    });
    findStar(query, string, found);
    findMore(query, string, found);

    return found.sort();
}

/**
 * Импорт записей из csv-формата
 * @star
 * @param {String} csv
 * @returns {Number} – количество добавленных и обновленных записей
 */
function importFromCsv(csv) {
    var line = csv.split('\n');
    var lineAdd = 0;
    var lineSplit;
    for (var i = 0; i <= line.length; i++) {
        lineSplit = String(line[i]).split(';');
        if (update(lineSplit[1], lineSplit[0], lineSplit[2])) {
            lineAdd++;
        }
        if (add(lineSplit[1], lineSplit[0], lineSplit[2])) {
            lineAdd++;
        }

    }
    // Парсим csv
    // Добавляем в телефонную книгу
    // Либо обновляем, если запись с таким телефоном уже существует

    return lineAdd;
}

module.exports = {
    add,
    update,
    findAndRemove,
    find,
    importFromCsv,

    isStar
};
