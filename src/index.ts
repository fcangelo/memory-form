// Babel Polyfill
import "@babel/polyfill";

// Import MemoryForm class
import MemoryForm from './lib/memory-form';

if (process.env.NODE_ENV === 'development') {
  // Import and run example
  // Easy (read: lazy) way to do conditional imports
  // https://stackoverflow.com/a/40277993
  // Why the other way takes more work
  // https://babeljs.io/docs/en/babel-plugin-syntax-dynamic-import/
  const ExampleJS = require('./example/index').default;
  const examplePage = new ExampleJS(MemoryForm);

  examplePage.init();
}

// Export default MemoryForm class
export default MemoryForm;
