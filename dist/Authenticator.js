"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AuthenticationContainer = exports.AUTH_STATES = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _index = require("material-ui/styles/index");

var _SignIn = require("./Components/SignIn");

var _SignIn2 = _interopRequireDefault(_SignIn);

var _ForgotPassword = require("./Components/ForgotPassword");

var _ForgotPassword2 = _interopRequireDefault(_ForgotPassword);

var _RequireNewPassword = require("./Components/RequireNewPassword");

var _RequireNewPassword2 = _interopRequireDefault(_RequireNewPassword);

var _Utils = require("./Utils");

var _Paper = require("material-ui/Paper/Paper");

var _Paper2 = _interopRequireDefault(_Paper);

var _AmplifyMessageMap = require("aws-amplify-react/dist/AmplifyMessageMap");

var _AmplifyMessageMap2 = _interopRequireDefault(_AmplifyMessageMap);

var _awsAmplify = require("aws-amplify");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var AUTH_STATES = exports.AUTH_STATES = {
  signIn: "signIn",
  signUp: "signUp",
  confirmSignIn: "confirmSignIn",
  confirmSignUp: "confirmSignUp",
  forgotPassword: "forgotPassword",
  requireNewPassword: "requireNewPassword",
  verifyContact: "verifyContact",
  signedIn: "signedIn",
  signedOut: "signedOut"
};

var styles = function styles(theme) {
  return {
    authenticatorContainer: {
      display: "flex",
      justifyContent: "center",
      width: "100%",
      height: "100%",
      overflow: "auto",
      position: "absolute",
      background: "linear-gradient(\n      240deg,\n      " + (0, _Utils.adjustRBGAlphaCss)(theme.palette.primary.dark, .80) + ",\n      " + (0, _Utils.adjustRBGAlphaCss)(theme.palette.primary.dark, .85) + "\n    );\n  "
    },
    authenticationPaper: {
      position: "absolute",
      flexDirection: "column",
      marginTop: "80px",
      width: "50%",
      maxWidth: "450px",
      minWidth: "400px"
    }
  };
};

var defaultState = {
  errorColor: "#ff5722",
  authState: AUTH_STATES.signIn,
  authData: null,
  error: null
};

var Authenticator = function (_Component) {
  _inherits(Authenticator, _Component);

  function Authenticator(props, context) {
    _classCallCheck(this, Authenticator);

    var _this = _possibleConstructorReturn(this, (Authenticator.__proto__ || Object.getPrototypeOf(Authenticator)).call(this, props, context));

    _this.handleStateChange = function (state, data) {
      if (state === _this.state.authState) {
        return;
      }

      if (state === AUTH_STATES.signedOut) {
        state = AUTH_STATES.signIn;
      }

      _this.setState({ authState: state, authData: data, error: null });
      if (_this.props.onStateChange) {
        _this.props.onStateChange(state, data);
      }
    };

    _this.handleAuthEvent = function (state, event) {
      if (event.type === 'error') {
        var map = _this.props.errorMessage || _AmplifyMessageMap2["default"];
        var message = typeof map === 'string' ? map : map(event.data);
        _this.setState({ error: message });
      }
    };

    _this.errorRenderer = function (err) {
      return _react2["default"].createElement(
        "h1",
        null,
        "there was an error"
      );
    };

    _this.state = Object.assign({}, defaultState, {
      errorColor: !!_this.props.errorColor ? _this.props.errorColor : defaultState.errorColor
    });
    _this.state = defaultState;
    return _this;
  }

  _createClass(Authenticator, [{
    key: "componentDidMount",
    value: function () {
      function componentDidMount() {
        this.checkUser();
      }

      return componentDidMount;
    }()
  }, {
    key: "checkUser",
    value: function () {
      function checkUser() {
        var _this2 = this;

        return _awsAmplify.Auth.currentAuthenticatedUser().then(function (user) {
          var state = user ? AUTH_STATES.signedIn : AUTH_STATES.signIn;
          _this2.handleStateChange(state, user);
        })["catch"](function (err) {
          _this2.handleStateChange(AUTH_STATES.signIn);
        });
      }

      return checkUser;
    }()
  }, {
    key: "render",
    value: function () {
      function render() {
        var _this3 = this;

        var _state = this.state,
            authState = _state.authState,
            authData = _state.authData,
            errorColor = _state.errorColor;


        console.log("errorColor: ", errorColor);

        var _props = this.props,
            hideDefault = _props.hideDefault,
            hide = _props.hide,
            federated = _props.federated;

        if (!hide) {
          hide = [];
        }
        if (hideDefault) {
          hide = hide.concat([_SignIn2["default"]]);
        }

        var props_children = this.props.children || [];
        var default_children = [_react2["default"].createElement(_SignIn2["default"], { federated: federated, errorColor: errorColor }), _react2["default"].createElement(_RequireNewPassword2["default"], { errorColor: errorColor }), _react2["default"].createElement(_ForgotPassword2["default"], { errorColor: errorColor })];

        var children = default_children.concat(props_children);
        var render_children = _react2["default"].Children.map(children, function (child) {
          return _react2["default"].cloneElement(child, {
            authState: authState,
            authData: authData,
            onStateChange: _this3.handleStateChange,
            onAuthEvent: _this3.handleAuthEvent,
            hide: hide
          });
        });

        var errorRenderer = this.props.errorRenderer || this.errorRenderer;
        var error = this.state.error;

        return _react2["default"].createElement(
          "div",
          null,
          render_children,
          error ? errorRenderer(error) : null
        );
      }

      return render;
    }()
  }]);

  return Authenticator;
}(_react.Component);

exports["default"] = (0, _index.withStyles)(styles)(Authenticator);

var _AuthenticationContainer = function (_Component2) {
  _inherits(_AuthenticationContainer, _Component2);

  function _AuthenticationContainer() {
    _classCallCheck(this, _AuthenticationContainer);

    return _possibleConstructorReturn(this, (_AuthenticationContainer.__proto__ || Object.getPrototypeOf(_AuthenticationContainer)).apply(this, arguments));
  }

  _createClass(_AuthenticationContainer, [{
    key: "render",
    value: function () {
      function render() {
        var _props2 = this.props,
            children = _props2.children,
            classes = _props2.classes;

        return _react2["default"].createElement(
          "div",
          null,
          _react2["default"].createElement(
            "div",
            { className: classes.authenticatorContainer },
            _react2["default"].createElement(
              _Paper2["default"],
              { className: classes.authenticationPaper },
              children
            )
          )
        );
      }

      return render;
    }()
  }]);

  return _AuthenticationContainer;
}(_react.Component);

var AuthenticationContainer = exports.AuthenticationContainer = (0, _index.withStyles)(styles)(_AuthenticationContainer);