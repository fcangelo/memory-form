// Import types
import { 
  InMemoryObjInterface,
  LocalStorageObjInterface,
  MemoryFormInterface,
  NodeObjInterface,
  NodeTypeInterface
} from '../common/types';

// IE9 Polyfill - Makes input event fire for removing text
require('ie9-oninput-polyfill');

// MemoryForm Class
export default class MemoryForm implements MemoryFormInterface {

  constructor(private controlEls: InMemoryObjInterface = {}) {}

  private conformToArr(input: string | string[]) {
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

  private getNodeArr(elMetaData: NodeObjInterface, elData: NodeListOf<any>) { // any[]
    return (elMetaData.childNodeKey === '') ?
      Array.from(elData) :
      Array.from(elData[0][elMetaData.childNodeKey]);
  }

  private getValList(elMetaData: NodeObjInterface, elData: NodeListOf<any>) {
    const nodeArr: any[] = this.getNodeArr(elMetaData, elData);
    let retArr: (string | number)[] = [];

    for (let i: number = 0; i < nodeArr.length; i++) {
      retArr.push(nodeArr[i][elMetaData.searchKey]);
    }

    return retArr;
  }

  private setElVal(nodeList: NodeListOf<any>, elData: (string | number)[]) {
    const metaData: NodeObjInterface = this.GetNodeStructure(nodeList[0].type);
    const nodeArr: any[] = this.getNodeArr(metaData, nodeList);

    for (let i: number = 0; i < nodeArr.length; i++) {
      const element = nodeArr[i];

      element[metaData.searchKey] = elData[i];
    }
  }

  private getFormColVals(nodeList: NodeListOf<any>) {
    let metaData: NodeObjInterface = this.GetNodeStructure(nodeList[0].type);

    return this.getValList(metaData, nodeList);
  }

  private NodeObj(searchKey: string, childNodeKey: string = '') {
    return {
      searchKey: searchKey,
      childNodeKey: childNodeKey
    };
  }

  private GetNodeStructure(type: string) {
    let nodeTypes: NodeTypeInterface = {
      'checkbox'        : this.NodeObj('checked',       ''),
      'radio'           : this.NodeObj('checked',       ''),
      'select-multiple' : this.NodeObj('selected',      'options'),
      'select-one'      : this.NodeObj('selectedIndex', ''),
      'text'            : this.NodeObj('value',         ''),
      'textarea'        : this.NodeObj('value',         '')
    };

    return nodeTypes[type];
  }

  private elChanged(inputEvent: any) {
    if (inputEvent && inputEvent.target) {
      for (let [key, value] of Object.entries(this.controlEls)) {
        for (let i: number = 0; i < value.target.length; i++) {
          const element: any = value.target[i];

          if (inputEvent.target === element) {
            let valArr: (string | number)[] = this.getFormColVals(value.target);

            this.controlEls[key].targetValue = valArr;

            let messyCopedObj: InMemoryObjInterface = Object.assign({}, this.controlEls); // InMemoryObjInterface
            let messyReturnObj: LocalStorageObjInterface = {}; // LocalStorageObjInterface

            for (let [keySub, valueSub] of Object.entries(messyCopedObj)) {
              messyReturnObj[keySub] = valueSub.targetValue;
            }

            this.setLocalStorage(messyReturnObj);

            return;
          }
        }
      }
    }
  }

  private TargetDetails(target: NodeListOf<any>, targetType: string, targetValue: (string | number)[]) {
    return {
      target: target,
      targetType: targetType,
      targetValue: targetValue
    }
  }

  private inputChange(element: any) {
    const inputEls: string[] = ['text', 'textarea'];
    let eventType: string = 'change';

    if (inputEls.includes(element.type)) {
      eventType = 'input';
    }

    element.addEventListener(eventType, (inputEvent: any) => this.elChanged(inputEvent), false);
  }

  public watch(elements: string | string[]) {
    let arrEls: string[] = this.conformToArr(elements);
    let savedLocalStorage: (LocalStorageObjInterface | null) = this.getLocalStorage();
    let saveToLocalStorage: LocalStorageObjInterface = {};

    for (let i: number = 0; i < arrEls.length; i++) {
      const elementSearch: string = arrEls[i];

      try {
        let elementList: NodeListOf<any> = document.querySelectorAll(elementSearch);
        let elementType: (string | undefined) = elementList[0].type;

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
          this.controlEls[elementSearch] = this.TargetDetails(elementList, elementType, valArr);
        }

        for (let elIndex = 0; elIndex < elementList.length; elIndex++) {
          const elementToWatch = elementList[elIndex];
          
          this.inputChange(elementToWatch);
        }
      } catch (error) {
        console.error(error);
        console.log('Troubleshooting:', `Check element selectors. Start with '${elementSearch}'.`);
      }
    }

    // console.log('saveToLocalStorage:', saveToLocalStorage);
    // console.log('this.controlEls:', this.controlEls);

    this.setLocalStorage(saveToLocalStorage);
  }

  private getLocalStorage() {
    let locallyStored: (string | null) = localStorage.getItem('memory-form');

    if (locallyStored) {
      return JSON.parse(locallyStored);
    }

    return null;
  }

  private setLocalStorage(data: LocalStorageObjInterface) {
    localStorage.setItem('memory-form', JSON.stringify(data));
  }
}
