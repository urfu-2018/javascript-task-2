'use strict';

/**
 * Сделано задание на звездочку
 * Реализован метод importFromCsv
 */
const isStar = false;

/**
 * Шаблон телефонного номера
 */
const phoneRegExp = /^\d{10}$/;

/**
 * Телефонная книга
 */
let phoneBook = new Map();

/**
 * Проверка аргументов
 * @param {String} phone
 * @param {String} name
 * @returns {Boolean}
 */
function areValid(phone, name) {
    return (typeof phone === 'string' && typeof name === 'string' &&
        phoneRegExp.test(phone) && name);
}

/**
 * Поиск по данному запросу
 * @param {String} query
 * @returns {Array<Array<String, Array<String>>>}
 */
function getEntries(query) {
    if (typeof query !== 'string' || !query) {
        return [];
    }

    const phoneBookEntries = Array.from(phoneBook);

    return query === '*'
        ? phoneBookEntries
        : phoneBookEntries
            .filter(keyValue => {
                let [phone, info] = keyValue;

                return phone.includes(query) || info.some(note => note.includes(query));
            });
}

/**
 * Форматирование номера телефона
 * @param {String} num
 * @returns {String}
 */
function formatPhone(num) {
    return `+7 (${num.slice(0, 3)}) ${num.slice(3, 6)}-${num.slice(6, 8)}-${num.slice(8, 10)}`;
}

/**
 * Добавление записи в телефонную книгу
 * @param {String} phone
 * @param {String?} name
 * @param {String?} email
 * @returns {Boolean}
 */
function add(phone, name = '', email = '') {
    if (!areValid(phone, name) || phoneBook.has(phone)) {
        return false;
    }
    phoneBook.set(phone, [name, email]);

    return true;
}

/**
 * Обновление записи в телефонной книге
 * @param {String} phone
 * @param {String?} name
 * @param {String?} email
 * @returns {Boolean}
 */
function update(phone, name = '', email = '') {
    if (!areValid(phone, name) || !phoneBook.has(phone)) {
        return false;
    }
    phoneBook.set(phone, [name, email]);

    return true;
}

/**
 * Удаление записей по запросу из телефонной книги
 * @param {String} query
 * @returns {Number}
 */
function findAndRemove(query) {
    let queryEntries = getEntries(query);
    queryEntries.forEach(([phone]) => phoneBook.delete(phone));

    return queryEntries.length;
}

/**
 * Поиск записей по запросу в телефонной книге
 * @param {String} query
 * @returns {String[]}
 */
function find(query) {
    let queryEntries = getEntries(query);

    return queryEntries
        .map(([phone, info]) => {
            let output = [info[0], formatPhone(phone)];
            if (info[1]) {
                output.push(info[1]);
            }

            return output.join(', ');
        })
        .sort();
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
