# poller
> Lightweight angular service to fetch updates from a server via the polling technique

## Dependancies
You will only need angular installed, so make sure to run
```bash
npm install --save angular
```

## Installation
Just ``git clone`` this repository and include the ``poller.js`` file in your project.

## How to use it

There are a couple of steps involved to have poller up and running, both on your frontend and your backend.<br>
First, declare on your frontend the resources you will be watching for updates:
```javascript
poller.listeners({
  'rowsUpdate': { url: `http://localhost:8001/row`, frequency: 1000 }
});
```
Then start listening for changes:
```javascript
poller.listen('rowsUpdate', (data) => {
  console.log(data);
});
```
I'd suggest adding it inside the ``.run()`` method of your main module, but it's not a requirement, I just like to separate the configuration from the actual logic. What is required is that it is called before the ``.listen()`` function.
The ``.listeners()`` function gets passed an object that holds the settings for every url to monitor. The keys of this object are identifiers which will be required by the ``.listen()`` function in order to identify the resource to watch. The frequency is how often you want to ask the server for changes, in millisecond. Defaults to ``2000``.
<br><br>
On your backend you will need to implement the ``formatForPoller()`` function as below
```javascript
const formatForPoller = (hasNew, def, success) => {
  const ret = {
    state: 'old',
    data: def
  }

  if( hasNew ){
    ret.state = 'new';
    ret.data = success;
  }

  return ret;
}
```
This function needs to be called on the result you want to send the client, when changes are found. 
The implementation may vary slightly depending upon the language the backend is built on.<br>
The ``hasNew`` parameter indicates whether or not there are new results,
``def`` is the default result to send the client in case no updates are found,
``success`` is the new result found.<br>
**Don't forget to call this function before sending results to the client, as this is the only format supported by the poller service.**<br>
This is basically it, you will only need to determine if new results are found on every call, since "new result" it's a pretty generic concept, and you are the only one who can extablish what it means in your particular scenario.<br>
*You can find an example implementation in node.js, under the /example directory*<br>

The service provides also a ``.detach()`` function to, yeah, you guessed it, detach a listener, passing in the event name, like so:
```javascript
poller.detach('rowsUpdate');
```

### Contact me
If you find bugs feel free to open an issue and/or send a pull request. <br>
If you feel something is not clear, or the documentation needs to be updated send me a DM on [Twitter][#masterdave-twitter] or on [Facebook][#masterdave-fb]

[#masterdave-twitter]:  https://twitter.com/masterdaveh
[#masterdave-fb]:       https://www.facebook.com/davide.vico.5