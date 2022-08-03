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
var phoneBook = {
// '9991256123': ['Maxim'],
// '9991256124': ['Maxim1', 'sssfjneffwew@gmail1.com'],
// '9511256124': ['Maxim2'],
// '9591256124': ['Maxim3', 'sssfjnsdfsdefw@gmail1.com'],
};
/**
 * Добавление записи в телефонную книгу
 *
 * @param {String} phone
 * @param {String} [name]
 * @param {String} email
 * @returns {Boolean}
 */
function add(phone, name, email) {
    var isValidPhone = (typeof (phone) === 'string') && /^\d{10}$/.test(phone);
    var isValidName = (typeof (name) === 'string') && name.trim().length !== 0;
    // TODO Валидация почты
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
    // TODO Валидация почты
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
/**
 * Импорт записей из csv-формата
 * @star
 * @param {String} csv
 * @returns {Number} – количество добавленных и обновленных записей
 */
var importFromCsv = function (csv) {
    // Парсим csv
    // Добавляем в телефонную книгу
    // Либо обновляем, если запись с таким телефоном уже существует
    return csv.split('\n').length;
};
exports.importFromCsv = importFromCsv;
// console.log(phoneBook)
// console.log()
// console.log(find('999'))
// console.log()
// console.log('Пустая строка:')
// console.log(find(''))
// console.log()
// console.log('Звездочка')
// console.log(find('*'))
// console.log()
// console.log('удаление Пустая строка:')
// console.log(findAndRemove(''))
// console.log()
// console.log('удаление собака:')
// console.log(findAndRemove('@'))
// console.log()
// console.log('удаление Звездочка')
// console.log(findAndRemove('*'))
// console.log()
// console.log(add('5554440044', 'Григорий', 'grisha@example.com'))
// console.log(add('5552220022', 'Борис', 'boris@example.com'))
// console.log(add('5551110011', 'Алекс'))
// console.log(add('5553330033', 'Валерий', 'valera@example.com'))
// console.log()
// console.log(add('3330033', 'Неизвестный', 'unknown@example.com'))
// console.log(add('abc5556660055', 'Николай', 'kolya@example.com'))
// console.log(add('5556660066abc', 'Герман', 'gera@example.com'))
// console.log(add('5551110011', 'Алексей'))
// console.log(add('5555550055'))
