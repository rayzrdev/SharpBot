```javascript
const bot = {};

// Get yourself a StorageAdapter
const storage = bot.storage('todo-list');

// Get the array of items (default to empty array)
const items = storage.get('items') || [];

// Add an item to the array
items.push({
    name: 'Make breakfast',
    longDesc: 'Make some eggs and toast. Yum!'
});

// Set the value with the key 'items' to the updated array
storage.set('items', items);
// Save your changes, this step is probably important :P
storage.save();

// === Other StorageAdapter properties/methods
// StorageAdapter.load()
// - Loads data from the disk, called automatically
//   when a StorageAdapter is constructed
// StorageAdapter.internal
// - The raw internal storage object
// StorageAdapter.keys
// - The computed keys
// StorageAdapter.values
// - The computed values
//
// === Notes
// StorageAdapter instances are cached, so calling
// bot.storage('someName') from two different locations
// will actually give you the same object. A new
// StorageAdapter is only constructed the first time
// the adapter factory is called for a specific name.
```
