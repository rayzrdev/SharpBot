const {stripIndents} = require('common-tags');

class TodoItem {
    constructor(description, completed = false) {
        this.description = description;
        this.completed = completed;
    }

    complete(completed = true) {
        this.completed = completed;
    }

    toString() {
        return `${this.completed ? ':ballot_box_with_check:' : ':black_square_button: '} ${this.description}`;
    }

    static fromJSON({description, completed}) {
        return new TodoItem(description, completed);
    }
}

class TodoList {
    constructor(name) {
        this.name = name;
        this.items = [];
    }

    _validateIndex(index) {
        if (Number.isNaN(index)) {
            // This will throw the error below
            index = 0;
        }
        index -= 1;
        if (index < 0 || index > this.items.length) {
            throw 'Please specify a valid number!';
        }

        return index;
    }

    add(description, completed = false) {
        this.items.push(new TodoItem(description, completed));
    }

    remove(index) {
        index = this._validateIndex(index);
        this.items.splice(index, 1);
    }

    markComplete(index, completed = true) {
        index = this._validateIndex(index);
        this.items[index].complete(completed);
    }

    toString() {
        return stripIndents`
        **List: ${this.name}**
        **Items:** ${this.items.length === 0 ? 'None' : ''}
        ${this.items.map((item, i) => `${i + 1}. ${item.toString()}`).join('\n')}
        `;
    }

    static fromJSON({name, items}) {
        const todoList = new TodoList(name);
        todoList.items = items.map(item => TodoItem.fromJSON(item));
        return todoList;
    }
}

class TodoLists {
    constructor(bot) {
        this._bot = bot;
        this.storage = bot.storage('todos');
        this.lists = {};

        const lists = this.storage.get(TodoLists.listsStorageKey);
        if (!lists) {
            this.lists = {
                [TodoLists.mainListName]: new TodoList(TodoLists.mainListName)
            };
        } else {
            Object.keys(lists)
                .forEach(listName => {
                    this.lists[listName] = TodoList.fromJSON(lists[listName]);
                });
        }

        let currentList = this.storage.get(TodoLists.currentListStorageKey);
        if (!this.getList(currentList)) {
            currentList = TodoLists.mainListName;
        }
        this.currentListName = currentList;
    }

    /**
     *
     * @returns {TodoList}
     */
    getCurrentList() {
        return this.getList(this.currentListName);
    }

    save() {
        this.storage.set(TodoLists.currentListStorageKey, this.currentListName);
        this.storage.set(TodoLists.listsStorageKey, this.lists);
        this.storage.save();
    }

    getList(name) {
        return this.lists[name];
    }

    getListNames() {
        return Object.keys(this.lists);
    }

    deleteList(name) {
        if (!this.getList(name)) {
            throw `List '${name}' does not exist!`;
        }
        if (name === TodoLists.mainListName) {
            throw `List '${name}' cannot be deleted!`;
        }
        delete this.lists[name];

        if (this.currentListName === name) {
            this.switchList(TodoLists.mainListName);
        }
    }

    createList(name) {
        if (this.getList(name)) {
            throw `List'${name}' already exists!`;
        }
        this.lists[name] = new TodoList(name);
        this.switchList(name);
    }

    switchList(name) {
        if (!this.getList(name)) {
            throw `List '${name}' does not exist!`;
        }
        this.currentListName = name;
    }
}

TodoLists.listsStorageKey = 'lists';
TodoLists.currentListStorageKey = 'currentListName';
TodoLists.mainListName = 'Main';

module.exports.run = (bot, msg, args) => {
    const send = (message, deleteInSeconds = 5, prefix = ':white_check_mark: ') => msg.edit({
        embed: bot.utils.embed(`Todo List Utility (message will self-destruct in ${deleteInSeconds} seconds)`, `${prefix}${message}`)
    })
        .then(m => m.delete(deleteInSeconds * 1000));


    if (args.length < 1) {
        return send(Lists.getCurrentList(), 45, '');
    }

    const {options, leftover} = bot.utils.parseArgs(args, ['d', 'c', 'i', 'l', 'n', 'r', 's']);
    let indexOption = parseInt(leftover[0], 10);

    const ensureProperNumberOfArgs = (max, message = 'Expected list item number only', min = 1) => {
        if (leftover.length > max || leftover.length < min) {
            throw message;
        }
    };

    if (options.c) {
        ensureProperNumberOfArgs(1);
        Lists.getCurrentList().markComplete(indexOption);
        send(`Item ${indexOption} marked complete!`);
    } else if (options.i) {
        ensureProperNumberOfArgs(1);
        Lists.getCurrentList().markComplete(indexOption, false);
        send(`Item ${indexOption} marked incomplete!`);
    } else if (options.d) {
        ensureProperNumberOfArgs(1);
        Lists.getCurrentList().remove(indexOption);
        send(`Item ${indexOption} deleted!`);
    } else if (options.l) {
        send(`Available lists: ${Lists.getListNames().join(', ')}`, 30);
    } else if (options.n) {
        ensureProperNumberOfArgs(1, 'Expected name of new list to be a single word');
        Lists.createList(leftover[0]);
        send(`List '${leftover[0]}' created!`);
    } else if (options.r) {
        ensureProperNumberOfArgs(1, 'Expected name of list to delete to be a single word');
        Lists.deleteList(leftover[0]);
        send(`List '${leftover[0]}' deleted!`);
    } else if (options.s) {
        ensureProperNumberOfArgs(1, 'Expected name of chosen list to be a single word');
        Lists.switchList(leftover[0]);
        send(`Switched to list '${leftover[0]}'`);
    } else {
        Lists.getCurrentList().add(leftover.join(' '));
        send(`Item '${leftover.join(' ')}' added!`);
    }

    Lists.save();
};

/**
 * @type {TodoLists}
 */
let Lists;
module.exports.init = bot => {
    Lists = new TodoLists(bot);
};

module.exports.info = {
    name: 'todo',
    usage: 'todo | todo [options...] <index> | todo <text of item to add>',
    description: 'Manage a todo list. The command by itself will show the items in the current list.',
    options: [
        {
            name: '-c',
            usage: '-c ',
            description: 'Mark an item complete'
        },
        {
            name: '-i',
            usage: '-i ',
            description: 'Mark an item incomplete'
        },
        {
            name: '-d',
            usage: '-d',
            description: 'Delete an item'
        },
        {
            name: '-l',
            usage: '-l',
            description: 'Show all lists'
        },
        {
            name: '-n',
            usage: '-n ',
            description: 'Make a new list and set it as the current list'
        },
        {
            name: '-r',
            usage: '-r ',
            description: 'Remove a list. If the list being removed is the list currently in use, automatically switches back to the Main list.'
        },
        {
            name: '-s',
            usage: '-s ',
            description: 'Switch lists'
        }
    ]
};
