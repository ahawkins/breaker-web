App.Fuse.FIXTURES = [
  {
    id: '1',
    name: 'Search',
    state: 'closed',
    timeout: 20,
    failureCount: 1,
    failureThreshold: 6
  },
  {
    id: '2',
    name: 'Stats',
    state: 'half_open',
    timeout: 15,
    failureCount: 2,
    failureThreshold: 5
  },
  {
    id: '3',
    name: 'Ads',
    state: 'open',
    timeout: 3,
    failureCount: 10,
    failureThreshold: 10,
    lastError: "Redis dead"
  }
];

App.ApplicationAdapter = DS.FixtureAdapter.extend({
  latency: 200
});
