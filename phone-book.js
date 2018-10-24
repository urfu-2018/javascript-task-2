'use strict';

/**
 * Сделано задание на звездочку
 * Реализован метод importFromCsv
 */
const isStar = true;

/**
 * Телефонная книга
 */
let phoneBook = {
    contact: new Map(),
    sizePhoneBook: 0,
    isContainsContact: function (name) {
        if (this.sizePhoneBook === 0) {
            return false;
        }

        return this.contact[name] !== undefined;
    },

    /**
 * Приводит по конкретному индексу контакта в строку
 * @param {String?} name
 * @returns {String}
 */
    toString: function (name) {

        return name + ', ' + this.contact[name][0] + ', ' + this.contact[name][1];
    }

};

/**
 * Добавление записи в телефонную книгу
 * @param {String} phone
 * @param {String?} name
 * @param {String?} email
 * @returns {Boolean}
 */
function add(phone, name, email) {
    if (!isCorrect(phone, name)) {
        return false;
    }
    if (!phoneBook.isContainsContact(name) && find(phone).length === 0) {
        var temp = [];
        temp[0] = phone;
        temp[1] = email;
        phoneBook.sizePhoneBook++;
        phoneBook.contact[name] = temp;

        return true;
    }

    return false;
}

function isCorrect(phone, name) {
    if (phone.length !== 10 || name === undefined || name === '') {
        return false;
    }
    if (typeof(name) !== 'string' || !/^\d{10}$/.test(phone)) {
        return false;
    }

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
    if (!isCorrect(phone, name)) {
        return false;
    }
    if (phoneBook.isContainsContact(name)) {
        var temp = [];
        temp[0] = phone;
        temp[1] = email;
        phoneBook.contact[name] = temp;

        return true;
    }

    return updatePhoneOrEmail(phone, name, email);
}

function updatePhoneOrEmail(phone, name, email) {
    var updatePhone = isContainsPhoneOrEmail(phone);
    var updateEmail = isContainsPhoneOrEmail(email);
    var updatePhOrEm = updatePhone !== -1 ? updatePhone : 0;
    if (updatePhOrEm === 0) {
        updatePhOrEm = updateEmail !== -1 ? updateEmail : -1;
    }
    if (updatePhOrEm !== -1) {
        delete phoneBook.contact[updatePhOrEm];
        var temp = [];
        temp[0] = phone;
        temp[1] = email;
        phoneBook.contact[name] = temp;

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
    if (phoneBook.sizePhoneBook === 0) {

        return 0;
    }
    if (query === '*') {
        query = '';
    }
    var count = 0;
    var delContact = find(query);
    for (var item of delContact) {
        var del = delete phoneBook.contact[item.split(', ')[0]];
        if (del) {
            phoneBook.sizePhoneBook--;
            count++;
        }
    }

    return count;
}

/**
 * Поиск записей по запросу в телефонной книге
 * @param {String} query
 * @returns {String[]}
 */
function find(query) {
    if (phoneBook.sizePhoneBook === 0) {

        return [];
    }

    if (query === '*') {
        query = '';
    }
    var result = [];
    for (var con in phoneBook.contact) {
        if (phoneBook.contact.hasOwnProperty(con)) {
            result = makeArray(con, result, query);
        }
    }

    return result.sort(function (a, b) {
        var a1 = a.slice(0, a.indexOf(', '));
        var b1 = b.slice(0, b.indexOf(', '));

        return a1.localeCompare(b1);
    });
}

function makeArray(con, result, query) {
    var tmpStr = phoneBook.toString(con);
    if (tmpStr.includes(query)) {
        var str = tmpStr.split(', ');
        var checkEmail = str[2] === 'undefined' ? '' : ', ' + str[2];
        var tel = str[0] + ', +7 (' + str[1].slice(0, 3) + ') ' + str[1].slice(3, 6) + '-' +
        str[1].slice(6, 8) + '-' + str[1].slice(8, 10) + checkEmail;
        result[result.length] = tel;
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
    var tempContact = csv.split('\n');
    var count = 0;
    for (var i = 0; i < tempContact.length; i++) {
        var tmp = tempContact[i].split(';');
        var name = tmp[0];
        var phone = tmp[1];
        var email = tmp[2];
        if (add(phone, name, email) || update(phone, name, email)) {
            count++;
        }
    }

    return count;
}

function isContainsPhoneOrEmail(query) {
    var result = -1;
    for (var cont in phoneBook.contact) {
        if (phoneBook.contact.hasOwnProperty(cont)) {
            result = checkQuery(cont, query, result);
        }
    }

    return result;
}

function checkQuery(cont, query, result) {
    var tmp = phoneBook.contact[cont].indexOf(query);
    if (tmp !== -1) {
        result = cont;
    }

    return result;
}

module.exports = {
    add,
    update,
    findAndRemove,
    find,
    importFromCsv,

    isStar
};
