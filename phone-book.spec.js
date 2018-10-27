/* eslint-env mocha */
'use strict';

const assert = require('assert');

const phoneBook = require('./phone-book');

describe('phone-book', () => {
    it('должен добавлять записи', () => {
        assert.ok(phoneBook.add('5554440044', 'Григорий', 'grisha@example.com'));
        assert.ok(phoneBook.add('5552220022', 'Дмитрий', 'dmitry@example.com'));
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

    it('не должен обновлять несуществующие и некорректные записи', () => {
        assert.ok(!phoneBook.update('8005553535', 'Николай', 'abc@example.com'));
        assert.ok(!phoneBook.update('assa8005553535', 'Николай', 'abc@example.com'));
        assert.ok(!phoneBook.update('8005553535saas', 'Николай', 'abc@example.com'));
        assert.ok(!phoneBook.update('assa8005553535saas', 'Николай', 'abc@example.com'));
        assert.ok(!phoneBook.update('8005553535', '', 'abc@example.com'));
        assert.ok(!phoneBook.update('8005553535'));
    });

    it('должен искать все записи по запросу "*"', () => {
        assert.deepStrictEqual(phoneBook.find('*'), [
            'Алексей, +7 (555) 111-00-11, alex@example.com',
            'Валерий, +7 (555) 333-00-33',
            'Григорий, +7 (555) 444-00-44, grisha@example.com',
            'Дмитрий, +7 (555) 222-00-22, dmitry@example.com'
        ]);
    });

    it('должен искать все записи по запросу "555"', () => {
        assert.deepStrictEqual(phoneBook.find('555'), [
            'Алексей, +7 (555) 111-00-11, alex@example.com',
            'Валерий, +7 (555) 333-00-33',
            'Григорий, +7 (555) 444-00-44, grisha@example.com',
            'Дмитрий, +7 (555) 222-00-22, dmitry@example.com'
        ]);
    });

    it('должен искать записи по запросу "example"', () => {
        assert.deepStrictEqual(phoneBook.find('example'), [
            'Алексей, +7 (555) 111-00-11, alex@example.com',
            'Григорий, +7 (555) 444-00-44, grisha@example.com',
            'Дмитрий, +7 (555) 222-00-22, dmitry@example.com'
        ]);
    });

    it('должен искать записи по запросу "Валерий"', () => {
        assert.deepStrictEqual(phoneBook.find('Валерий'), [
            'Валерий, +7 (555) 333-00-33'
        ]);
    });

    it('не должен найти записи по запросу "ex.mple"', () => {
        assert.deepStrictEqual(phoneBook.find('ex.mple'), []);
    });

    it('не должен найти записи по запросу "9"', () => {
        assert.deepStrictEqual(phoneBook.find('9'), []);
    });

    it('должен удалять элементы из телефонной книги', () => {
        assert.strictEqual(phoneBook.findAndRemove('@'), 3);
        assert.deepStrictEqual(phoneBook.find('*'), [
            'Валерий, +7 (555) 333-00-33'
        ]);
    });

    it('должен удалять все элементы из телефонной книги с помощью "*"', () => {
        assert.strictEqual(phoneBook.findAndRemove('*'), 1);
        assert.deepStrictEqual(phoneBook.find('*'), []);
    });

    if (phoneBook.isStar) {
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

        it('не должен экспортировать из cvs некорректные и уже присутствующие данные', () => {
            const csv = [
                'Алексей;alex@example.com',
                'Валерий;555333003;valera@example.com',
                '5533330033;unknown@example.com'
            ].join('\n');

            assert.strictEqual(phoneBook.importFromCsv(csv), 0);
        });
    }
});
