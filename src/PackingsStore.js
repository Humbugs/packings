// Includes
var Reflux = require('reflux');
var I = require('seamless-immutable');
var JSE = require('jekyll-store-engine');
var listenAndMix = JSE.Mixins.listenAndMix;

var PackingsStore = Reflux.createStore({
  // Public
  listenables: [JSE.Actions],
  mixins: [listenAndMix(JSE.Stores.Basket)],
  getInitialState: function() { return { packings: I([]) }; },
  onSetPackHook: function(args) { t.hook = args.hook; },
  onPack: function() {
    t.request
      .post(t.hook)
      .send({ basket: t.minimalBasket() })
      .end(function(error, response) {
        t.trigger({ packings: error ? I([]) : I(response.body) });
      });
  },

  // Private
  minimalBasket: function() {
    var minBask = {};
    for(var name in t.basket) { minBask[name] = t.basket[name].quantity; }
    return minBask;
  }
});

PackingsStore.request = require('superagent');

var t = module.exports = PackingsStore;
