# Memory Form

---

**Note: This plugin in a work in progress. The following instructions will likely not work until the plugin is complete.**

---

Much like memory foam, only this JavaScript plugin deals with HTML forms instead of pillows.

## Installing

In the near future you should be able to install by doing one of the following:

```
npm install memory-form
```
or
```
yarn add memory-form
```

---

## Usage

You can add via a path that will probably be nicer than...

```js
import MemoryForm from 'memory-form/lib/memory-form.ts';
```

...for TypeScript projects, or simply use the ES5 JavaScript version:

```js
import MemoryForm from 'memory-form/dist/memory-form.js';
```

This should hopefully make it easy to "watch" specified HTML form inputs such as:

* `<input type="text">`
* `<textarea>`
* `<select>`
* `<select multiple>`
* `<input type="radio">`
* `<input type="checkbox">`

Use the watch method to acheive this with local storage:

```js
let myMemoryForm = new MemoryForm();

myMemoryForm.watch([
    '#text-input',
    '#textarea-input',
    '#select-one-input',
    '#select-multiple-input',
    'input[name="input-radio-group"]',
    'input[name="input-checkbox-group"]'
]);
```

---

## License

[MIT](LICENSE)
