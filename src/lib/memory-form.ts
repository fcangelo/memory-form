// Import types
import {
  InMemoryObjInterface,
  InMemoryObjDetailsInterface,
  LocalStorageObjInterface,
  MemoryFormInterface,
  NodeObjInterface,
  NodeTypeInterface,
} from '../common/types';

// IE9 Polyfill - Makes input event fire for removing text
require('ie9-oninput-polyfill');

// MemoryForm Class
export default class MemoryForm implements MemoryFormInterface {
  public constructor(private controlEls: InMemoryObjInterface = {}) {}

  // Make sure user input is always in the form of an array
  private conformToArr(input: string | string[]): string[] {
    let retArr: string[] = [];

    // Test for input type
    if (typeof input === 'string') {
      // Used to be:
      // typeof input === 'string' || input instanceof String
      // ^
      // https://stackoverflow.com/a/9436948
      retArr.push(input);
    } else if (Array.isArray(input)) {
      retArr = input;
    }

    return retArr;
  }

  // Save new data on element change
  private elChanged(inputEvent: any): void {
    if (inputEvent && inputEvent.target) {
      // Single use var labeled for clarity
      const liveDomElement = inputEvent.target;

      for (let [key, value] of Object.entries(this.controlEls)) {
        for (let i = 0; i < value.target.length; i++) {
          const savedDomElementArr: any = value.target;

          // Update watched element in memory and local storage
          if (liveDomElement === savedDomElementArr[i]) {
            const valArr: (string | number)[] = this.getFormColVals(
              savedDomElementArr,
            );
            const selectedDomElementData: InMemoryObjDetailsInterface = this
              .controlEls[key];

            // Updates element with new values
            selectedDomElementData.targetValue = valArr;

            // Pushes changes to memory and local storage
            this.setMemFormState({
              [key]: selectedDomElementData,
            });

            return;
          }
        }
      }
    }
  }

  private getFormColVals(nodeList: NodeListOf<any>): (string | number)[] {
    let metaData: NodeObjInterface = this.getNodeStructure(nodeList[0].type);

    return this.getValList(metaData, nodeList);
  }

  private getLocalStorage(): object | null {
    let locallyStored: string | null = localStorage.getItem('memory-form');

    if (locallyStored) {
      return JSON.parse(locallyStored);
    }

    return null;
  }

  private getNodeArr(
    elMetaData: NodeObjInterface,
    elData: NodeListOf<any>,
  ): any[] {
    if (elMetaData.childNodeKey !== '') {
      return Array.from(elData[0][elMetaData.childNodeKey]);
    }

    return Array.from(elData);
  }

  private getNodeStructure(type: string): NodeObjInterface {
    let nodeTypes: NodeTypeInterface = {
      checkbox: this.nodeObj('checked', ''),
      radio: this.nodeObj('checked', ''),
      'select-multiple': this.nodeObj('selected', 'options'),
      'select-one': this.nodeObj('selectedIndex', ''),
      text: this.nodeObj('value', ''),
      textarea: this.nodeObj('value', ''),
    };

    return nodeTypes[type];
  }

  private getValList(
    elMetaData: NodeObjInterface,
    elData: NodeListOf<any>,
  ): (string | number)[] {
    const nodeArr: any[] = this.getNodeArr(elMetaData, elData);
    let retArr: (string | number)[] = [];

    for (let i = 0; i < nodeArr.length; i++) {
      retArr.push(nodeArr[i][elMetaData.searchKey]);
    }

    return retArr;
  }

  private inputChange(element: any): void {
    const inputEls: string[] = ['text', 'textarea'];
    let eventType = 'change';

    if (inputEls.includes(element.type)) {
      eventType = 'input';
    }

    element.addEventListener(
      eventType,
      (inputEvent: any) => this.elChanged(inputEvent),
      false,
    );
  }

  // Update local storage with saved form state
  private memFormToLocalStorage(updatedState: InMemoryObjInterface): void {
    let localStorageObj: LocalStorageObjInterface = {};

    for (let [key, value] of Object.entries(updatedState)) {
      localStorageObj[key] = value.targetValue;
    }

    this.setLocalStorage(localStorageObj);
  }

  private nodeObj(
    searchKey: string,
    childNodeKey: string = '',
  ): NodeObjInterface {
    return {
      searchKey: searchKey,
      childNodeKey: childNodeKey,
    };
  }

  private setElVal(
    nodeList: NodeListOf<any>,
    elData: (string | number)[],
  ): void {
    const metaData: NodeObjInterface = this.getNodeStructure(nodeList[0].type);
    const nodeArr: any[] = this.getNodeArr(metaData, nodeList);

    for (let i = 0; i < nodeArr.length; i++) {
      const element = nodeArr[i];

      element[metaData.searchKey] = elData[i];
    }
  }

  private setLocalStorage(data: LocalStorageObjInterface): void {
    localStorage.setItem('memory-form', JSON.stringify(data));
  }

  // Set saved form state to updated values
  private setMemFormState(updatedState: InMemoryObjInterface): void {
    const memFormCopy: InMemoryObjInterface = Object.assign(
      {},
      this.controlEls,
    );

    for (let [key, value] of Object.entries(updatedState)) {
      memFormCopy[key] = value;
    }

    this.controlEls = memFormCopy;
    this.memFormToLocalStorage(memFormCopy);
  }

  private targetDetails(
    target: NodeListOf<any>,
    targetType: string,
    targetValue: (string | number)[],
  ): InMemoryObjDetailsInterface {
    return {
      target: target,
      targetType: targetType,
      targetValue: targetValue,
    };
  }

  public watch(elements: string | string[]): void {
    let arrEls: string[] = this.conformToArr(elements);
    let savedLocalStorage: object | null = this.getLocalStorage();
    let saveToLocalStorage: LocalStorageObjInterface = {};

    for (let i = 0; i < arrEls.length; i++) {
      const elementSearch: string = arrEls[i];

      try {
        // Some ideas for how to fix 'unexpected any' //
        /*
          https://www.typescriptlang.org/docs/handbook/advanced-types.html
          https://stackoverflow.com/questions/43032004/queryselector-in-typescript
          https://medium.com/@mindplay/clean-dom-queries-in-typescript-c10f362d14fc
        */
        let elementList: NodeListOf<any> = document.querySelectorAll(
          elementSearch,
        );
        let elementType: string | undefined = elementList[0].type;

        if (elementList.length > 0 && elementType) {
          if (savedLocalStorage) {
            for (let [key, value] of Object.entries(savedLocalStorage)) {
              if (key === elementSearch) {
                this.setElVal(elementList, value);
              }
            }
          }

          let valArr: (string | number)[] = this.getFormColVals(elementList);

          saveToLocalStorage[elementSearch] = valArr;
          this.controlEls[elementSearch] = this.targetDetails(
            elementList,
            elementType,
            valArr,
          );
        }

        for (let elIndex = 0; elIndex < elementList.length; elIndex++) {
          const elementToWatch = elementList[elIndex];

          this.inputChange(elementToWatch);
        }
      } catch (error) {
        console.error(error);
        console.log(
          'Troubleshooting:',
          `Check element selectors. Start with '${elementSearch}'.`,
        );
      }
    }

    this.setLocalStorage(saveToLocalStorage);
  }
}
