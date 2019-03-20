// Types and Interfaces //

export interface MemoryFormConstructor {
  new (controlEls?: InMemoryObjInterface): MemoryFormInterface;
}

export interface MemoryFormInterface {
  // targetEl: HTMLElement;
  // controlEls: HTMLInputElement[];
  // init(): void;
  // conformToArr(input: string | string[]): string[];
  // getValList(elMetaData: NodeObjInterface, elData: NodeListOf<any>): (string | number)[];
  // getFormColVals(nodeList: NodeListOf<any>): (string | number)[];
  // NodeObj(searchKey: string, retKey: string, childNodeKey: string, isKeyStored: boolean, isSingleValue: boolean): NodeObjInterface;
  // GetNodeStructure(type: string): NodeObjInterface;
  watch(elements: string | string[]): void;
  // locallyStore(data: object): void;
}

export interface NodeTypeInterface {
  [type: string]: NodeObjInterface
}

export interface NodeObjInterface {
  searchKey: string,
  // retKey: string,
  childNodeKey: string,
  // isKeyStored: boolean,
  // isSingleValue: boolean
}

export interface InMemoryObjDetailsInterface {
  target: NodeListOf<any>,
  targetType: string,
  targetValue: (string | number)[]
}

export interface InMemoryObjInterface {
  [elKey: string]: InMemoryObjDetailsInterface
}

export interface LocalStorageObjInterface {
  [elKey: string]: (string | number)[]
}
