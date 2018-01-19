import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { createStructuredSelector } from 'reselect';

import { Home } from './home.component';
import { MaintainersActions } from '../../modules/maintainers/maintainers.redux';
import { selectMaintainersItems } from '../../modules/maintainers/maintainers.selectors';
import { LocalesActions } from '../../modules/locales/locales.redux';
import { selectLocalesLanguage } from '../../modules/locales/locales.selectors';
import { DataActions } from '../../modules/data/data.redux';
import { selectAverageResultData } from '../../modules/data/data.selectors';

const mapStateToProps = createStructuredSelector({
  items: selectMaintainersItems,
  language: selectLocalesLanguage,
  averageResultData: selectAverageResultData,
});

export const mapDispatchToProps = (dispatch) => bindActionCreators({
  fetchMaintainers: MaintainersActions.fetch,
  setLanguage: LocalesActions.setLanguage,
  setCurrentResult: DataActions.setCurrentResult,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Home);
