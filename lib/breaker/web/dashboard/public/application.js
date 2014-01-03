Ember.RSVP.configure('onerror', function(error) {
  // ensure unhandled promises raise awareness.
  // may result in false negatives, but visibility is more important
  if (error instanceof Error) {
    Ember.Logger.assert(false, error);
    Ember.Logger.error(error.stack);
  }
});

window.App = Ember.Application.create({
  LOG_ACTIVE_GENERATION: true,
  LOG_MODULE_RESOLVER: true,
  LOG_TRANSITIONS: true,
  LOG_TRANSITIONS_INTERNAL: true,
  LOG_VIEW_LOOKUPS: true
});

App.Router.map(function() {
  this.resource('fuses');
});

App.IndexRoute = Ember.Route.extend({
  redirect: function() {
    this.transitionTo('fuses');
  }
});

App.FusesRoute = Ember.Route.extend({
  actions: {
    toggleRefresh: function() {
      var controller = this.controllerFor('fuses');

      if(controller.get('refreshEnabled')) {
        this.send('enableRefresh');
      } else {
        this.send('disableRefresh');
      }
    },

    enableRefresh: function() {
      var controller = this.controllerFor('fuses');

      var store = this.get('store');

      controller.set('interval', setInterval(function() {
        Ember.Logger.debug('Updating...');
        store.find('fuse');
      }, 1000));
    },

    disableRefresh: function() {
      var controller = this.controllerFor('fuses');
      clearInterval(controller.get('interval'));
    }
  },

  afterModel: function(resolvedModel, transition, queryParams) {
    var route = this;

    transition.then(function() {
      route.controllerFor('fuses').set('refreshEnabled', true);
    });

    this._super.apply(this, arguments);
  },

  model: function() {
    var store = this.get('store');

    return store.find('fuse').then(function() {
      return store.all('fuse');
    });
  }
});

App.Fuse = DS.Model.extend({
  name: DS.attr('string'),
  state: DS.attr('string'),

  timeout: DS.attr('number'),
  failureCount: DS.attr('number'),
  failureThreshold: DS.attr('number'),

  lastError: DS.attr('string'),

  isClosed: (function() {
    return this.get('state') == 'closed';
  }).property('state'),

  isOpen: (function() {
    return this.get('state') == 'open';
  }).property('state'),

  isHalfOpen: (function() {
    return this.get('state') == 'half_open';
  }).property('state')
});

App.RefreshSwitchComponent = Ember.Component.extend({
  switchId: Ember.computed('elementId', function() {
    return "switch-" + this.get('elementId');
  })
});

App.ApplicationController = Ember.Controller.extend({
  needs: 'fuses',

  isUpdating: Ember.computed.alias('controllers.fuses.content.isupdating'),
  refreshEnabled: Ember.computed.alias('controllers.fuses.refreshEnabled')
});

App.FusesController = Ember.ArrayController.extend({
  refreshSwitchDidChange: Ember.observer('refreshEnabled', function() {
    this.send('toggleRefresh');
  })
});

App.FuseItemController = Ember.ObjectController.extend({
  statusColor: (function() {
    switch(this.get('state')) {
      case 'open':
        return 'label-danger';
      case 'half_open':
        return 'label-warning';
      case 'closed':
        return 'label-success';
    }
  }).property('state'),

  statusLabel: (function() {
    switch(this.get('state')) {
      case 'open':
        return 'Open';
      case 'half_open':
        return 'Tripped';
      case 'closed':
        return 'Operational';
    }
  }).property('state')
});
