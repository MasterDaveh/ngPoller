const srvc = angular.module('ngPoller', []);

srvc.factory('ngPoller', function($interval, $http){
  let _events = {};
  
  // events supported
  const listeners = (entries) => {
    Object.keys(entries).forEach(evName => {
      _events[evName] = angular.copy(entries[evName]);
      _events[evName].initialized = false;
    });
  }

  // decide whether to notify the client or not
  // (only if updates are present)
  const notifyClient = (cb, srvRes, ev) => {
    const hasUpdates = srvRes.state === 'new';
    _events[ev].initialized = true;
    if( hasUpdates ){
      cb( srvRes.data );
    }
  }

  // actual calls to the server
  const listen = (ev, fn, params = {}) => {
    if( Object.keys(_events).includes(ev) ){
      const event = _events[ev];
      const freq = event.frequency || 2000;
      params.frequency = freq;
      _events[ev].promise = $interval(() => {
        const headers = { 'Content-Type': 'application/x-www-form-urlencoded' };
        const config = {
          method: 'post',
          url: event.url,
          headers
        };

        params.newOnly = event.initialized;
        config.data = params;

        $http(config).then(
          (res) => notifyClient(fn, res.data, ev), 
          (err) => console.error(`poller: ${ ev } caused an exception -> `, err)
        );
      }, freq);
      
    } else {
      console.error(`poller: event ${ ev } is not supported. Events available are ${ Object.keys(events).join(', ') }.`);
    }
  }

  // detach event's listener
  const detach = (ev) => {
    if( Object.keys(_events).includes(ev) ){
      $interval.cancel( _events[ev].promise );
      _events[ev].promise = null;
    } else {
      console.error(`poller: cannot detach a listener for unknown ${ ev } event`);
    }
  }

  return {
    listeners, listen, detach
  }
});