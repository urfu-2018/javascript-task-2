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

/**
 * Добавление записи в телефонную книгу
 * @param {String} phone
 * @param {String?} name
 * @param {String?} email
 * @returns {Boolean}
 */
function add(phone, name, email) {
    if (!checkPhone(phone) || !name) {
        return false;
    }
    for (let i = 0; i < phoneBook.length; i++) {
        if (phoneBook[i].phone === phone) {
            return false;
        }
    }
    let objUser = {
        phone,
        name,
        email
    };
    phoneBook.push(objUser);

    return true;

}
function checkPhone(phone) {
    if (phone === undefined) {
        return false;
    }

    return phone.toString().match(/^[0-9]{10}$/) !== null;
}

/**
 * Обновление записи в телефонной книге
 * @param {String} phone
 * @param {String?} name
 * @param {String?} email
 * @returns {Boolean}
 */
function update(phone, name, email) {
    for (let i = 0; i < phoneBook.length; i++) {
        if (phoneBook[i].phone === phone && name) {
            phoneBook[i].name = name;
            phoneBook[i].email = email;

            return true;
        }
    }

    return false;
}

/**
 * Удаление записей по запросу из телефонной книги
 * @param {String} query
 * @returns {Number}
 */
function findAndRemove(query) {
    let arrList = find(query);
    let RemoveCount = 0;
    arrList.forEach(function searchUser(note) {
        for (let j = 0; j < phoneBook.length; j++) {
            if (note.split(', ')[1] === changePhone(phoneBook[j].phone)) {
                phoneBook.splice(j, 1);
                RemoveCount++;
            }
        }
    });

    return RemoveCount;
}

/**
 * Поиск записей по запросу в телефонной книге
 * @param {String} query
 * @returns {String[]}
 */
function find(query) {
    let arrUser = [];
    if (!query) {
        return arrUser;
    }
    arrUser = phoneBook.filter (function (dataUser) {
        function scanData(info) {
            return (info !== undefined && info.indexOf(query) !== -1 || query === '*');
        }

        return scanData(dataUser.name) || scanData(dataUser.phone) || scanData(dataUser.email);
    });
    for (let i = 0; i < arrUser.length; i++) {
        let resultUser;
        if (arrUser[i].email !== undefined) {
            resultUser = arrUser[i].name +
                ', ' + changePhone(arrUser[i].phone) +
                ', ' + arrUser[i].email;
        } else {
            resultUser = arrUser[i].name + ', ' + changePhone(arrUser[i].phone);
        }
        arrUser[i] = resultUser;
    }

    return arrUser.sort();
}

/**
 * Формат телефона
 * @param {String} phone
 * @returns {String}
 */
function changePhone(phone) {
    return `+7 (${phone.slice(0, 3)}) ` +
        `${phone.slice(3, 6)}-` +
        `${phone.slice(6, 8)}-` +
        `${phone.slice(8)}`;
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
    let csvCount = 0;
    let csvArr = csv.split('\n');
    for (let i = 0; i < csvArr.length; i++) {
        let name = csvArr[i].split(';')[0];
        let phone = csvArr[i].split(';')[1];
        let email = csvArr[i].split(';')[2];
        if (add(phone, name, email) || update(phone, name, email)) {
            csvCount++;
        }
    }

    return csvCount;

}

module.exports = {
    add,
    update,
    findAndRemove,
    find,
    importFromCsv,

    isStar
};
