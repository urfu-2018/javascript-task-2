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

/**
 * Проврека на корректность номера
 * @param {String} phone
 * @returns {Boolean}
 */
function isCorrectPhone(phone) {
    return /^\d{10}$/.test(phone);
}

/**
 * Перевод из общей версии номера в Российский
 * @param {String} phone
 * @returns {String}
 */
function formatPhoneToRus(phone) {
    const a = phone.slice(0, 3);
    const b = phone.slice(3, 6);
    const c = phone.slice(6, 8);
    const d = phone.slice(8, 10);

    return `+7 (${a}) ${b}-${c}-${d}`;
}

/**
 * Проверка на входные данные
 * @param {String} phone
 * @param {String} name
 * @returns {Boolean}
 */
function isCorrectInput(phone, name) {

    return Boolean(name) && isCorrectPhone(phone);
}

/**
 * Добавление записи в телефонную книгу
 * @param {String} phone
 * @param {String?} name
 * @param {String?} email
 * @returns {Boolean}
 */
function add(phone, name, email) {
    if (!isCorrectInput(phone, name) || phone in phoneBook) {

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
    if (!isCorrectInput(phone, name) || !(phone in phoneBook)) {

        return false;
    }
    phoneBook[phone] = { name, email };

    return true;
}

/**
 * собирает все подходящие записи в массив
 * @param {String} query
 * @returns {Array}
 */
function getPhonesByQuery(query) {
    return Object.keys(phoneBook)
        .filter(phone => phone.includes(query) || phoneBook[phone].name.includes(query) ||
            (phoneBook[phone].email && phoneBook[phone].email.includes(query)))
        .sort((phoneA, phoneB) => phoneBook[phoneA].name.localeCompare(phoneBook[phoneB].name));
}

/**
 * Удаление записей по запросу из телефонной книги
 * @param {String} query
 * @returns {Number}
 */
function findAndRemove(query) {
    if (query === '') {
        return 0;
    }
    if (query === '*') {
        // т.к. * это все записи, то можно вернуть длину массива ключей и вернуть пустой объект
        const deletions = Object.keys(phoneBook).length;
        phoneBook = {};

        return deletions;
    }
    const toDelete = getPhonesByQuery(query);
    toDelete.forEach(phone => delete phoneBook[phone]);

    return toDelete.length;
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
        query = ''; // пустая строка везде найдется
    }
    let result = getPhonesByQuery(query);

    return result
        .map(phone => (phoneBook[phone].email)
            ? [phoneBook[phone].name, formatPhoneToRus(phone), phoneBook[phone].email].join(', ')
            : [phoneBook[phone].name, formatPhoneToRus(phone)].join(', '));

}

/**
 * Импорт записей из csv-формата
 * @star
 * @param {String} csv
 * @returns {Number} – количество добавленных и обновленных записей
 */
function importFromCsv(csv) {
    let updated = 0;
    const toUpdate = csv.split('\n');
    toUpdate.forEach(str => {
        const contact = str.split(';');
        const name = contact[0];
        const phone = contact[1];
        const email = contact[2];
        if (phoneBook[phone]) {
            if (update(phone, name, email)) {
                updated++;
            }
        } else if (add(phone, name, email)) {
            updated++;
        }
    });

    return updated;
}

module.exports = {
    add,
    update,
    findAndRemove,
    find,
    importFromCsv,

    isStar
};
