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
 * Добавление записи в телефонную книгу
 * @param {String} phone
 * @param {String?} name
 * @param {String?} email
 * @returns {Boolean}
 */
function add(phone, name, email) {
    if (!name || !/^\d{10}$/.test(phone) || phoneBook.hasOwnProperty(phone)) {

        return false;
    }
    phoneBook[phone] = [name, email];

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
    const canAdd = !phoneBook.hasOwnProperty(phone) || !name;
    if (canAdd) {
        return false;
    }
    phoneBook[phone] = [name, email];

    return true;
}

function convertPhoneNumber(number) {
    const convertedNumber = `+7 (${number.slice(0, 3)})` +
        ` ${number.slice(3, 6)}` +
        `-${number.slice(6, 8)}` +
        `-${number.slice(8, 10)}`;

    return convertedNumber;
}

function toFormattedStrings(obj) {
    const unconvertedData = Object.entries(obj);

    return unconvertedData.map(function (item) {
        const [phone, [name, email]] = item;

        return [name, phone, email].join(', ');
    });
}

function convertForShow(arr) {
    return arr.map(function (item) {
        let [name, phone, email] = item.split(', ');
        phone = convertPhoneNumber(phone);

        return [name, phone, email].join(', ').replace(/,\s*$/, '');
    });
}
function removeFromSearch(arr, searchParam) {
    return arr.filter(function (item) {
        const data = item.split(', ');
        const canBeSearchedConditions = data[0].indexOf(searchParam) !== -1 ||
            data[1].indexOf(searchParam) !== -1 ||
            data[2].indexOf(searchParam) !== -1;

        return canBeSearchedConditions;
    });

}
function sortАlphabetically(a, b) {
    const a1 = a.slice(0, a.indexOf(',')).toLowerCase();
    const b1 = b.slice(0, b.indexOf(',')).toLowerCase();

    return a1.localeCompare(b1);
}

/**
 * Удаление записей по запросу из телефонной книги
 * @param {String} query
 * @returns {Number}
 */
function findAndRemove(query) {
    if (!query) {
        return 0;
    }

    if (query === '*') {
        const totalCount = toFormattedStrings(phoneBook).length;
        phoneBook = {};

        return totalCount;
    }
    let countOfDeletedItems = 0;
    const arrForSearch = toFormattedStrings(phoneBook);
    arrForSearch.forEach(function (item) {
        const data = item.split(', ');
        const CanBeDeleted = data[0].indexOf(query) !== -1 ||
            data[1].indexOf(query) !== -1 ||
            data[2].indexOf(query) !== -1;
        if (CanBeDeleted) {
            countOfDeletedItems ++;
            const phone = data[1];
            delete phoneBook[phone];
        }
    });

    return countOfDeletedItems;
}

/**
 * Поиск записей по запросу в телефонной книге
 * @param {String} query
 * @returns {String[]}
 */
function find(query) {
    if (!query) {
        return [];
    }

    if (query === '*') {
        const unsortedResult = convertForShow(toFormattedStrings(phoneBook));

        return unsortedResult.sort(sortАlphabetically);
    }
    const unsortedResult = convertForShow(removeFromSearch(toFormattedStrings(phoneBook), query));

    return unsortedResult.sort(sortАlphabetically);
}

/**
 * Импорт записей из csv-формата
 * @star
 * @param {String} csv
 * @returns {Number} – количество добавленных и обновленных записей
 */
function importFromCsv(csv) {
    let csvArr = csv.split('\n');
    let addCount = 0;
    let updatedCount = 0;
    csvArr.forEach(function (item) {
        let [name, phone, email] = item.split(';');
        if (add(phone, name, email)) {
            addCount++;
        } else if (update(phone, name, email)) {
            updatedCount++;
        }
    });

    return addCount + updatedCount;
}

module.exports = {
    add,
    update,
    findAndRemove,
    find,
    importFromCsv,

    isStar
};
