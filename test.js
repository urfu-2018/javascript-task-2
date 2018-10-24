'use strict';

const phoneBook = require('./phone-book');

// Эти записи добавятся, вернется `true`
console.info(phoneBook.add('5554440044', 'Григорий', 'grisha@example.com'));
console.info(phoneBook.add('5552220022', 'Борис', 'boris@example.com'));
console.info(phoneBook.add('5551110011', 'Алекс'));
console.info(phoneBook.add('5553330033', 'Валерий', 'valera@example.com'));

// Эти записи не добавятся, вернется `false`
console.info(phoneBook.add('3330033', 'Неизвестный', 'unknown@example.com'));
console.info(phoneBook.add('5551110011', 'Алексей'));
console.info(phoneBook.add('5555550055'));

// Обновление ранее добавленных записей
console.info(phoneBook.update('5551110011', 'Алексей', 'alex@example.com'));
console.info(phoneBook.update('5553330033', 'Валерий'));

// В следующих примерах вернутся все записи
console.info(phoneBook.find('*'));
console.info(phoneBook.find(555));
// В обоих случаях вывод будет следующий
// [
//   'Алексей, +7 (555) 111-00-11, alex@example.com',
//   'Борис, +7 (555) 222-00-22, boris@example.com',
//   'Валерий, +7 (555) 333-00-33',
//   'Григорий, +7 (555) 444-00-44, grisha@example.com'
// ]

// Удаление записей, содержащих '@', вернется `3`
console.info(phoneBook.findAndRemove('@'));

if (phoneBook.isStar) {
    const csv = [
        'Борис;5552220022;boris@example.com',
        'Григорий;5554440044;grisha@example.com',
        'Алексей;5551110011;alex@example.com',
        'Валерий;5553330033',
        'Неизвестный;3330033;unknown@example.com'
    ].join('\n');

    // Импорт записей из csv, вернется `4`
    console.info(phoneBook.importFromCsv(csv));
}
