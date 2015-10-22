// Includes
var I = require('seamless-immutable');
var JSE = require('jekyll-store-engine');
var m = JSE.Utils.mapping;
var intersects = JSE.Utils.intersects;
var t = JSE.Stores.DeliveryMethods;

t.listenTo(
  require('./PackingsStore'),
  function(obj) { t.packings = obj.packings; t.update(); },
  function(obj) { t.packings = obj.packings; }
);

t.onLoadDeliveryMethods = function(args) {
  args.methods.forEach(function(method) {
    t.methods = t.methods.merge(m(method.name, {
      name: method.name,
      zones: method.zones,
      packing_type: method.packing_type,
      calculator: t.calculators[method.calculator](method.args)
    }));
  });

  t.update();
}
t.subscriptions[1].stop();
t.listenTo(JSE.Actions.loadDeliveryMethods, t.onLoadDeliveryMethods);

t.update = function() {
  var zones = t.country.zones || [];
  t.available = {};

  for(var name in t.methods) {
    if(!t.methods[name].packing_type || t.packings.indexOf(t.methods[name].packing_type) >= 0) {
      if(intersects(t.methods[name].zones, zones)) {
        t.available[name] = t.methods[name];
      }
    }
  }

  t.available = I(t.available);
  t.trigger({ methods: t.available });
}