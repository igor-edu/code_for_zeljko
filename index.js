'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var url = 'https://typhoon-jasper-celsius.glitch.me';

var App = function (_React$Component) {
  _inherits(App, _React$Component);

  function App(props) {
    _classCallCheck(this, App);

    var _this = _possibleConstructorReturn(this, (App.__proto__ || Object.getPrototypeOf(App)).call(this, props));

    _this.formatInput = function (input) {
      if (input === '' || input < 1) return '1';
      if (input > 1000) return '1000';
      return input;
    };

    _this.handleFromInputChange = function (e) {
      _this.setState({
        from: Math.min(_this.formatInput(e.target.value), _this.state.to)
      });
    };

    _this.handleToInputChange = function (e) {
      _this.setState({
        to: Math.max(_this.formatInput(e.target.value), _this.state.from)
      });
    };

    _this.processError = function (err) {
      if (!err.response) {
        var message = (err.message || 'There was a network error, check your connection') + ', try to load data again!';
        _this.setState({ error: message });
        return;
      }

      var _err$response = err.response,
          status = _err$response.status,
          data = _err$response.data;


      switch (status) {
        case 400:
          _this.setState({ error: data.error.message });
          break;
        case 401:
          _this.setState({
            token: null,
            error: 'Token invalid, try obtaining new token!'
          });
          break;
        case 403:
          _this.setState({
            token: null,
            error: 'You are forbidden from accessing the server for some time! Try obtaining a new token and fetching data after a while!'
          });
          break;
        case 500:
          _this.setState({
            token: null,
            error: 'There was a server error, new token is being obtained!'
          });
          _this.obtainNewToken();
        default:
          break;
      }
    };

    _this.obtainNewToken = function () {
      if (_this.state.fetchingToken) return;

      _this.setState({
        fetchingToken: true,
        error: null
      });

      axios.get(url + '/api/token').then(function (res) {
        _this.setState({
          fetchingToken: false,
          token: res.data.token
        });
      }).catch(function (err) {
        _this.setState({
          fetchingToken: false
        });
        _this.processError(err);
      });
    };

    _this.fetchData = function () {
      if (_this.state.fetchingData) return;

      var _this$state = _this.state,
          from = _this$state.from,
          to = _this$state.to,
          token = _this$state.token;


      _this.setState({ fetchingData: true, error: null });

      axios.get(url + ('/api/data?from=' + from + '&to=' + to + '&token=' + token)).then(function (res) {
        _this.setState({
          fetchingData: false,
          error: null,
          data: res.data.data,
          token: res.data.token
        });
      }).catch(function (err) {
        _this.setState({
          fetchingData: false,
          data: []
        });
        _this.processError(err);
      });
    };

    _this.state = {
      from: '1',
      to: '20',
      fetchingToken: false,
      fetchingData: false,
      error: null,
      data: [],
      token: null
    };
    return _this;
  }

  _createClass(App, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.obtainNewToken();
    }
  }, {
    key: 'render',
    value: function render() {
      var _state = this.state,
          data = _state.data,
          error = _state.error,
          from = _state.from,
          to = _state.to,
          token = _state.token,
          fetchingToken = _state.fetchingToken;

      return React.createElement(
        'div',
        null,
        React.createElement(
          'nav',
          null,
          React.createElement(
            'h2',
            null,
            'React Test Demo'
          )
        ),
        React.createElement(
          'div',
          null,
          React.createElement(
            'h2',
            null,
            error
          )
        ),
        React.createElement(
          'div',
          null,
          React.createElement(
            'label',
            { htmlFor: 'fromInput' },
            'From:'
          ),
          React.createElement('input', {
            type: 'number',
            id: 'fromInput',
            min: '1',
            max: '1000',
            onChange: this.handleFromInputChange,
            value: from
          }),
          React.createElement(
            'label',
            { htmlFor: 'toInput' },
            'To:'
          ),
          React.createElement('input', {
            type: 'number',
            id: 'toInput',
            min: '1',
            max: '1000',
            onChange: this.handleToInputChange,
            value: to
          }),
          !fetchingToken && token && React.createElement(
            'button',
            { onClick: this.fetchData },
            'Load Data'
          ),
          !fetchingToken && token === null && React.createElement(
            'button',
            { onClick: this.obtainNewToken },
            'Obtain New Token'
          ),
          fetchingToken && React.createElement(
            'span',
            null,
            '...Obtaining New Token...'
          )
        ),
        React.createElement(
          'table',
          null,
          React.createElement(
            'thead',
            null,
            React.createElement(
              'tr',
              null,
              React.createElement(
                'th',
                null,
                'Index'
              ),
              React.createElement(
                'th',
                null,
                'Slot'
              ),
              React.createElement(
                'th',
                null,
                'City'
              ),
              React.createElement(
                'th',
                null,
                'Velocity'
              )
            )
          ),
          React.createElement(
            'tbody',
            null,
            data && data.map(function (row) {
              return React.createElement(
                'tr',
                { key: row.index },
                React.createElement(
                  'td',
                  null,
                  row.index
                ),
                React.createElement(
                  'td',
                  null,
                  row.slot === null ? 0 : row.slot
                ),
                React.createElement(
                  'td',
                  null,
                  row.city === null ? 'None' : row.city
                ),
                React.createElement(
                  'td',
                  null,
                  row.velocity === null ? '0.00' : row.velocity
                )
              );
            })
          )
        )
      );
    }
  }]);

  return App;
}(React.Component);

ReactDOM.render(React.createElement(App, null), document.getElementById('root'));