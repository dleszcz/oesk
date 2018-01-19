import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { FormattedMessage } from 'react-intl';
import envConfig from 'env-config';
import { Link } from 'react-router-dom';
import Perfume from 'perfume.js';

import messages from './home.messages';
import { ItemsList } from './itemsList/itemsList.component';
import { LanguageSelector } from './languageSelector/languageSelector.component';


export class Home extends PureComponent {
  static propTypes = {
    items: PropTypes.object,
    language: PropTypes.string.isRequired,
    fetchMaintainers: PropTypes.func.isRequired,
    setLanguage: PropTypes.func.isRequired,
    match: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    history: PropTypes.shape({
      push: PropTypes.func.isRequired,
    }).isRequired,
  };

  state = {
    loaded: false,
    mountingComponent: 0,
    painting: 0,
    fetchingData: 0,
    firstContentfulPaintDuration: 0,
    timeToInteractiveDuration: 0,
  };

  componentWillMount() {
    this.perfume.start('MountingComponent');
    this.perfume.start('Painting');
    this.perfume.start('FetchingData');
    this.props.fetchMaintainers(this.props.language);
  }

  componentDidMount() {
    const mountingComponent = this.perfume.end('MountingComponent');
    const { firstContentfulPaintDuration, timeToInteractiveDuration } = this.perfume;

    this.setState({
      mountingComponent,
      firstContentfulPaintDuration,
      timeToInteractiveDuration,
    });
    console.log('metrics', this.state);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.language !== this.props.language) {
      this.props.fetchMaintainers(nextProps.language);
    }
  }

  componentDidUpdate( { items } ) {
    if (items !== this.props.items) {
      const fetchingData = this.perfume.end('FetchingData');
      this.setState({ fetchingData });
    }
  }

  perfume = new Perfume({
    logging: true,
    firstContentfulPaint: true,
    timeToInteractive: true,
  });

  render() {
    if (!this.props.items.size) {
      return <div>Loading...</div>;
    }

    const painting = this.perfume.endPaint('Painting');

    return (
      <div className="home">
        <Helmet title="Homepage" />

        <h1 className="home__title">
          <i className="home__title-logo" />
          <FormattedMessage {...messages.welcome} />
        </h1>

        <div>
          <Link to={`${this.props.match.url}/results`}>Go to results</Link>
        </div>

        <ItemsList items={this.props.items} />

        <LanguageSelector
          language={this.props.language}
          setLanguage={this.props.setLanguage}
          match={this.props.match}
          history={this.props.history}
          location={this.props.location}
        />
      </div>
    );
  }
}
