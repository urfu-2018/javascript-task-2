'use strict';

/**
 * Сделано задание на звездочку
 * Реализован метод importFromCsv
 */
const isStar = false;

/**
 * Телефонная книга
 */
let phoneBook = {};

/**
 * Добавление записи в телефонную книгу
 * @param {String} phone
 * @param {String?} name
 * @param {String?} email
 * @returns {Boolean}
 */
function add(phone, name, email) {
    if (typeof(phone) !== 'string' || !((/^\d{10}$/).test(phone)) || name === '' ||
    name === undefined || phoneBook.hasOwnProperty(phone)) {

        return false;
    }
    phoneBook[phone] = { name, email };

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
    if (!(phone in phoneBook) || name === '' || name === undefined) {

        return false;
    }
    phoneBook[phone] = { name, email };

    return true;
}

/**
 * Удаление записей по запросу из телефонной книги
 * @param {String} query
 * @returns {Number}
 */
function findAndRemove(query) {
    const arrforDelete = findWithoutOutput(query);
    for (let i of arrforDelete) {
        delete phoneBook[i];
    }

    return arrforDelete.length;
}

/**
 * Поиск записей по запросу в телефонной книге
 * @param {String} query
 * @returns {String[]}
 */
function find(query) {
    if (typeof query !== 'string' || query === '' || query === undefined) {

        return [];
    }
    if (query === '*') {
        let arrofAll = sortArrayfromAtoZbyName(Object.keys(phoneBook));

        return outPutofFind(arrofAll);
    }

    return outPutofFind(findWithoutOutput(query));
}

function outPutofFind(somearray) {
    return somearray.map(phone => (phoneBook[phone].email)
        ? [phoneBook[phone].name, transferPhone(phone), phoneBook[phone].email].join(', ')
        : [phoneBook[phone].name, transferPhone(phone)].join(', '));
}

function findWithoutOutput(query) {
    let allkey = Object.keys(phoneBook);
    let detectedAr = choicebyPhone(allkey, query);

    return sortArrayfromAtoZbyName(detectedAr);
}

function transferPhone(phone) {
    const first3num = phone.substring(0, 3);
    const second3num = phone.substring(3, 6);
    const third2num = phone.substring(6, 8);
    const fourth2num = phone.substring(8, 10);

    return `+7 (${first3num}) ${second3num}-${third2num}-${fourth2num}`;
}

function choicebyPhone(somearray, query) {

    return somearray.filter(phone => phoneBook[phone].name.includes(query) ||
    (phoneBook[phone].email !== undefined && phoneBook[phone].email.includes(query)) ||
    phone.includes(query));
}

function sortArrayfromAtoZbyName(somearray) {

    return somearray.sort((a, b) => phoneBook[a].name > phoneBook[b].name);
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

    return csv.split('\n').length;
}

module.exports = {
    add,
    update,
    findAndRemove,
    find,
    importFromCsv,

    isStar
};
