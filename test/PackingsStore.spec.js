var assert = require('chai').assert;
var sinon = require('sinon');
var I = require('seamless-immutable');
var s = require('../src/PackingsStore');

describe('PackingsStore', function() {
  var post = sinon.stub().returnsThis();
  var send = sinon.stub().returnsThis();
  var success = { body: ['Large Letter', 'Parcel'] };
  var end = sinon.stub().callsArgWith(0, null, success);

  before(function() {
    s.trigger = sinon.spy();
    s.request = { post: post, send: send, end: end };
    s.basket = I({ 'bag': { name: 'bag', quantity: 1, price: 5.30, weight: 1500 } });
  });

  it('passes on succeses', function() {
    s.onSetPackHook({ hook: 'https://server.io/pack' });
    s.onPack();
    assert(post.calledWith('https://server.io/pack'));
    assert(send.calledWith({ basket: { 'bag': 1 } }));
    assert(s.trigger.calledWith({ packings: I(['Large Letter', 'Parcel']) }));
  });

  it('passed on empty list for failures', function() {
    end.callsArgWith(0, 'FAIL');
    s.onPack();
    assert.deepEqual(s.trigger.args[1][0], { packings: I([]) });
  });
});
