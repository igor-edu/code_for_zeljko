'use strict';

const url = 'https://typhoon-jasper-celsius.glitch.me';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      from: '1',
      to: '20',
      fetchingToken: false,
      fetchingData: false,
      error: null,
      data: [],
      token: null,
    };
  }

  componentDidMount() {
    this.obtainNewToken();
  }

  formatInput = (input) => {
    if (input === '' || input < 1) return '1';
    if (input > 1000) return '1000';
    return input;
  };

  handleFromInputChange = (e) => {
    this.setState({
      from: Math.min(this.formatInput(e.target.value), this.state.to),
    });
  };

  handleToInputChange = (e) => {
    this.setState({
      to: Math.max(this.formatInput(e.target.value), this.state.from),
    });
  };

  processError = (err) => {
    if (!err.response) {
      const message =
        (err.message || 'There was a network error, check your connection') +
        ', try to load data again!';
      this.setState({ error: message });
      return;
    }

    const { status, data } = err.response;

    switch (status) {
      case 400:
        this.setState({ error: data.error.message });
        break;
      case 401:
        this.setState({
          token: null,
          error: 'Token invalid, try obtaining new token!',
        });
        break;
      case 403:
        this.setState({
          token: null,
          error:
            'You are forbidden from accessing the server for some time! Try obtaining a new token and fetching data after a while!',
        });
        break;
      case 500:
        this.setState({
          token: null,
          error: 'There was a server error, new token is being obtained!',
        });
        this.obtainNewToken();
      default:
        break;
    }
  };

  obtainNewToken = () => {
    if (this.state.fetchingToken) return;

    this.setState({
      fetchingToken: true,
      error: null,
    });

    axios
      .get(url + '/api/token')
      .then((res) => {
        this.setState({
          fetchingToken: false,
          token: res.data.token,
        });
      })
      .catch((err) => {
        this.setState({
          fetchingToken: false,
        });
        this.processError(err);
      });
  };

  fetchData = () => {
    if (this.state.fetchingData) return;

    const { from, to, token } = this.state;

    this.setState({ fetchingData: true, error: null });

    axios
      .get(url + `/api/data?from=${from}&to=${to}&token=${token}`)
      .then((res) => {
        this.setState({
          fetchingData: false,
          error: null,
          data: res.data.data,
          token: res.data.token,
        });
      })
      .catch((err) => {
        this.setState({
          fetchingData: false,
          data: [],
        });
        this.processError(err);
      });
  };

  render() {
    const { data, error, from, to, token, fetchingToken } = this.state;
    return (
      <div>
        <nav>
          <h2>React Test Demo</h2>
        </nav>
        <div>
          <h2>{error}</h2>
        </div>
        <div>
          <label htmlFor='fromInput'>From:</label>
          <input
            type='number'
            id='fromInput'
            min='1'
            max='1000'
            onChange={this.handleFromInputChange}
            value={from}
          />
          <label htmlFor='toInput'>To:</label>
          <input
            type='number'
            id='toInput'
            min='1'
            max='1000'
            onChange={this.handleToInputChange}
            value={to}
          />
          {!fetchingToken && token && (
            <button onClick={this.fetchData}>Load Data</button>
          )}
          {!fetchingToken && token === null && (
            <button onClick={this.obtainNewToken}>Obtain New Token</button>
          )}
          {fetchingToken && <span>...Obtaining New Token...</span>}
        </div>
        <table>
          <thead>
            <tr>
              <th>Index</th>
              <th>Slot</th>
              <th>City</th>
              <th>Velocity</th>
            </tr>
          </thead>
          <tbody>
            {data &&
              data.map((row) => (
                <tr key={row.index}>
                  <td>{row.index}</td>
                  <td>{row.slot === null ? 0 : row.slot}</td>
                  <td>{row.city === null ? 'None' : row.city}</td>
                  <td>{row.velocity === null ? '0.00' : row.velocity}</td>
                </tr>
              ))}
          </tbody>
        </table>
        {/* {this.state.fetchingData && <h2>Fetching New Data...</h2>} */}
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('root'));
