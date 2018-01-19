import { all, fork } from 'redux-saga/effects';
import maintainersSaga from './maintainers/maintainers.sagas';
import dataSaga from './data/data.sagas';

export default function* rootSaga() {
  yield all([
    fork(maintainersSaga),
    fork(dataSaga),
  ]);
}
