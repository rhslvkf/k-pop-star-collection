import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class YoutubeEventListenerService {

  addYoutubeEventListener2 = (function () {
    var callbacks = [];
    var iframeId = 0;

    return function (iframe, callback) {
      // init message listener that will receive messages from youtube iframes
      if (iframeId === 0) {
        window.addEventListener("message", function (e) {
          if (e.origin !== "https://www.youtube.com" || e.data === undefined) return;
          try {
            var data = JSON.parse(e.data);
            if (data.event !== 'onStateChange') return;

            var callback = callbacks[data.id];
            callback(data);
          }
          catch (e) { }
        });
      }

      // store callback
      iframeId++;
      callbacks[iframeId] = callback;
      var currentFrameId = iframeId;

      // sendMessage to frame to start receiving messages
      iframe.addEventListener("load", function () {
        var message = JSON.stringify({
          event: 'listening',
          id: currentFrameId,
          channel: 'widget'
        });
        iframe.contentWindow.postMessage(message, 'https://www.youtube.com');

        message = JSON.stringify({
          event: "command",
          func: "addEventListener",
          args: ["onStateChange"],
          id: currentFrameId,
          channel: "widget"
        });
        iframe.contentWindow.postMessage(message, 'https://www.youtube.com');
      });
    }
  })();

  removeYoutubeEventListener2 = (function () {
    var callbacks = [];
    var iframeId = 0;

    return function (iframe, callback) {
      // init message listener that will receive messages from youtube iframes
      if (iframeId === 0) {
        window.removeEventListener("message", function (e) {
          if (e.origin !== "https://www.youtube.com" || e.data === undefined) return;
          try {
            var data = JSON.parse(e.data);
            if (data.event !== 'onStateChange') return;

            var callback = callbacks[data.id];
            callback(data);
          }
          catch (e) { }
        });
      }

      // store callback
      iframeId++;
      callbacks[iframeId] = callback;
      var currentFrameId = iframeId;

      // sendMessage to frame to start receiving messages
      iframe.removeEventListener("load", function () {
        var message = JSON.stringify({
          event: 'listening',
          id: currentFrameId,
          channel: 'widget'
        });
        iframe.contentWindow.postMessage(message, 'https://www.youtube.com');

        message = JSON.stringify({
          event: "command",
          func: "addEventListener",
          args: ["onStateChange"],
          id: currentFrameId,
          channel: "widget"
        });
        iframe.contentWindow.postMessage(message, 'https://www.youtube.com');
      });
    }
  })();

  constructor() { }

  addYoutubeEventListener() {
    this.addYoutubeEventListener2(document.getElementById("youtube-iframe"), function(e) {
      let repeatFlag = document.querySelector('.repeatYoutubePlay').classList.contains('on');
      let randomRepeatFlag = document.querySelector('.randomRepeatYoutubePlay').classList.contains('on');

      if(repeatFlag && e.info == 0) {
        let activePlayer = document.querySelector('ion-card.active');
        if(activePlayer) {
          let nextPlayer = activePlayer.nextSibling as HTMLElement;
          if(nextPlayer) nextPlayer.click();
          else (<HTMLElement>document.querySelector('.youtube-content')).click();
        } else {
          (<HTMLElement>document.querySelector('.youtube-content')).click();
        }
      } else if(randomRepeatFlag && e.info == 0) {
        let randomNumber = Math.floor(Math.random() * document.getElementsByClassName('youtube-content').length);
        (<HTMLElement>document.getElementsByClassName('youtube-content')[randomNumber]).click();
      }
    });
  }

  removeYoutubeEventListener() {
    this.removeYoutubeEventListener2(document.getElementById('youtube-iframe'), function(){});
  }

}
