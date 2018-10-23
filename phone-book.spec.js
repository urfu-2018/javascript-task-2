/* eslint-env mocha */
'use strict';

const assert = require('assert');

const phoneBook = require('./phone-book');

describe('phone-book', () => {
    it('должен добавлять записи', () => {
        assert.ok(phoneBook.add('5554440044', 'Григорий', 'grisha@example.com'));
        assert.ok(phoneBook.add('5552220022', 'Борис', 'boris@example.com'));
        assert.ok(phoneBook.add('5551110011', 'Алекс'));
        assert.ok(phoneBook.add('5553330033', 'Валерий', 'valera@example.com'));
    });

    it('не должен добавлять неправильные записи', () => {
        assert.ok(!phoneBook.add('3330033', 'Неизвестный', 'unknown@example.com'));
        assert.ok(!phoneBook.add('abc5556660055', 'Николай', 'kolya@example.com'));
        assert.ok(!phoneBook.add('5556660066abc', 'Герман', 'gera@example.com'));
        assert.ok(!phoneBook.add('5551110011', 'Алексей'));
        assert.ok(!phoneBook.add('5555550055'));
    });

    it('должен обновлять существующие записи', () => {
        assert.ok(phoneBook.update('5551110011', 'Алексей', 'alex@example.com'));
        assert.ok(phoneBook.update('5553330033', 'Валерий'));
    });

    it('НЕ должен обновлять существующие записи', () => {
        assert.ok(!phoneBook.update('5551110022', 'Алексей', 'ahihx@example.com'));
        assert.ok(!phoneBook.update('5553330033'));
    });

    it('должен искать все записи по запросу "*"', () => {
        assert.deepStrictEqual(phoneBook.find('*'), [
            'Алексей, +7 (555) 111-00-11, alex@example.com',
            'Борис, +7 (555) 222-00-22, boris@example.com',
            'Валерий, +7 (555) 333-00-33',
            'Григорий, +7 (555) 444-00-44, grisha@example.com'
        ]);
    });

    /*     it('должен искать все записи по запросу "-"', () => {
        assert.deepStrictEqual(phoneBook.find('5'), [
            'Алексей, +7 (555) 111-00-11, alex@example.com',
            'Борис, +7 (555) 222-00-22, boris@example.com',
            'Валерий, +7 (555) 333-00-33',
            'Григорий, +7 (555) 444-00-44, grisha@example.com'
        ]);
    });

    it('должен искать ничего по запросу ""', () => {
        assert.deepStrictEqual(phoneBook.find(''), []);
    });

    it('должен искать ничего по запросу "кек"', () => {
        assert.deepStrictEqual(phoneBook.find('кек'), []);
    });

    it('должен искать все записи по запросу "@"', () => {
        assert.deepStrictEqual(phoneBook.find('@'), [
            'Алексей, +7 (555) 111-00-11, alex@example.com',
            'Борис, +7 (555) 222-00-22, boris@example.com',
            'Григорий, +7 (555) 444-00-44, grisha@example.com'
        ]);
    });

    it('должен искать все записи по запросу "ий"', () => {
        assert.deepStrictEqual(phoneBook.find('ий'), [
            'Валерий, +7 (555) 333-00-33',
            'Григорий, +7 (555) 444-00-44, grisha@example.com'
        ]);
    });

    it('должен искать все записи по запросу "555"', () => {
        assert.deepStrictEqual(phoneBook.find('555'), [
            'Алексей, +7 (555) 111-00-11, alex@example.com',
            'Борис, +7 (555) 222-00-22, boris@example.com',
            'Валерий, +7 (555) 333-00-33',
            'Григорий, +7 (555) 444-00-44, grisha@example.com'
        ]);
    });
 */
    it('должен удалять элементы из телефонной книги', () => {
        assert.strictEqual(phoneBook.findAndRemove('@'), 3);
    });

    it('должен искать все записи по запросу "*"', () => {
        assert.deepStrictEqual(phoneBook.find('*'), [
            'Валерий, +7 (555) 333-00-33'
        ]);
    });

    /* if (phoneBook.isStar) {
        it('должен экспортировать из cvs', () => {
            const csv = [
                'Борис;5552220022;boris@example.com',
                'Григорий;5554440044;grisha@example.com',
                'Алексей;5551110011;alex@example.com',
                'Валерий;5553330033;valera@example.com',
                'Неизвестный;3330033;unknown@example.com'
            ].join('\n');

            assert.strictEqual(phoneBook.importFromCsv(csv), 4);
        });
    } */
});
