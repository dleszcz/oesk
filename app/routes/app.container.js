import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { createStructuredSelector } from 'reselect';
import { withRouter } from 'react-router-dom';

import { App } from './app.component';
import { selectLocalesLanguage } from '../modules/locales/locales.selectors';
import { LocalesActions } from '../modules/locales/locales.redux';
import { DataActions } from '../modules/data/data.redux';

const mapStateToProps = createStructuredSelector({
  language: selectLocalesLanguage,
});

export const mapDispatchToProps = (dispatch) => bindActionCreators({
  setLanguage: LocalesActions.setLanguage,
  watchData: DataActions.watch,
}, dispatch);

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));
