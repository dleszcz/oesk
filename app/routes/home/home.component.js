import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { FormattedMessage } from 'react-intl';
import Perfume from 'perfume.js';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import Platform from 'platform';
import moment from 'moment';

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
    averageResultData: PropTypes.array.isRequired,
  };

  state = {
    loaded: false,
    browser: '',
    device: '',
    os: '',
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

    console.log('platform', Platform);
    this.setState({
      browser: Platform.name,
      os: Platform.os.family,
      device: Platform.product,
    });
  }

  componentDidMount() {
    this.props.setCurrentResult({
      mountingComponent: Math.random() * 1000,
      fetchingData: Math.random() * 1000,
      firstContentfulPaintDuration: Math.random() * 1000,
      timeToInteractiveDuration: Math.random() * 1000,
    });

    const mountingComponent = this.perfume.end('MountingComponent');
    this.setState({ mountingComponent });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.language !== this.props.language) {
      this.props.fetchMaintainers(nextProps.language);
    }
  }

  componentDidUpdate( { items } ) {
    const { os, device, browser, mountingComponent, fetchingData, firstContentfulPaintDuration, timeToInteractiveDuration } = this.state;

    if (items !== this.props.items) {
      const fetchingData = this.perfume.end('FetchingData');
      this.setState({ fetchingData });
    }

    if (mountingComponent && fetchingData && firstContentfulPaintDuration && timeToInteractiveDuration) {

      this.props.setCurrentResult({
        os, device, browser, mountingComponent, fetchingData, firstContentfulPaintDuration, timeToInteractiveDuration
      });
    }
  }

  waitForCFPInterval = null;
  waitForTTIInterval = null;
  perfume = new Perfume({
    logging: true,
    firstContentfulPaint: true,
    timeToInteractive: true,
  });

  waitForCFP = () => setInterval(() => {
    console.log('waiting for cfp');
    if (this.perfume.firstContentfulPaintDuration !== 0) {
      this.setState({
        firstContentfulPaintDuration: this.perfume.firstContentfulPaintDuration
      });
      clearInterval(this.waitForCFPInterval);
    }
  }, 2500);


  waitForTTI = () => setInterval(() => {
    console.log('waiting for tti');
    if (this.perfume.timeToInteractiveDuration !== 0) {
      this.setState({
        timeToInteractiveDuration: this.perfume.timeToInteractiveDuration,
      });
      clearInterval(this.waitForTTIInterval);
    }
  }, 5000);


  render() {
    const { browser, product, os, mountingComponent, fetchingData, firstContentfulPaintDuration, timeToInteractiveDuration } = this.state;

    return (
      <div className="home">
        <Helmet title="Homepage" />

        <h1 className="home__title">
          <FormattedMessage {...messages.welcome} />
        </h1>

        <div className="home__results">
          <h2>Your results:</h2>
          <div>
            <span className="home__results-info">
              {`${browser}, ${os}, ${product}`}
            </span>
          </div>
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

        <BarChart width={600} height={300} data={this.props.averageResultData}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <XAxis dataKey="name" />
          <YAxis />
          <CartesianGrid strokeDasharray="3 3" />
          <Tooltip />
          <Legend />
          <Bar dataKey="pv" fill="#8884d8" />
          <Bar dataKey="uv" fill="#82ca9d" />
        </BarChart>

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
