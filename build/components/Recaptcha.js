'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var isReady = function isReady() {
    return Boolean((typeof window === 'undefined' ? 'undefined' : _typeof(window)) === 'object' && window.grecaptcha && window.grecaptcha.render);
};

var Recaptcha = function (_PureComponent) {
    _inherits(Recaptcha, _PureComponent);

    function Recaptcha(props) {
        _classCallCheck(this, Recaptcha);

        var _this = _possibleConstructorReturn(this, (Recaptcha.__proto__ || Object.getPrototypeOf(Recaptcha)).call(this, props));

        _this.execute = function () {
            if (_this.props.onClose) {
                _this._registerOnCloseListener();
            }
            window.grecaptcha.execute(_this.widget);
        };

        _this.reset = function () {
            window.grecaptcha.reset(_this.widget);
        };

        _this._isRendered = function () {
            return typeof _this.widget === 'number';
        };

        _this._updateReadyState = function () {
            if (isReady()) {
                clearInterval(_this.readyInterval);
                _this.setState({
                    ready: true
                });
            }
        };

        _this._registerOnCloseListener = function () {
            if (_this.onCloseObserver) {
                _this.onCloseObserver.disconnect();
            }

            var iframes = document.getElementsByTagName('iframe');
            var recaptchaFrame = Array.prototype.find.call(iframes, function (e) {
                return e.src.includes('google.com/recaptcha/api2/bframe');
            });
            var recaptchaElement = recaptchaFrame.parentNode.parentNode;

            var lastOpacity = recaptchaElement.style.opacity;
            _this.onCloseObserver = new MutationObserver(function (mutations) {
                if (lastOpacity !== recaptchaElement.style.opacity && recaptchaElement.style.opacity == 0) {
                    // eslint-disable-line eqeqeq
                    _this.props.onClose();
                }
                lastOpacity = recaptchaElement.style.opacity;
            });
            _this.onCloseObserver.observe(recaptchaElement, {
                attributes: true,
                attributeFilter: ['style']
            });
        };

        _this.state = {
            ready: isReady()
        };
        return _this;
    }

    _createClass(Recaptcha, [{
        key: 'componentDidMount',
        value: function componentDidMount() {
            if (this.state.ready) {
                this._renderRecaptcha();
            } else {
                this.readyInterval = setInterval(this._updateReadyState, 1000);
            }
        }
    }, {
        key: 'componentDidUpdate',
        value: function componentDidUpdate(prevProps, prevState) {
            if (!this._isRendered() && this.state.ready && !prevState.ready) {
                this._renderRecaptcha();
            }
        }
    }, {
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {
            if (this.readyInterval) {
                clearInterval(this.readyInterval);
            }
            if (this.onCloseObserver) {
                this.onCloseObserver.disconnect();
            }
            if (this._isRendered()) {
                window.grecaptcha.reset(this.widget);
            }
        }
    }, {
        key: '_renderRecaptcha',
        value: function _renderRecaptcha() {
            var _props = this.props,
                siteKey = _props.siteKey,
                size = _props.size,
                onLoad = _props.onLoad,
                onVerify = _props.onVerify,
                onExpire = _props.onExpire,
                onError = _props.onError,
                theme = _props.theme,
                id = _props.id;

            this.widget = window.grecaptcha.render(id, {
                sitekey: siteKey,
                size: size,
                theme: theme,
                callback: onVerify,
                'expired-callback': onExpire,
                'error-callback': onError
            });
            if (onLoad) {
                onLoad();
            }
        }
    }, {
        key: 'render',
        value: function render() {
            return _react2.default.createElement('span', { id: this.props.id });
        }
    }]);

    return Recaptcha;
}(_react.PureComponent);

Recaptcha.propTypes = {
    id: _propTypes2.default.string,
    siteKey: _propTypes2.default.string.isRequired,
    size: _propTypes2.default.oneOf(['invisible', 'normal', 'compact']),
    theme: _propTypes2.default.oneOf(['light', 'dark']),
    onLoad: _propTypes2.default.func,
    onVerify: _propTypes2.default.func,
    onExpire: _propTypes2.default.func,
    onError: _propTypes2.default.func,
    onClose: _propTypes2.default.func
};
Recaptcha.defaultProps = {
    id: 'react-recaptcha-that-works',
    size: 'normal',
    theme: 'light',
    onLoad: undefined,
    onVerify: undefined,
    onExpire: undefined,
    onError: undefined,
    onClose: undefined
};
exports.default = Recaptcha;