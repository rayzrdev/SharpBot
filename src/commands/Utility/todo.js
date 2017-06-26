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
        this.currentList = currentList;
    }

    /**
     *
     * @returns {TodoList}
     */
    getCurrentList() {
        return this.getList(this.currentList);
    }

    save() {
        this.storage.set(TodoLists.currentListStorageKey, this.currentList);
        this.storage.set(TodoLists.listsStorageKey, this.lists);
        this.storage.save();
    }

    getList(name) {
        return this.lists[name];
    }

    deleteList(name) {
        if (!this.getList(name)) {
            throw `List ${name} does not exist!`;
        }
        if (name === TodoLists.mainListName) {
            throw `List ${name} cannot be deleted!`;
        }
        delete this.lists[name];
    }

    createList(name) {
        if (this.getList(name)) {
            throw `List ${name} already exists!`;
        }
        this.lists[name] = new TodoList(name);
    }
}

TodoLists.listsStorageKey = 'lists';
TodoLists.currentListStorageKey = 'currentList';
TodoLists.mainListName = 'Main';

module.exports.run = (bot, msg, args) => {
    const send = (message, prefix = ':white_check_mark: ') => msg.channel.send({
        embed: bot.utils.embed('Todo List Utility', `${prefix}${message}`)
    });


    if (args.length < 1) {
        return send(Lists.getCurrentList(), '');
    }

    const {options, leftover} = bot.utils.parseArgs(args, ['d', 'c', 'i']);
    let indexOption = parseInt(leftover[0], 10);

    if (options.c) {
        Lists.getCurrentList().markComplete(indexOption);
        send(`Item ${indexOption} marked complete!`);
    } else if (options.i) {
        Lists.getCurrentList().markComplete(indexOption, false);
        send(`Item ${indexOption} marked incomplete!`);
    } else if (options.d) {
        Lists.getCurrentList().remove(indexOption);
        send(`Item ${indexOption} deleted!`);
    } else {
        Lists.getCurrentList().add(leftover.join(' '));
        send('Item added!');
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
    usage: 'todo', // TODO
    description: 'Manage a todo list',
    options: []
};
