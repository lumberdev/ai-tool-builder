interface SomeCustomEvent extends Event {
  detail?: {
    nestedProperty: boolean;
  };
}

interface AdditionalMenuContext {
  type: string;
}

declare global {
  interface WindowEventMap {
    _onopenmenu: CustomEvent<AdditionalMenuContext>;
  }
}
