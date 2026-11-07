const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');

const source = fs.readFileSync(path.join(__dirname, '..', 'app_badge.js'), 'utf8');

function loadPlugin(title, supported = true) {
    const calls = [];
    const listeners = {};
    const document = { title, head: {} };
    let observer;
    const rcmail = {
        addEventListener(name, callback) {
            listeners[name] = callback;
        }
    };
    const navigator = supported ? {
        setAppBadge(count) {
            calls.push(['set', count]);
            return Promise.resolve();
        },
        clearAppBadge() {
            calls.push(['clear']);
            return Promise.resolve();
        }
    } : {};

    vm.runInNewContext(source, {
        window: { rcmail },
        rcmail,
        document,
        navigator,
        MutationObserver: class {
            constructor(callback) {
                this.callback = callback;
                observer = this;
            }

            observe(target, options) {
                assert.equal(target, document.head);
                assert.equal(options.childList, true);
                assert.equal(options.characterData, true);
                assert.equal(options.subtree, true);
            }
        }
    });

    listeners.init();

    return {
        calls,
        changeTitle(title) {
            document.title = title;
            observer.callback();
        }
    };
}

test('sets the initial badge from the title without server-provided counts', () => {
    assert.deepEqual(loadPlugin('(12) Roundcube Webmail').calls, [['set', 12]]);
});

test('tracks read/unread changes, new mail, and removal of the title count', () => {
    const plugin = loadPlugin('(3) Inbox');
    plugin.changeTitle('(2) Inbox');
    plugin.changeTitle('(4) Inbox');
    plugin.changeTitle('Inbox');
    plugin.changeTitle('(1) Inbox');
    plugin.changeTitle('(0) Inbox');
    assert.deepEqual(plugin.calls, [
        ['set', 3], ['set', 2], ['set', 4], ['clear'], ['set', 1], ['clear']
    ]);
});

test('only treats a leading numeric count followed by whitespace as unread', () => {
    for (const title of ['Inbox (3)', '(draft) Inbox', '(3)Inbox', 'Inbox', '']) {
        assert.deepEqual(loadPlugin(title).calls, [['clear']]);
    }
});

test('does not call the Badging API when unsupported', () => {
    const plugin = loadPlugin('(3) Inbox', false);
    plugin.changeTitle('(4) Inbox');
    assert.deepEqual(plugin.calls, []);
});

test('does nothing outside Roundcube', () => {
    vm.runInNewContext(source, { window: {} });
});
