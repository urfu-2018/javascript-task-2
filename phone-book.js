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

function areTypesCorrect(phone, name, email) {
    const phonePattern = new RegExp('^\\d{10}$');
    const isPhoneValid = typeof phone === 'string' && phonePattern.test(phone);
    const isNameValid = typeof name === 'string' && name !== '';
    const isEmailValid = (email !== undefined) ? typeof email === 'string' : true;

    return isPhoneValid && isNameValid && isEmailValid;
}

/**
 * Добавление записи в телефонную книгу
 * @param {String} phone
 * @param {String?} name
 * @param {String?} email
 * @returns {Boolean}
 */
function add(phone, name, email) {
    if (!phoneBook) {
        phoneBook = {};
    }
    if (phoneBook[phone] !== undefined) {
        return false;
    }
    if (areTypesCorrect(phone, name, email)) {
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
    if (phoneBook[phone] !== undefined && areTypesCorrect(phone, name, email)) {
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
    if (typeof query !== 'string' || query === '') {
        return 0;
    }
    const [indexes, phonesIndexes] = getIndexes(query);
    var phoneBookCopy = Object.assign({}, phoneBook);
    for (var i = 0; i < indexes.length; i++) {
        delete phoneBookCopy[phonesIndexes[indexes[i]]];
    }
    phoneBook = phoneBookCopy;

    return indexes.length;
}

/**
 * Поиск записей по запросу в телефонной книге
 * @param {String} query
 * @returns {String[]}
 */
function find(query) {
    if (query === undefined || typeof query !== 'string' || query === '') {
        return [];
    }
    const [foundIndexes, phoneSelection] = getIndexes(query);
    const resultSelection = extractMemos(foundIndexes, phoneSelection);

    const sortedSelection = sortSelection(resultSelection);

    return formatSelection(sortedSelection);
}

function getIndexes(query) {
    // const phoneSelection = createSelection('phone');
    var indexes = [];
    const phoneSelection = Object.keys(phoneBook);

    if (query === '*') {
        return [selectAllIndexes(), phoneSelection];
    }

    for (var i in phoneBook) {
        if (checkAllFields(query, i)) {
            indexes.push(phoneSelection.indexOf(i));
        }
    }

    return [indexes, phoneSelection];
}

function checkAllFields(query, i) {
    const isContainingInPhone = i.indexOf(query) !== -1;
    const isContainingInName = phoneBook[i].name.indexOf(query) !== -1;
    const isContainigInEmail = (phoneBook[i].email !== undefined)
        ? phoneBook[i].email.indexOf(query) !== -1 : false;


    return isContainigInEmail || isContainingInName || isContainingInPhone;
}

function selectAllIndexes() {
    var result = [];
    for (var i = 0; i < Object.keys(phoneBook).length; i++) {
        result.push(i);
    }

    return result;
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
    const firstAttemptResult = add(memoParts[1], memoParts[0], memoParts[2]);
    if (!firstAttemptResult) {
        return update(memoParts[1], memoParts[0], memoParts[2]);
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
