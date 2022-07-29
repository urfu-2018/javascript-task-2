/* eslint-disable no-console */
'use strict';

let phoneBook = [];

function add(phone, name, email) {
    const validPhone = (typeof (phone) === 'string') && /^\d{10}$/.test(phone);
    const validName = (typeof (name) === 'string') && /^[a-zA-Za-яА-Я0-9]/.test(name);
    const findContact = phoneBook.find(function (contact) {
        return contact.phone === phone;
    });

    if (!validPhone || !validName || findContact !== undefined) {
        return false;
    }

    let newContact = {};
    newContact.phone = phone;
    newContact.name = name;
    newContact.email = email;
    phoneBook.push(newContact);

    return true;
}
console.log('Позитивные:');
console.log(add('9991256123', 'Marmaks1', 's@gmail.com'));
console.log(add('9519541363', 'Marmaks2', 's@yandex.ru'));
console.log(add('5554440044', 'Гоша', 'grisha@example.com'));
console.log(add('5552220022', 'Борис', 'boris@example.com'));
console.log(add('5551110011', 'Алекс'));
console.log(add('5553330033', 'Валерий', 'valera@example.com'));

console.log('');
console.log('Негативные:');
console.log(add('9519541363', ' ', 'superelmarin@yandex.ru') + ' - Только пробел');
console.log(add('9519541363', '', 'superelmarin@yandex.ru') + ' - Пустое Имя');
console.log(add('951954', 'Marmaks3', 'superelmarin@yandex.ru') + ' - Короткий номер');
console.log(add('9519541363', 'Marmaks4', 'superelmarin@yandex.ru') + ' - Дубликат по номеру');
console.log(add('3330033', 'Неизвестный', 'unknown@example.com') + ' - Короткий номер');
console.log(add('abc5556660055', 'Николай', 'kolya@example.com') + ' - Буквы в номере');
console.log(add('5556660066abc', 'Герман', 'gera@example.com') + ' - Буквы в номере');
console.log(add('5551110011', 'Алексей') + ' - Дубликат по номеру');
console.log(add('5555550055') + ' - Нет имени');

console.log('');
console.log('Телефонная книга:');
console.log(phoneBook);

