'use strict';
const phoneFormat = new RegExp(/^\d{3}\d{3}\d{2}\d{2}$/);

let phoneBook = [];

/**
 * Сделано задание на звездочку
 * Реализован метод importFromCsv
 */
exports.isStar = true;

function isString(value) {
    return typeof value === 'string' || value instanceof String;
}

function createRecord(phone, name, email) {
    return { phone: phone, name: name, email: email };
}

function phoneIsCorrect(phone) {
    return phoneFormat.test(phone);
}

function nameIsCorrect(name) {
    return isString(name) && name;
}

function isCorrect(name, phone) {
    return nameIsCorrect(name) && phoneIsCorrect(phone);
}

function findIndexByProperty(propertyName, propertyValue) {
    return phoneBook.map(dict => dict[propertyName]).findIndex(x => x === propertyValue);
}

function getFields(record) {
    return [record.name, record.phone, record.email];
}

function formatPhone(phone) {
    function part(left, right) {
        return phone.slice(left, right);
    }

    return `+7 (${part(0, 3)}) ${part(3, 6)}-${part(6, 8)}-${part(8, 10)}`;
}

function formatRecord(record) {
    let fields = [record.name, formatPhone(record.phone)];
    if (isString(record.email) && record.email) {
        fields.push(record.email);
    }

    return fields.join(', ');
}

function isRecordMatchQuery(field, query) {
    return query === '*' || (field !== undefined && field.includes(query));
}

function findIndexesByQuery(query) {
    if (!(isString(query) && query)) {
        return [];
    }
    let indexes = [];
    for (let i = 0; i < phoneBook.length; ++i) {
        if (getFields(phoneBook[i]).some(field => isRecordMatchQuery(field, query))) {
            indexes.push(i);
        }
    }

    return indexes;
}

/**
 * Добавление записи в телефонную книгу
 * @param {String} phone
 * @param {String?} name
 * @param {String?} email
 * @returns {Boolean}
 */
exports.add = function (phone, name, email) {
    if (!isCorrect(name, phone) || findIndexByProperty('phone', phone) !== -1) {
        return false;
    }
    phoneBook.push(createRecord(phone, name, email));

    return true;
};

/**
 * Обновление записи в телефонной книге
 * @param {String} phone
 * @param {String?} name
 * @param {String?} email
 * @returns {Boolean}
 */
exports.update = function (phone, name, email) {
    let indexFound = findIndexByProperty('phone', phone);
    if (!isCorrect(name, phone) || indexFound === -1) {
        return false;
    }
    phoneBook[indexFound] = createRecord(phone, name, email);

    return true;
};

/**
 * Удаление записей по запросу из телефонной книги
 * @param {String} query
 * @returns {Number}
 */
exports.findAndRemove = function (query) {
    let found = findIndexesByQuery(query);
    for (let indexFound of found.reverse()) {
        phoneBook.splice(indexFound, 1);
    }

    return found.length;
};

/**
 * Поиск записей по запросу в телефонной книге
 * @param {String} query
 * @returns {String[]}
 */
exports.find = function (query) {
    return findIndexesByQuery(query)
        .map(index => phoneBook[index])
        .sort((a, b) => a.name.localeCompare(b.name))
        .map(formatRecord);
};

/**
 * Импорт записей из csv-формата
 * @star
 * @param {String} csv
 * @returns {Number} – количество добавленных и обновленных записей
 */
exports.importFromCsv = function (csv) {
    let countAddedOrUpdated = 0;
    for (let csvLine of csv.split('\n')) {
        let split = csvLine.split(';');
        if (exports.add(split[1], split[0], split[2]) ||
            exports.update(split[1], split[0], split[2])) {
            countAddedOrUpdated++;
        }
    }

    return countAddedOrUpdated;
};
