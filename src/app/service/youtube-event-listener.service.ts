import { Injectable } from '@angular/core';
import { youtubePlayHistory } from '../youtube/youtube.page';

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
    this.addYoutubeEventListener2(document.getElementById("youtube-iframe"), function(e) { // e.info - 0 : end, 1 : play, 2 : pause
      let repeatStatus = (<HTMLInputElement>document.querySelector('#repeatStatusInput')).value; // 0 : no repeat, 1 : repeat, 2 : shuffle, 3 : repeat only one
      
      if(e.info == 2) { // pause
        (<HTMLInputElement>document.getElementById('stopFlag')).value = 'T';
        document.getElementById('stopFlag').dispatchEvent(new Event('input'));
      } else if(e.info == 1) { // play
        (<HTMLInputElement>document.getElementById('stopFlag')).value = 'F';
        document.getElementById('stopFlag').dispatchEvent(new Event('input'));
      } else if(repeatStatus == "1" && e.info == 0) { // repeat
        let activePlayer = document.querySelector('ion-card.active');
        if(activePlayer) {
          let nextPlayer = activePlayer.nextSibling as HTMLElement;
          if(nextPlayer.classList.contains('youtube-content')) {
            nextPlayer.click();
            youtubePlayHistory.push(nextPlayer.dataset.videoid);
          }
          else {
            let nextPlayer = <HTMLElement>document.querySelector('.youtube-content');
            nextPlayer.click();
            youtubePlayHistory.push(nextPlayer.dataset.videoid);
          }
        } else {
          let nextPlayer = <HTMLElement>document.querySelector('.youtube-content');
          nextPlayer.click();
          youtubePlayHistory.push(nextPlayer.dataset.videoid);
        }
      } else if(repeatStatus == "2" && e.info == 0) { // shuffle
        let randomNumber = Math.floor(Math.random() * document.getElementsByClassName('youtube-content').length);
        let nextPlayer = <HTMLElement>document.getElementsByClassName('youtube-content')[randomNumber];
        nextPlayer.click();
        youtubePlayHistory.push(nextPlayer.dataset.videoid);
      } else if(repeatStatus == "3" && e.info == 0) { // repeat only one
        let nextPlayer = <HTMLElement>document.querySelector('ion-card.active');
        nextPlayer.click();
        youtubePlayHistory.push(nextPlayer.dataset.videoid);
      }
    });
  }

  removeYoutubeEventListener() {
    this.removeYoutubeEventListener2(document.getElementById('youtube-iframe'), function(){});
  }

}
