import { takeEvery, put, select, take, takeLatest } from 'redux-saga/effects';
import { eventChannel } from 'redux-saga';
import moment from 'moment';
import { defaultTo, pipe, toPairs, map } from 'ramda';

import firebase from '../../services/firebase';
import { DataActions, DataTypes } from './data.redux';
import { selectInitialized } from './data.selectors';
import { fetchMaintainers } from '../maintainers/maintainers.sagas';
import { MaintainersTypes } from '../maintainers/maintainers.redux';

const dbRef = firebase.database().ref('statistics');

function* watchChanges() {
  try {
    const isInitialized = yield select(selectInitialized);

    if (isInitialized) {
      return false;
    }

    yield put(DataActions.init());

    const channel = yield eventChannel((emitter) => {
      dbRef.on('value', (snapshot) => emitter(defaultTo({}, snapshot.val())));
      return () => dbRef.off('value');
    });

    while (true) { //eslint-disable-line
      const data = yield take(channel);
      const mapped = pipe(
        toPairs,
        map(([id, data]) => ({ id, ...data })),
      )(data);

      yield put(DataActions.setItems(mapped));
    }
  } catch (error) {
    console.error(error);
  }
}

function* pushItem({ data }) {
  try {
    yield dbRef.push().set({
      createdAt: moment().unix(),
      ...data,
    });
  } catch (e) {
    console.error(error);
  }
}

export default function* watchData() {
  yield takeLatest(DataTypes.WATCH, watchChanges);
  yield takeLatest(DataTypes.PUSH_ITEM, pushItem);
}


