'use strict';

/**
 * Сделано задание на звездочку
 * Реализован метод importFromCsv
 */
const isStar = true;

/**
 * Телефонная книга
 */
const phoneBook = new Map();

/**
 * Добавление записи в телефонную книгу
 * @param {String} phone
 * @param {String?} name
 * @param {String?} email
 * @returns {Boolean}
 */
function add(phone, name, email) {
    if (isCorrectData(phone, name) && !phoneBook.has(phone)) {
        phoneBook.set(phone, { name, email });

        return true;
    }

    return false;
}

function isCorrectData(phone, name) {
    return isPhone(phone) && isName(name);
}

function isPhone(phone) {
    return typeof phone === 'string' && /^\d{10}$/.test(phone);
}

function isName(name) {
    return typeof name === 'string' && name !== '';
}

function isEmail(email) {
    return typeof email === 'string' && email !== '';
}

/**
 * Обновление записи в телефонной книге
 * @param {String} phone
 * @param {String?} name
 * @param {String?} email
 * @returns {Boolean}
 */
function update(phone, name, email) {
    if (isCorrectData(phone, name) && phoneBook.has(phone)) {
        phoneBook.set(phone, { name, email });

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
    if (query === '' || typeof query !== 'string') {
        return 0;
    }
    const toDelete = findAllRecords(query);
    const count = toDelete.length;
    deleteAllRecords(toDelete);

    return count;
}

function deleteAllRecords(toDelete) {
    for (let line of toDelete) {
        phoneBook.delete(line.phone);
    }
}

function findAllRecords(query) {
    const result = [];
    for (let phone of phoneBook.keys()) {
        if (dataIncludesQuery(phone, phoneBook.get(phone).name,
            phoneBook.get(phone).email, query)) {
            result.push({
                phone,
                name: phoneBook.get(phone).name,
                email: phoneBook.get(phone).email });
        }
    }

    return result;
}

function dataIncludesQuery(phone, name, email, query) {
    return phone.includes(query) ||
            name.includes(query) ||
            (isEmail(email) && email.includes(query)) ||
            query === '*';
}

/**
 * Поиск записей по запросу в телефонной книге
 * @param {String} query
 * @returns {String[]}
 */
function find(query) {
    if (query === '' || typeof query !== 'string') {
        return [];
    }
    const result = findAllRecords(query);

    return bookToString(result);
}

function bookToString(records) {
    let result = [];
    for (let i = 0; i < records.length; i++) {
        const record = records[i];
        const phone = record.phone;
        const ph = `+7 (${phone.substr(0, 3)}) ${phone.substr(3, 3)}-${
            phone.substr(6, 2)}-${phone.substr(8, 2)}`;
        const name = record.name;
        const email = typeof record.email === 'undefined' ? '' : ', ' + record.email;
        result.push(`${name}, ${ph}${email}`);
    }

    return result.sort();
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
    for (let line of csv.split('\n')) {
        const [name, phone, email] = line.split(';');
        count += (add(phone, name, email) || update(phone, name, email)) ? 1 : 0;
    }

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
