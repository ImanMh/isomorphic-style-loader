/*! Isomorphic Style Loader | MIT License | https://github.com/kriasoft/isomorphic-style-loader */

'use strict';

var React = require('react');
var hoistStatics = require('hoist-non-react-statics');
var StyleContext = require('./StyleContext.js');

function _inheritsLoose(subClass, superClass) {
  subClass.prototype = Object.create(superClass.prototype);
  subClass.prototype.constructor = subClass;
  subClass.__proto__ = superClass;
}

function withStyles() {
  for (var _len = arguments.length, styles = new Array(_len), _key = 0; _key < _len; _key++) {
    styles[_key] = arguments[_key];
  }

  return function wrapWithStyles(ComposedComponent) {
    var WithStyles = function (_React$PureComponent) {
      _inheritsLoose(WithStyles, _React$PureComponent);

      function WithStyles(props, context) {
        var _this;

        _this = _React$PureComponent.call(this, props, context) || this;

        _this.markServerDuplicatedStyles();

        _this.removeCss = context.insertCss.apply(context, styles);
        return _this;
      }

      var _proto = WithStyles.prototype;

      _proto.componentWillUnmount = function componentWillUnmount() {
        if (this.removeCss) {
          setTimeout(this.removeCss, 0);
        }
      };

      _proto.markServerDuplicatedStyles = function markServerDuplicatedStyles() {
        var _this$context = this.context,
            isServer = _this$context.isServer,
            css = _this$context.css;

        if (!isServer) {
          return;
        }

        styles.forEach(function (style) {
          if (css.has(style._getCss())) {
            style.isDuplicate = true;
          } else {
            style.isDuplicate = false;
          }
        });
      };

      _proto.renderStyles = function renderStyles() {
        var isServer = this.context.isServer;

        if (!isServer) {
          return null;
        }

        if (isServer && styles.every(function (style) {
          return style.isDuplicate;
        })) {
          return null;
        }

        return React.createElement("style", {
          type: "text/css"
        }, styles.map(function (style) {
          return style.isDuplicate ? '' : style._getCss();
        }));
      };

      _proto.render = function render() {
        return React.createElement(React.Fragment, null, this.renderStyles(), React.createElement(ComposedComponent, this.props));
      };

      return WithStyles;
    }(React.PureComponent);

    var displayName = ComposedComponent.displayName || ComposedComponent.name || 'Component';
    WithStyles.displayName = "WithStyles(" + displayName + ")";
    WithStyles.contextType = StyleContext;
    WithStyles.ComposedComponent = ComposedComponent;
    return hoistStatics(WithStyles, ComposedComponent);
  };
}

module.exports = withStyles;
//# sourceMappingURL=withStyles.js.map
