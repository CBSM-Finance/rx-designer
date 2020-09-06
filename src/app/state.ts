export class State {
  state: any = {};
  history: any[];

  constructor(initialState: any) {
    this.state = initialState;
  }

  set(key: string, value: any) {
    const newState = {
      ...this.state,
      [key]: value,
    };
    this.history.push(newState);
    this.state = newState;
  }

  get(key: string): any {
    return this.state[key];
  }
}
