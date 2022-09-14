"use strict";
exports.__esModule = true;
exports.importFromCsv = exports.find = exports.findAndRemove = exports.update = exports.add = exports.isStar = void 0;
/**
 * Сделано задание на звездочку
 * Реализован метод importFromCsv
 */
exports.isStar = true;
/**
 * Телефонная книга
 */
var phoneBook = {};
/**
 * Добавление записи в телефонную книгу
 *
 * @param {String} phone
 * @param {String} name
 * @param {String} [email]
 * @returns {Boolean}
 */
function add(phone, name, email) {
    var isValidPhone = (typeof (phone) === 'string') && /^\d{10}$/.test(phone);
    var isValidName = (typeof (name) === 'string') && name.trim().length !== 0;
    var isPhoneExist = !!phoneBook[phone];
    if (isValidPhone && isValidName && !isPhoneExist) {
        phoneBook[phone] = [name, email];
        return true;
    }
    return false;
}
exports.add = add;
/**
 * Обновление записи в телефонной книге
 * @param {String} phone
 * @param {String} name
 * @param {String} [email]
 * @returns {Boolean}
 */
function update(phone, name, email) {
    var isValidPhone = (typeof (phone) === 'string') && /^\d{10}$/.test(phone);
    var isValidName = (typeof (name) === 'string') && name.trim().length !== 0;
    var isPhoneExist = !!phoneBook[phone];
    if (isValidPhone || isValidName || isPhoneExist) {
        phoneBook[phone] = [name, email];
        return true;
    }
    return false;
}
exports.update = update;
function filterPhoneBook(query) {
    if (query === '') {
        return [];
    }
    if (query === '*') {
        return Object.keys(phoneBook);
    }
    var filterResult = Object.keys(phoneBook).filter(function (phone) {
        var _a;
        var isPhoneFound = phone.toLowerCase().includes(query.toLowerCase());
        var isNameFound = phoneBook[phone][0].toLowerCase().includes(query.toLowerCase());
        var isEmailFound = (_a = phoneBook[phone][1]) === null || _a === void 0 ? void 0 : _a.toLowerCase().includes(query.toLowerCase());
        if ((isPhoneFound || isNameFound || isEmailFound)) {
            return true;
        }
        else {
            return false;
        }
    });
    return filterResult;
}
/**
 * Удаление записей по запросу из телефонной книги
 * @param {String} query
 * @returns {Number}
 */
function findAndRemove(query) {
    var deletedCount = 0;
    var fiteredContacts = filterPhoneBook(query);
    fiteredContacts.forEach(function (element) {
        delete phoneBook[element];
        deletedCount++;
    });
    return deletedCount;
}
exports.findAndRemove = findAndRemove;
/**
 * Поиск записей по запросу в телефонной книге
 * @param {String} query
 * @returns {String[]}
 */
function find(query) {
    var fiteredContacts = filterPhoneBook(query);
    var parsedPhoneBook = fiteredContacts.map(function (phone) {
        var name = phoneBook[phone][0];
        var email = phoneBook[phone][1];
        var modifiedPhone = "+7 (".concat(phone.substring(0, 3), ") ").concat(phone.substring(3, 6), "-").concat(phone.substring(6, 8), "-").concat(phone.substring(8, 10));
        if (email) {
            return "".concat(name, ", ").concat(modifiedPhone, ", ").concat(email);
        }
        else {
            return "".concat(name, ", ").concat(modifiedPhone);
        }
    });
    return parsedPhoneBook.sort();
}
exports.find = find;
var importFromCsv = function (csv) {
    var csvStringsFormat = csv.match(/.+(?=\n)/g);
    var counter = 0;
    if (!csvStringsFormat) {
        return 0;
    }
    csvStringsFormat.forEach(function (element, i) {
        var contact = csvStringsFormat[i].split(';');
        if (contact[2]) {
            if (update(contact[1], contact[0], contact[2]) || add(contact[1], contact[0], contact[2])) {
                counter++;
            }
        }
        else {
            if (update(contact[1], contact[0]) || add(contact[1], contact[0])) {
                counter++;
            }
        }
    });
    return counter;
};
exports.importFromCsv = importFromCsv;
