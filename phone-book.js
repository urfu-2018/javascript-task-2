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

function checkValid(phone, name, email) {
    let phonePattern = new RegExp('^\\d{10}$');
    let phoneValid = typeof phone === 'string' && phonePattern.test(phone);
    let nameValid = typeof name === 'string' && name !== '';
    let emailValid = (email !== undefined) ? typeof email === 'string' : true;

    return phoneValid && nameValid && emailValid;
}

/**
 * Добавление записи в телефонную книгу
 * @param {String} phone
 * @param {String?} name
 * @param {String?} email
 * @returns {Boolean}
 */
function add(phone, name, email) {
    if (checkValid(phone, name, email) && !(phone.replace(/[^0-9]+/, '') in phoneBook)) {
        phoneBook[phone] = [name];
        if (email !== '' && email) {
            phoneBook[phone][1] = email;
        }

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
    if (checkValid(phone, name, email) && (phone.replace(/[^0-9]+/, '') in phoneBook)) {
        phoneBook[phone][0] = name;
        if (email !== '' && email) {
            phoneBook[phone][1] = email;
        } else {
            phoneBook[phone].splice(1, 1);
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
    let count = 0;
    if (query === '' || query === undefined || typeof query !== 'string') {

        return count;
    }
    Object.keys(phoneBook).map(
        function (objectKey) {
            let k = objectKey;
            let p = '+7 (' + k.slice(0, 3) + ') ';
            p += k.slice(3, 6) + '-' + k.slice(6, 8) + '-' + k.slice(8);
            let n = phoneBook[k][0];
            let e = phoneBook[k][1];
            let emailTrue = (e !== undefined && e !== '') ? ', ' + e : '';
            let item = n + ', ' + p + emailTrue;
            if (item.indexOf(query) !== -1 || query === '*') {
                delete phoneBook[objectKey];
                count++;
            }

            return false;
        }
    );

    return count;
}

/**
 * Поиск записей по запросу в телефонной книге
 * @param {String} query
 * @returns {String[]}
 */
function find(query) {
    let listQuery = [];
    if (query === '' || query === undefined || typeof query !== 'string') {

        return listQuery;
    }
    Object.keys(phoneBook).map(
        function (objectKey) {
            let k = objectKey;
            let p = '+7 (' + k.slice(0, 3) + ') ';
            p += k.slice(3, 6) + '-' + k.slice(6, 8) + '-' + k.slice(8);
            let n = phoneBook[k][0];
            let e = phoneBook[k][1];
            let emailTrue = (e !== undefined && e !== '') ? ', ' + e : '';
            let item = n + ', ' + p + emailTrue;
            if (item.indexOf(query) !== -1 || query === '*') {
                listQuery.push(item);
            }

            return false;
        }
    );

    return listQuery.sort();
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
    let count = 0;
    let array = csv.split('\n');
    array.forEach(
        function (item) {
            let arr = item.split(';');
            let name = arr[0];
            let phone = arr[1];
            let email = arr[2];
            if (checkValid(phone, name, email)) {
                phoneBook[phone] = [name];
                count++;
            }
            if (checkValid(phone, name, email) && email) {
                phoneBook[phone][1] = email;
            }
        }
    );

    return count;
}


module.exports = {
    add,
    update,
    findAndRemove,
    find,
    importFromCsv,
    isStar
};
