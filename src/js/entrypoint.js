import { Controller } from './controls/controller.js';
import { Model } from './models/model.js';
import * as Views from './views';

// https://forkify-api.herokuapp.com/v2

// coming from parcel
// if (module.hot) {
//   module.hot.accept();
// }

const model = new Model();
const controller = new Controller(model, Views);
