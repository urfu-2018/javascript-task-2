'use strict';

/**
 * Сделано задание на звездочку
 * Реализован метод importFromCsv
 */
const isStar = true;

/**
 * Телефонная книга
 */
const phoneBook = {};

function checkValid(phone, name, email) {
    const phonePattern = new RegExp('^\\d{10}$');
    const phoneValid = typeof phone === 'string' && phonePattern.test(phone);
    const nameValid = typeof name === 'string' && name !== '';
    const emailValid = (email !== undefined) ? typeof email === 'string' : true;

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
        if (email) {
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
    Object.keys(phoneBook).map(objectKey => {
        const phone = objectKey.indexOf(query);
        const name = phoneBook[objectKey][0].indexOf(query);
        let email = -1;
        if (phoneBook[objectKey][1]) {
            email = phoneBook[objectKey][1].indexOf(query);
        }
        if (phone !== -1 || name !== -1 || email !== -1 || query === '*') {
            delete phoneBook[objectKey];
            count++;
        }

        return false;
    }
    );

    return count;
}

function findQuery(key, name, email, query) {
    const checkK = key.indexOf(query);
    const checkN = name.indexOf(query);
    let checkE = email;
    if (email) {
        checkE = email.indexOf(query);
    } else {
        checkE = -1;
    }
    if (checkK !== -1 || checkN !== -1 || checkE !== -1 || query === '*') {

        return true;
    }

    return false;
}

/**
 * Поиск записей по запросу в телефонной книге
 * @param {String} query
 * @returns {String[]}
 */
function find(query) {
    let listQuery = [];
    if (!query || query === '' || query === undefined || typeof query !== 'string') {

        return listQuery;
    }
    Object.keys(phoneBook).map(objectKey => {
        const number = objectKey;
        const name = phoneBook[objectKey][0];
        const email = phoneBook[objectKey][1];
        if (findQuery(number, name, email, query)) {
            const phone = [];
            phone[0] = '+7 (' + number.slice(0, 3) + ') ';
            phone[1] = number.slice(3, 6) + '-';
            phone[2] = number.slice(6, 8) + '-';
            phone[3] = number.slice(8);
            const emailTrue = (email !== undefined && email !== '') ? ', ' + email : '';
            let item = name + ', ' + phone[0] + phone[1] + phone[2] + phone[3] + emailTrue;
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
    const array = csv.split('\n');
    array.forEach(
        function (item) {
            const [name, phone, email] = item.split(';');
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
