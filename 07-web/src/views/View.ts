import { Model } from '../models/Model';

export abstract class View<T extends Model<K>, K> {
  regions: { [key: string]: Element } = {};

  constructor(public parent: Element, public model: T) {
    this.bindModel();
  }

  abstract template(): string;

  regionsMap(): { [key: string]: string } {
    return {};
  }

  eventsMap(): { [key: string]: () => void } {
    return {};
  }

  bindModel(): void {
    this.model.on('change', () => {
      this.render();
    });
  }

  bindEvents(fragment: DocumentFragment): void {
    const eventsMap = this.eventsMap();

    for (const eventKey in eventsMap) {
      if (Object.prototype.hasOwnProperty.call(eventsMap, eventKey)) {
        const [eventName, selector] = eventKey.split(':');

        fragment.querySelectorAll(selector).forEach((element) => {
          element.addEventListener(eventName, eventsMap[eventKey]);
        });
      }
    }
  }

  mapRegions(fragment: DocumentFragment): void {
    const regionsMap = this.regionsMap();

    for (const key in regionsMap) {
      if (Object.prototype.hasOwnProperty.call(regionsMap, key)) {
        const selector = regionsMap[key];
        const element = fragment.querySelector(selector);
        if (element) {
          this.regions[key] = element;
        }
      }
    }
  }

  onRender(): void {}

  render(): void {
    this.parent.innerHTML = '';
    const templeteElement = document.createElement('template');
    templeteElement.innerHTML = this.template();

    this.bindEvents(templeteElement.content);
    this.mapRegions(templeteElement.content);

    this.onRender();

    this.parent.append(templeteElement.content);
  }
}
