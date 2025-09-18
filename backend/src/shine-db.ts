import { ComponentData, DEFAULT_COMPONENT_DATA } from "../../ts-shared/types";

export class ShineDB {
  private componentData: ComponentData;

  constructor() {
    this.componentData = DEFAULT_COMPONENT_DATA;
  }

  public getComponentData<K extends keyof ComponentData>(
    key: K
  ): ComponentData[K] {
    return this.componentData[key];
  }

  public getAllData() {
    return this.componentData;
  }

  public setComponentData(data: Partial<ComponentData>) {
    this.componentData = {
      ...this.componentData,
      ...data,
    };
  }
}
