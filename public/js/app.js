/* global OT, apiKey, sessionId, token */

const session = OT.initSession(apiKey, sessionId);
const publisher = OT.initPublisher('publisher');
let connectionId;

const dialOutBtn = document.querySelector('#dial-out');
const hangUpBtn = document.querySelector('#hang-up');

session.on({
  streamCreated: (event) => {
    const subscriberClassName = `subscriber-${event.stream.streamId}`;
    const subscriber = document.createElement('div');
    subscriber.setAttribute('id', subscriberClassName);
    document.getElementById('subscribers').appendChild(subscriber);
    session.subscribe(event.stream, subscriberClassName);
  },
  streamDestroyed: (event) => {
    console.log(`Stream ${event.stream.name} ended because ${event.reason}.`);
  },
  sessionConnected: (event) => {
    console.log('session connected', event);
    session.publish(publisher);
  },
});

session.connect(token, (error) => {
  if (error) {
    console.log('error connecting to session');
  }
});

const dialOut = () => {
  // fetch(`/dial-out?roomId=${roomId}`)
  fetch(`/dial-out`)
    .then((response) => response.json())
    .then((sipData) => {
      connectionId = sipData.connectionId;
    })
    .catch((error) => {
      alert(`There was an error dialing-out`);
    });
};
const hangUp = () => {
  // fetch(`/hang-up?roomId=${roomId}`)
  fetch(`/hang-up`)
    .then((response) => response)
    .then((data) => {
      console.log('dial-out-hang-up-complete');
    })
    .catch((error) => {
      alert(`There was an error hanging up`);
    });
};

dialOutBtn.addEventListener('click', dialOut);
hangUpBtn.addEventListener('click', hangUp);
