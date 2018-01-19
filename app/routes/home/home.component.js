import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { FormattedMessage } from 'react-intl';
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
    setCurrentResult: PropTypes.func.isRequired,
  };

  state = {
    loaded: false,
    mountingComponent: 0,
    fetchingData: 0,
    firstContentfulPaintDuration: 0,
    timeToInteractiveDuration: 0,
  };

  componentWillMount() {
    this.perfume.start('MountingComponent');
    this.perfume.start('Painting');
    this.perfume.start('FetchingData');
    this.props.fetchMaintainers(this.props.language);
    this.waitForCFPInterval = this.waitForCFP();
    this.waitForTTIInterval = this.waitForTTI();
  }

  componentDidMount() {
    this.props.setCurrentResult({ data: 'data' });
    const mountingComponent = this.perfume.end('MountingComponent');
    this.setState({ mountingComponent });
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

  waitForCFPInterval = null;
  waitForTTIInterval = null;
  perfume = new Perfume({
    logging: true,
    firstContentfulPaint: true,
    timeToInteractive: true,
  });

  waitForTTI = () => setInterval(() => {
      console.log('waiting for tti');
      if (this.perfume.timeToInteractiveDuration !== 0) {
        this.setState({
          timeToInteractiveDuration: this.perfume.timeToInteractiveDuration,
        });
        clearInterval(this.waitForTTIInterval);
      }
  }, 5000);

  waitForCFP = () => setInterval(() => {
      console.log('waiting for cfp');
      if (this.perfume.firstContentfulPaintDuration !== 0) {
        this.setState({
          firstContentfulPaintDuration: this.perfume.firstContentfulPaintDuration
        });
        clearInterval(this.waitForCFPInterval);
      }
  }, 2500);

  render() {

    const { mountingComponent, fetchingData, firstContentfulPaintDuration, timeToInteractiveDuration } = this.state;

    return (
      <div className="home">
        <Helmet title="Homepage" />

        <h1 className="home__title">
          <i className="home__title-logo" />
          <FormattedMessage {...messages.welcome} />
        </h1>

        <div className="home__results">
          <h2>Your results:</h2>
          <div>
            <span className="home__results-title">Mounting Component:</span>
            <span className="home__results-value">{mountingComponent ? mountingComponent : '...'}</span>
          </div>
          <div>
            <span className="home__results-title">Fetching API data:</span>
            <span className="home__results-value">{fetchingData ? fetchingData : '...'}</span>
          </div>
          <div>
            <span className="home__results-title">First Contentful Paint:</span>
            <span className="home__results-value">{firstContentfulPaintDuration ? firstContentfulPaintDuration : '...'}</span>
          </div>
          <div>
            <span className="home__results-title">Time To Interactive:</span>
            <span className="home__results-value">{timeToInteractiveDuration ? timeToInteractiveDuration : '...'}</span>
          </div>
        </div>

        { !this.props.items.size
          ? <span className="home__loading-status home__loading-status--waiting">Loading content...</span>
          : <span className="home__loading-status home__loading-status--loaded">Loaded content</span> }

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
