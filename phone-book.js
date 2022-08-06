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
/**
 * Удаление записей по запросу из телефонной книги
 * @param {String} query
 * @returns {Number}
 */
function findAndRemove(query) {
    // Преобразуем в phoneBook в массив, добавляем счетчик
    var arrayPhoneBook = Object.entries(phoneBook);
    var deletedCount = 0;
    // Условие для ''
    if (query === '') {
        return 0;
    }
    // Условие для '*'
    if (query === '*') {
        query = '';
    }
    // Фильтрация массива
    for (var i = 0; i < arrayPhoneBook.length; i++) {
        var targetPhone = arrayPhoneBook[i][0];
        var targetName = arrayPhoneBook[i][1][0];
        var targetEmail = arrayPhoneBook[i][1][1];
        var isPhoneFound = targetPhone.toLowerCase().includes(query.toLowerCase());
        var isNameFound = targetName.toLowerCase().includes(query.toLowerCase());
        var isEmailFound = targetEmail === null || targetEmail === void 0 ? void 0 : targetEmail.toLowerCase().includes(query.toLowerCase());
        if ((isPhoneFound || isNameFound || isEmailFound)) {
            delete phoneBook[targetPhone];
            deletedCount++;
        }
    }
    return deletedCount;
}
exports.findAndRemove = findAndRemove;
/**
 * Поиск записей по запросу в телефонной книге
 * @param {String} query
 * @returns {String[]}
 */
function find(query) {
    // Преобразуем в phoneBook в массив, добавляем массив выходных данных
    var arrayPhoneBook = Object.entries(phoneBook);
    var parsedPhoneBook = [''];
    // Условие для ''
    if (query === '') {
        return [''];
    }
    // Условие для '*'
    if (query === '*') {
        query = '';
    }
    // Фильтрация массива
    for (var i = 0; i < arrayPhoneBook.length; i++) {
        var targetPhone = arrayPhoneBook[i][0];
        var targetName = arrayPhoneBook[i][1][0];
        var targetEmail = arrayPhoneBook[i][1][1];
        var isEmailTypeString = typeof targetEmail === 'string';
        var isPhoneFound = targetPhone.toLowerCase().includes(query.toLowerCase());
        var isNameFound = targetName.toLowerCase().includes(query.toLowerCase());
        var isEmailFound = targetEmail === null || targetEmail === void 0 ? void 0 : targetEmail.toLowerCase().includes(query.toLowerCase());
        if ((isPhoneFound || isNameFound || isEmailFound)) {
            var modifiedPhone = "+7 (".concat(targetPhone.substring(0, 3), ") ").concat(targetPhone.substring(3, 6), "-").concat(targetPhone.substring(6, 8), "-").concat(targetPhone.substring(8, 10));
            if (isEmailTypeString) {
                parsedPhoneBook[i] = "".concat(targetName, ", ").concat(modifiedPhone, ", ").concat(targetEmail);
            }
            else {
                parsedPhoneBook[i] = "".concat(targetName, ", ").concat(modifiedPhone);
            }
        }
        else {
            arrayPhoneBook.splice(i, 1);
            i = i - 1;
        }
    }
    return parsedPhoneBook.sort();
}
exports.find = find;
var importFromCsv = function (csv) {
    // Парсим csv
    // Добавляем в телефонную книгу
    // Либо обновляем, если запись с таким телефоном уже существует
    var csvStringsFormat = csv.match(/.+(?=\n)/g);
    var counter = 0;
    if (!(csvStringsFormat === null)) {
        for (var i = 0; i < csvStringsFormat.length; i++) {
            var contact = csvStringsFormat[i].split(';');
            if (typeof contact[2] === 'undefined') {
                if (update(contact[1], contact[0]) || add(contact[1], contact[0])) {
                    counter++;
                }
            }
            else {
                if (update(contact[1], contact[0], contact[2]) || add(contact[1], contact[0], contact[2])) {
                    counter++;
                }
            }
        }
    }
    return counter;
};
exports.importFromCsv = importFromCsv;
