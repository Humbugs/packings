var assert = require('chai').assert;
var sinon = require('sinon');
var I = require('seamless-immutable');
var JSE = require('jekyll-store-engine');
var s = JSE.Stores.DeliveryMethods;
require('../src/DeliveryMethodsStoreDecorator');

describe('DeliveryMethodsStoreDecorator', function() {
  var input = [
    { name: 'L48', packing_type: 'L', zones: ['West'], calculator: 'Percent' },
    { name: 'P48', packing_type: 'P', zones: ['West'], calculator: 'Percent' },
    { name: 'All', zones: ['West'], calculator: 'Percent' }
  ];
  input[0].args = { field: 'total', percent: 25 };
  input[1].args = { field: 'total', percent: 25 };
  input[2].args = { field: 'total', percent: 25 };

  before(function() {
    s.trigger = sinon.spy();
    s.country = I({ name: 'The Crownlands', zones: ['West'] });
    s.calculators = { Percent: function(args) { return 'Percent: ' + args.percent } };
  });

  it('initially allows no methods', function() {
    var expected = I({
      'All': { name: 'All', packing_type: undefined, zones: ['West'], calculator: 'Percent: 25' }
    });

    s.onLoadDeliveryMethods({ methods: input });
    assert.deepEqual(s.trigger.args[0][0], { methods: expected });
  });

  it('with packings updated, it allows only methods with the right packing_type', function() {
    var expected = I({
      'P48': { name: 'P48', packing_type: 'P', zones: ['West'], calculator: 'Percent: 25' },
      'All': { name: 'All', packing_type: undefined, zones: ['West'], calculator: 'Percent: 25' }
    });

    s.packings = I(['P']);
    s.update();
    assert.deepEqual(s.trigger.args[1][0], { methods: expected });
  });
});
