// Import SCSS files
import './scss/styles.scss';

// Import types
import { 
  MemoryFormConstructor,
  MemoryFormInterface 
} from '../common/types';

// Example JavaScript to run on index.html
class ExampleJS {
  private exampleMemoryForm: MemoryFormInterface;

  constructor(memoryForm: MemoryFormConstructor) {
    let targetEl: (HTMLElement | null) = document.querySelector('#memory-form-target-el');
    // let controlEl1  = document.querySelector('#memory-form-control-el');

    this.exampleMemoryForm  = new memoryForm();
    // this.controlGear          = document.querySelector('#memory-form-control-el');
  }

  public init() {
    // this.setGear();
    // this.exampleMemoryForm.init();
    // this.setEvents();

    // Add elements to watch
    // let watchEls = [];

    // watchEls.push('#text-input');
    // watchEls.push('#textarea-input');
    // watchEls.push('#select-input');
    // watchEls.push('input[name="input-radio-group"]:checked');
    // watchEls.push('input[name="input-checkbox-group"]:checked');

    // let watchEls = '#text-input';

    // this.exampleMemoryForm.addToControlElsArr(watchEls);

    this.exampleMemoryForm.watch([
      '#text-input',
      '#textarea-input',
      '#select-one-input',
      '#select-multiple-input',
      'input[name="input-radio-group"]',
      'input[name="input-checkbox-group"]'
    ]);

    // this.exampleMemoryForm.watch('#text-input');
  }
}

export default ExampleJS;
