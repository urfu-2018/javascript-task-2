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
    if (typeof phone !== 'string' || typeof name !== 'string' || !phoneBook[phone]) {
        console.log('FALSE1');
        return false;
    }
    if (/^[0-9]{10}$/.test(phone) && name) {
        phoneBook[phone] = (`${name}, ${formatNumber(phone)}${email ? `, ${email}` : ''}`)
        console.log(`${name}, ${formatNumber(phone)}${email ? `, ${email}` : ''}`)
        return true;
    }
    console.log('FALSE2');
    return false;
}

function formatNumber(phone){
    return phone.replace(/^(\d{3})(\d{3})(\d{2})(\d{2})$/, '+7 ($1) $2-$3-$4');
    `${name}, ${formatNumber(phone)}${email ? `, ${email}` : ''}`;
}

/**
 * Обновление записи в телефонной книге
 * @param {String} phone
 * @param {String?} name
 * @param {String?} email
 * @returns {Boolean}
 */
function update(phone, name, email) {
    if (typeof phone !== 'string' || typeof name !== 'string') {
        console.log('FALSE1');
        return false;
    }
    if (/^[0-9]{10}$/.test(phone) && name) {
        phoneBook[phone] = (`${name}, ${formatNumber(phone)}${email ? `, ${email}` : ''}`)
        console.log(`${name}, ${formatNumber(phone)}${email ? `, ${email}` : ''}`)
        return true;
    }
    console.log('FALSE2');
    return false;
}

/**
 * Удаление записей по запросу из телефонной книги
 * @param {String} query
 * @returns {Number}
 */
function findAndRemove(query) {
    const find = this.find(query);
    const res = find.length;
    //find.forEach(z => delete z);
    return res;
}

/**
 * Поиск записей по запросу в телефонной книге
 * @param {String} query
 * @returns {String[]}
 */
function find(query) {
    if (typeof query !== 'string') {
        throw new TypeError();
    }
    console.log(phoneBook.values)
    return query === '*' ? (phoneBook.sort()) :
    phoneBook.filter(x => x.include(query)).sort();
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
    formatNumber, // delete

    isStar
};
