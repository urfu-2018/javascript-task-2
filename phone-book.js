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
    if (!name || ! /^\d{10}$/.test(phone) || phoneBook.hasOwnProperty(phone)) {

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
    const notOk = !phoneBook.hasOwnProperty(phone) || !name;
    if (notOk) {

        return false;
    }
    phoneBook[phone] = [name, email];

    return true;
}
// В обоих случаях вывод будет следующий
// [
//   'Алексей, +7 (555) 111-00-11, alex@example.com',
//   'Борис, +7 (555) 222-00-22, boris@example.com',
//   'Валерий, +7 (555) 333-00-33',
//   'Григорий, +7 (555) 444-00-44, grisha@example.com'
// ]
// { '5554440044': [ 'Григорий', 'grisha@example.com' ],
//   '5552220022': [ 'Борис', 'boris@example.com' ],
//   '5551110011': [ 'Алексей', 'alex@example.com' ],
//   '5553330033': [ 'Валерий', undefined ] }
function convertPhoneNumber(number) {
    const convertedNumber = `+7 (${number.slice(0, 3)})` +
    ` ${number.slice(3, 6)}` +
    `-${number.slice(6, 8)}` +
    `-${number.slice(8, 10)}`;

    return convertedNumber;
}

function convertArrForSearch(obj) {
    let arr = Object.entries(obj);

    return arr.map(function (item) {
        let phone = item[0];
        let name = item[1][0];
        let email = item[1][1];

        return [name, phone, email].join(', ');
    });
}

function showArr(arr) {
    return arr.map(function (item) {
        let [name, phone, email] = item.split(', ');
        phone = convertPhoneNumber(phone);

        return [name, phone, email].join(', ').replace(/,\s*$/, '');
    });
}
function filtArr(arr, searchParam) {
    return arr.filter(function (item) {
        return item.indexOf(searchParam) !== -1;
    });

}
function compare(a, b) {
    if (a > b) {
        return 1;
    }
    if (a < b) {
        return -1;
    }

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
    let countOfDeletedItems = 0;
    let arr = convertArrForSearch(phoneBook);
    arr.forEach(function (item) {
        if (item.indexOf(query) !== -1) {
            countOfDeletedItems ++;
            let data = item.split(', ');
            let phone = data[1];
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

        return showArr(convertArrForSearch(phoneBook)).sort(compare);
    }

    return showArr(filtArr(convertArrForSearch(phoneBook), query)).sort(compare);
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
