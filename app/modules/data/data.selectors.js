import { createSelector } from 'reselect';
import { filter, complement, map, isNil, pipe, mean, when, either, isEmpty, always } from 'ramda';
import { fromJS } from 'immutable';

export const selectData = state => state.get('data');
const metricsKeys = ['mountingComponent', 'fetchingData', 'firstContentfulPaintDuration', 'timeToInteractiveDuration'];

export const selectItems = createSelector(
  selectData,
  state => state.get('items'),
);

export const selectInitialized = createSelector(
  selectData,
  state => state.get('initialized'),
);

export const selectCurrentResult = createSelector(
  selectData,
  state => state.get('currentResult'),
);

export const selectAverageResultData = createSelector(
  selectItems, selectCurrentResult,
  (state, currentResult) => {
    const merged = metricsKeys.map(key => state.map(item => item.get(key)));
    const calculated = pipe(
      map(item => item.toJS()),
      map(item => filter(complement(isNil))(item)),
    )(merged);

    const averages = calculated.map(pipe(
      when(
        either(isNil, isEmpty),
        always([])
      ),
      mean,
    ));

    console.log(averages, currentResult.toJS());

    return [
      // {name: 'Page A', uv: 4000, pv: 2400, amt: 2400},
      // {name: 'Page B', uv: 3000, pv: 1398, amt: 2210},
      // {name: 'Page C', uv: 2000, pv: 9800, amt: 2290},
      // {name: 'Page D', uv: 2780, pv: 3908, amt: 2000},
      // {name: 'Page E', uv: 1890, pv: 4800, amt: 2181},
      // {name: 'Page F', uv: 2390, pv: 3800, amt: 2500},
      // {name: 'Page G', uv: 3490, pv: 4300, amt: 2100},
    ];
  }
);
