import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import Perfume from 'perfume.js';
import { IntlProvider } from 'react-intl';
import { get } from 'lodash';

import { appLocales, translationMessages } from '../i18n';
import { DEFAULT_LOCALE } from '../modules/locales/locales.redux';


export class App extends PureComponent {
  static propTypes = {
    language: PropTypes.string,
    setLanguage: PropTypes.func.isRequired,
    children: PropTypes.node,
    match: PropTypes.object.isRequired,
    history: PropTypes.shape({
      push: PropTypes.func.isRequired,
    }).isRequired,
    location: PropTypes.object.isRequired,
  };

  componentWillMount() {
    this.perfume.start('Mounting');
    this.perfume.start('Painting');
    const language = get(this.props.match, 'params.lang', DEFAULT_LOCALE);

    if (appLocales.indexOf(language) === -1) {
      this.props.setLanguage(DEFAULT_LOCALE);
      this.props.history.push('/404');
    } else {
      this.props.setLanguage(language);
    }
  }

  componentDidMount() {
    const mounting = this.perfume.end('Mounting');
    const painting = this.perfume.endPaint('Painting');
    const { firstContentfulPaintDuration, timeToInteractiveDuration } = this.perfume;

    const metrics = {
      mounting,
      painting,
      firstContentfulPaintDuration,
      timeToInteractiveDuration,
    };

    console.log('metrics', metrics);
  }

  perfume = new Perfume({
    logging: true,
    firstContentfulPaint: true,
    timeToInteractive: true,
  });

  render() {
    if (!this.props.language) {
      return null;
    }

    return (
      <div className="app">
        <Helmet
          titleTemplate="%s - Apptension React Boilerplate"
          defaultTitle="Apptension React Boilerplate"
          meta={[
            { name: 'description', content: 'Apptension React Boilerplate application' },
          ]}
        />

        <IntlProvider
          locale={this.props.language}
          messages={translationMessages[this.props.language]}
          location={this.props.location}
        >
          {React.Children.only(this.props.children)}
        </IntlProvider>
      </div>
    );
  }
}
