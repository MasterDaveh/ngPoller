const srvc = angular.module('pollerSrvc', []);

srvc.factory('poller', function(ajax, $interval){
  let _events = null;
  
  // events supported
  const listeners = (entries) => {
    _events = entries;
  }

  // decide whether to notify the client or not
  // (only if updates are present)
  const notifyClient = (cb, srvRes) => {
    const hasUpdates = srvRes.state === 'new';
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
      params.newOnly = true;
      _events[ev].promise = $interval(() => {
        const headers = { 'Content-Type': 'application/x-www-form-urlencoded' };
        const params = {
          method: 'post',
          url: event.url,
          headers, data
        }
        $http(params).then(
          (res) => notifyClient(fn, res.data), 
          (err) => console.error(`poller: ${ ev } caused an exception -> `, err)
        );
      }, freq);
      
    } else {
      console.error(`poller: event ${ ev } is not supported. Events available are ${ events.join(',') }.`);
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