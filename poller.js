const srvc = angular.module('pollerSrvc', []);

srvc.factory('ajax', function ($http) {
  const call = (url, data, succCB, errCB, method = 'post') => {
    const headers = { 'Content-Type': 'application/x-www-form-urlencoded' };
    return $http({ method, headers, url, data }).then(succCB, errCB);
  }

  return {
    call
  }
});

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
        ajax.call( event.url, params, 
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
      console.error('Poller cannot detach a listener for an unknown event');
    }
  }

  return {
    listeners, listen, detach
  }
});