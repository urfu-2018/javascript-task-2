'use strict';

/**
 * Сделано задание на звездочку
 * Реализован метод importFromCsv
 */
const isStar = true;

/**
 * Телефонная книга
 */
let phoneBook;

/**
 * Добавление записи в телефонную книгу
 * @param {String} phone
 * @param {String?} name
 * @param {String?} email
 * @returns {Boolean}
 */
function add(phone, name, email) {
    const phonePattern = '^[0-9]{10}$';
    if (!phoneBook) {
        phoneBook = {};
    }
    if (phoneBook[phone] !== undefined) {
        return false;
    }
    if (phone.match(phonePattern) !== null && name !== undefined) {
        phoneBook[phone] = {
            name: name,
            email: email
        };

        return true;
    }

    return false;
}

/**
 * Обновление записи в телефонной книге
 * @param {String} phone
 * @param {String?} name
 * @param {String?} email
 * @returns {Boolean}
 */
function update(phone, name, email) {
    if (phoneBook[phone] !== undefined) {
        if (name === undefined) {
            return false;
        }
        phoneBook[phone].name = name;
        phoneBook[phone].email = email;

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
    const [indexes, phonesIndexes] = getIndexes(query);
    var phoneBookCopy = Object.assign({}, phoneBook);
    for (var i = 0; i < indexes.length; i++) {
        delete phoneBookCopy[phonesIndexes[indexes[i]]];
    }

    return indexes.length;
}

/**
 * Поиск записей по запросу в телефонной книге
 * @param {String} query
 * @returns {String[]}
 */
function find(query) {
    if (query === '*') {
        return formatSelection(sortSelection(phoneBook));
    } else if (query === undefined) {
        return undefined;
    }
    const [foundIndexes, phoneSelection] = getIndexes(query);
    const resultSelection = extractMemos(foundIndexes, phoneSelection);

    const sortedSelection = sortSelection(resultSelection);

    return formatSelection(sortedSelection);
}

function getIndexes(query) {
    const phoneSelection = createSelection('phone');
    const nameSelection = createSelection('name');
    const emailSelection = createSelection('email');

    const resultIndexes = findIndex(phoneSelection, query).concat(findIndex(nameSelection, query),
        findIndex(emailSelection, query));

    function onlyUnique(value, index, self) {
        return self.indexOf(value) === index;
    }

    return [resultIndexes.filter(onlyUnique), phoneSelection];
}

function sortSelection(selection) {
    var result = [];
    const keys = Object.keys(selection);
    for (var i = 0; i < keys.length; i++) {
        result.push({
            name: selection[keys[i]].name, phone: keys[i],
            email: selection[keys[i]].email
        });
    }
    result.sort(function (a, b) {
        return a.name > b.name;
    });

    return result;
}

function formatSelection(selection) {
    var result = [];
    for (var i = 0; i < selection.length; i++) {
        const memo = selection[i];
        var formattedMemo = memo.name + ', ' + formatPhone(memo.phone);
        formattedMemo = (memo.email !== undefined) ? formattedMemo + ', ' + memo.email
            : formattedMemo;
        result.push(formattedMemo);
    }

    return result;
}

function formatPhone(phone) {
    return '+7 (' + phone.slice(0, 3) + ') ' + phone.slice(3, 6) + '-' +
        phone.slice(6, 8) + '-' + phone.slice(8, 10);
}


function extractMemos(indexes, phoneIndexes) {
    var result = {};
    for (var i = 0; i < indexes.length; i++) {
        const phoneKey = phoneIndexes[indexes[i]];
        result[phoneKey] = phoneBook[phoneKey];
    }

    return result;
}


function findIndex(selection, query) {
    var result = [];
    for (var i = 0; i < selection.length; i++) {
        if (selection[i] !== undefined && selection[i].indexOf(query) !== -1) {
            result.push(i);
        }
    }

    return result;

}

function createSelection(query) {
    var selection = [];
    switch (query) {
        case 'phone':
            selection = Object.keys(phoneBook);
            break;
        case 'name':
            selection = extractData('name');
            break;
        case 'email':
            selection = extractData('email');
            break;
        default:
            break;
    }

    return selection;
}

function extractData(field) {
    var selection = [];
    const keys = Object.keys(phoneBook);
    for (var i = 0; i < keys.length; i++) {
        selection.push(phoneBook[keys[i]][field]);
    }

    return selection;
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

    const memos = csv.split('\n');
    var counter = 0;
    for (var i = 0; i < memos.length; i++) {
        counter = (proceedMemo(memos[i])) ? counter + 1 : counter;
    }

    return counter;
}

function proceedMemo(memoString) {
    const memoParts = memoString.split(';'); // warning here if ; is bad
    const firstAttemptResult = add(memoParts[1], memoParts[0], memoParts[3]);
    if (!firstAttemptResult) {
        return update(memoParts[1], memoParts[0], memoParts[3]);
    }

    return true;
}

module.exports = {
    add,
    update,
    findAndRemove,
    find,
    importFromCsv,
    isStar
};
