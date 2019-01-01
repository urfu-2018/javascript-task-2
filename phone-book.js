'use strict';

/**
 * Сделано задание на звездочку
 * Реализован метод importFromCsv
 */
const isStar = true;

class Record {
    constructor(name, phone, email) {
        this.name = name;
        this.phone = phone;
        this.email = email;
    }

    isContainsQuery(query) {
        return this.name.includes(query) ||
            this.phone.includes(query) ||
            this.email !== undefined && this.email.includes(query);
    }

    getFomattedPhone() {
        var secondPart = [this.phone.slice(3, 6), this.phone.slice(6, 8), this.phone.slice(8, 10)];

        return `+7 (${this.phone.slice(0, 3)}) ${secondPart.join('-')}`;
    }

    getPrettyRecord() {
        return [this.name, this.getFomattedPhone(), this.email]
            .filter(value => typeof value === 'string').join(', ');
    }
}

function createRecord(name, phone, email) {
    if (validatePhone(phone) && validateName(name)) {
        return new Record(name, phone, email);
    }

    function validatePhone(arg) {
        return typeof arg === 'string' && /^\d{10}$/.test(arg);
    }

    function validateName(arg) {
        return typeof arg === 'string' && arg !== '';
    }
}


/**
 * Телефонная книга
 */
let phoneBook = new Map();

/**
 * Добавление записи в телефонную книгу
 * @param {String} phone
 * @param {String?} name
 * @param {String?} email
 * @returns {Boolean}
 */
function add(phone, name, email) {
    const newRecord = createRecord(name, phone, email);

    if (newRecord === undefined || phoneBook.has(phone)) {
        return false;
    }
    phoneBook.set(phone, newRecord);

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
    const newRecord = createRecord(name, phone, email);

    if (phoneBook.has(phone) && newRecord !== undefined) {
        phoneBook.set(phone, newRecord);

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
    return findRecords(query)
        .map(value => phoneBook.delete(value.phone))
        .length;
}

/**
 * Поиск записей по запросу в телефонной книге
 * @param {String} query
 * @returns {String[]}
 */
function find(query) {
    return findRecords(query).map(value => value.getPrettyRecord());
}

/**
 * Возвращает массив объектов с контактными данными из справочника, соответствующих запросу
 * @param {String} query - поисковый запрос
 * @returns {Array}
 */
function findRecords(query) {
    if (typeof query !== 'string' || query === '') {
        return [];
    }

    let entries = Array.from(phoneBook.values());
    entries.sort((first, second) => first.name.localeCompare(second.name));

    return entries.filter(value => query === '*' || value.isContainsQuery(query));
}

/**
 * Импорт записей из csv-формата
 * @star
 * @param {String} csv
 * @returns {Number} – количество добавленных и обновленных записей
 */
function importFromCsv(csv) {
    var recordsCount = 0;

    csv.split('\n').forEach(line => {
        const [name, phone, email] = line.split(';');
        if (add(phone, name, email) || update(phone, name, email)) {
            recordsCount += 1;
        }
    });

    return recordsCount;
}

module.exports = {
    add,
    update,
    findAndRemove,
    find,
    importFromCsv,
    isStar
};
