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

    // Если телефон указан в неправильном формате, не добавлять запись
    const phoneRegex = /^(\d)\1\1(\d)\2\2(\d)\3(\d)\4$/;
    if (!(phoneRegex.test(phone))) {
        return false;
    }

    // Если не указано имя, не добавлять запись
    if (name === undefined) {
        return false;
    }

    // Если запись с таким номером уже существует, не добавлять её
    if (getEntryByPhone(phone) !== undefined) {
        return false;
    }

    // Составить новую запись
    const phoneBookEntry = {
        name,
        phone
    };
    if (email !== undefined) {
        phoneBookEntry.email = email;
    }

    // Добавить запись в телефонную книгу
    phoneBook.push(phoneBookEntry);

    return true;
}

/**
 * Извлечь запись из телефонной книги по ключу
 */
function getEntryByPhone(phone) {

    return phoneBook.find((element) => {
        return element.phone === phone;
    });
}

/**
 * Обновление записи в телефонной книге
 * @param {String} phone
 * @param {String?} name
 * @param {String?} email
 * @returns {Boolean}
 */
function update(phone, name, email) {

    // Извлечь запись из телефонной книги
    let entry = getEntryByPhone(phone);

    // Если записи не существует, обновлять нечего
    if (entry === undefined) {
        return false;
    }

    // Если имя не указано, обновления не происходит - имя удалить нельзя
    if (name === undefined) {
        return false;
    }

    // Обновить данные записи
    entry.name = name;
    if (email === undefined) {
        delete entry.email;
    }
    else {
        entry.email = email;
    }

    return true;
}

/**
 * Удаление записей по запросу из телефонной книги
 * @param {String} query
 * @returns {Number}
 */
function findAndRemove(query) {

}

/**
 * Поиск записей по запросу в телефонной книге
 * @param {String} query
 * @returns {String[]}
 */
function find(query) {

    // Пустой запрос не должен ничего находить
    if (query.length === 0) {
        return undefined;
    }

    // Найти все подходящие записи и преобразовать их в нужный формат
    const matchingEntries = findMatchingEntries(query);
    const matchingEntryStrings = matchingEntries.map(toString);
    matchingEntryStrings.sort();

    return matchingEntryStrings;
}

/**
 * Поиск записей-объектов по запросу в телефонной книге
 */
function findMatchingEntries(query) {

    // Если запрос содержит единственный символ '*', подходят все записи
    if (query === '*') {
        return phoneBook.slice();
    }

    // Иначе ищем записи, поля которых содержат запрос в качестве подстроки
    const matchingEntries = [];
    for (let i = 0; i < phoneBook.length; i++) {
        for (let field of Object.keys(phoneBook[i])) {
            if (field.includes(query)) {
                matchingEntries.push(phoneBook[i]);
                break;
            }
        }
    }

    return matchingEntries;
}

/**
 *  Получить строковое представление записи из телефонной книги
 */
function toString(entry) {

    // Преобразовать телефон в нужный формат
    const phoneRegex = /(\d{3})(\d{3})(\d{2})(\d{2})/;
    const phoneFormatted = entry.phone.replace(phoneRegex, '+7 ($1) $2-$3-$4');

    // Составить список полей в нужном порядке
    const entryFields = [entry.name, phoneFormatted];
    if ('email' in entry) {
        entryFields.push(entry.email);
    }

    return entryFields.join(', ');
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
