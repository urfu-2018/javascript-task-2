'use strict';

const phoneBook = require('./phone-book');

// Эти записи добавятся, вернется `true`
phoneBook.add('5554440044', 'Григорий', 'grisha@example.com');
phoneBook.add('5552220022', 'Борис', 'boris@example.com');
phoneBook.add('5551110011', 'Алекс');
phoneBook.add('5553330033', 'Валерий', 'valera@example.com');

// Эти записи не добавятся, вернется `false`
phoneBook.add('3330033', 'Неизвестный', 'unknown@example.com');
console.info(phoneBook.add('3330033894561', 'Неизвестный', 'unknown@example.com'));
phoneBook.add('5551110011', 'Алексей');
console.info(phoneBook.add('5552220022', 'Борис', 'boris@example.com'));
phoneBook.add('5555550055');
console.info(phoneBook.add('5555з500рщ', 'Неизвестный', 'unknown@example.com'));
console.info(phoneBook.add('5555з500рщ', 'Неизвестный'));
console.info(phoneBook.add('5555з500рщ'));

// Обновление ранее добавленных записей
phoneBook.update('5551110011', 'Алексей', 'alex@example.com');
phoneBook.update('5553330033', 'Валерий');
console.info(phoneBook.update('5553330033'));
console.info(phoneBook.update('555111pj01', 'Алексей', 'alex@example.com'));
console.info(phoneBook.update('5551113801', 'Алексей', 'alex@example.com'));
console.info(phoneBook.update('5551110011', 'Алексей', 'alex@example.com'));

// В следующих примерах вернутся все записи
console.info(phoneBook.find('*'));
console.info(phoneBook.find('555'));
console.info(phoneBook.find('(555)'));
console.info(phoneBook.find('.1545d'));
console.info(phoneBook.find('hj'));
// В обоих случаях вывод будет следующий
// [
//   'Алексей, +7 (555) 111-00-11, alex@example.com',
//   'Борис, +7 (555) 222-00-22, boris@example.com',
//   'Валерий, +7 (555) 333-00-33',
//   'Григорий, +7 (555) 444-00-44, grisha@example.com'
// ]

// Удаление записей, содержащих '@', вернется `3`
console.info(phoneBook.findAndRemove('@'));
console.info(phoneBook.find('*'));
console.info(phoneBook.find('5'));
// phoneBook.add('5554440044', 'Григорий', 'grisha@example.com');
// phoneBook.add('5552220022', 'Борис', 'boris@example.com');
// phoneBook.add('5551110011', 'Алекс');
// phoneBook.add('5553330033', 'Валерий', 'valera@example.com');
console.info(phoneBook.findAndRemove(''));

if (phoneBook.isStar) {
    let csv = [
        'Борис;5552220022;boris@example.com',
        'Григорий;5554440044;grisha@example.com',
        'Алексей;5551110011;alex@example.com',
        'Валерий;5553430033;valera@example.com',
        'Неизвестный;3330033;unknown@example.com'
    ].join('\n');

    // Импорт записей из csv, вернется `4`
    // phoneBook.importFromCsv(csv);

    csv = [
        'Неизвестный;3330033593;unknown@example.com'
    ].join('\n');

    // phoneBook.importFromCsv(csv);
}
