export type ComponentData = {
  "ring-light": {
    brightness: number;
    warmth: number;
  };
};

export type DeviceName = keyof ComponentData;

export const DEFAULT_COMPONENT_DATA: ComponentData = {
  "ring-light": {
    brightness: 0,
    warmth: 0.5,
  },
};

export const COMPONENT_DATA_TEMPLATES: Record<
  string,
  () => Partial<ComponentData>
> = {
  "lights-on": () => ({
    "ring-light": {
      brightness: 1,
      warmth: 0.5,
    },
  }),

  "lights-off": () => ({
    "ring-light": {
      brightness: 0,
      warmth: 0,
    },
  }),
};
