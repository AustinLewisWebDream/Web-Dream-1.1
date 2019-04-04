"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _instanceof(left, right) { if (right != null && typeof Symbol !== "undefined" && right[Symbol.hasInstance]) { return right[Symbol.hasInstance](left); } else { return left instanceof right; } }

function _classCallCheck(instance, Constructor) { if (!_instanceof(instance, Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var MONTHLY_DISCOUNT_RATE = 1;
var ANNUAL_DISCOUNT_RATE = .75;
var SEMI_ANNUAL_DISCOUNT_RATE = .85;
var STARTER_PRICE = 4;
var BUSINESS_PRICE = 8;
var HYPER_PRICE = 15;

var HostingPlan = function HostingPlan(name, _cycle, description) {
  var _this = this;

  _classCallCheck(this, HostingPlan);

  _defineProperty(this, "discountedTotal", function () {
    return _this.getMonthly() * _this.getNumMonthsInCycle() * _this.getDiscountRate();
  });

  _defineProperty(this, "discountedMonthly", function () {
    return _this.getMonthly() * MONTHLY_DISCOUNT_RATE;
  });

  _defineProperty(this, "discountedSemiAnnual", function () {
    return _this.getMonthly() * 6 * SEMI_ANNUAL_DISCOUNT_RATE;
  });

  _defineProperty(this, "discountedAnnual", function () {
    return _this.getMonthly() * 12 * ANNUAL_DISCOUNT_RATE;
  });

  _defineProperty(this, "total", function () {
    return _this.getMonthly() * _this.getNumMonthsInCycle();
  });

  _defineProperty(this, "setCycle", function (cycle) {
    _this.cycle = cycle;
  });

  _defineProperty(this, "getInvoiceItem", function () {
    return {
      name: _this.name,
      price: _this.total(),
      description: _this.description
    };
  });

  _defineProperty(this, "getDiscountItem", function () {
    var discountAmount = _this.discountedTotal() - _this.total();

    if (discountAmount < 0) {
      return {
        name: 'Billing Cycle Discount',
        price: discountAmount,
        description: ((_this.getDiscountRate() * -1 + 1) * 100).toFixed(0) + '% off'
      };
    } else {
      return {
        name: '',
        price: 0,
        description: ''
      };
    }
  });

  _defineProperty(this, "getNumMonthsInCycle", function () {
    switch (_this.cycle) {
      case 'Annually':
        return 12;

      case 'Semi-Annually':
        return 6;

      case 'Monthly':
        return 1;

      default:
        return 1;
    }
  });

  _defineProperty(this, "getDiscountRate", function () {
    switch (_this.cycle) {
      case 'Annually':
        return ANNUAL_DISCOUNT_RATE;

      case 'Semi-Annually':
        return SEMI_ANNUAL_DISCOUNT_RATE;

      case 'Monthly':
        return MONTHLY_DISCOUNT_RATE;

      default:
        return 1;
    }
  });

  _defineProperty(this, "getMonthly", function () {
    switch (_this.name) {
      case 'Starter':
        return STARTER_PRICE;

      case 'Business':
        return BUSINESS_PRICE;

      case 'Hyper':
        return HYPER_PRICE;

      default:
        throw 'Cannot get monthly rate of invalid plan name: ' + _this.name;
    }
  });

  this.name = name;
  this.description = description;
  this.cycle = _cycle;
};

exports.default = HostingPlan;