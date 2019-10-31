import { Component, ViewChild, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IonContent, IonInfiniteScroll } from '@ionic/angular';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { GoogleAnalytics } from '@ionic-native/google-analytics/ngx';

import { SqlStorageService } from 'src/app/service/sql-storage.service';
import { SELECT_FAVORITE_YOUTUBE, SELECT_FAVORITE_YOUTUBE_STAR_NAME, DELETE_FAVORITE_YOUTUBE, SELECT_FAVORITE_YOUTUBE_COUNT } from 'src/app/vo/query';
import { Youtube } from 'src/app/vo/youtube';
import { MyToastService } from 'src/app/service/my-toast.service';
import { MenuToolBarService } from 'src/app/service/menu-toolbar.service';
import { MENUS } from 'src/app/vo/menus';
import { AdmobfreeService } from 'src/app/service/admobfree.service';
import { YoutubeEventListenerService } from 'src/app/service/youtube-event-listener.service';
import { youtubePlayHistory } from 'src/app/youtube/youtube.page';

@Component({
  selector: 'app-youtube',
  templateUrl: './youtube.page.html',
  styleUrls: ['./youtube.page.scss'],
})
export class YoutubePage implements OnInit {
  @ViewChild(IonContent, {static: false}) ionContent: IonContent;
  @ViewChild(IonInfiniteScroll, {static: false}) infiniteScroll: IonInfiniteScroll;
  youtubeList: Youtube[] = [];
  activeVideoId: string;
  starNameList: string[] = [];
  terms = "";
  youtubeCount = 0;
  offset = 0;
  limit = 20;
  noFavoriteContents = false;

  selectQuery: string;
  countQuery: string;

  stopFlag = false;
  repeatStatus = 0; // 0 : no repeat, 1 : repeat, 2 : shuffle, 3 : repeat only one

  constructor(
    private sqlStorageService: SqlStorageService,
    private myToastService: MyToastService,
    private activatedRoute: ActivatedRoute,
    private statusBar: StatusBar,
    private menuToolbarService: MenuToolBarService,
    private ga: GoogleAnalytics,
    private admobFreeService: AdmobfreeService,
    private youtubeEventListener: YoutubeEventListenerService
  ) {
    this.ga.trackView('FavoriteYoutubePage');

    activatedRoute.params.subscribe(() => {
      statusBar.backgroundColorByHexString('#7d19ff');
      menuToolbarService.changeClass(MENUS.FAVORITE);

      this.setYoutube_SL();
    });
  }

  ngOnInit() {
    this.admobFreeService.removeBannerAd();
  }

  ionViewDidEnter() {
    let count = 0;
    let interval = setInterval(() => {
      this.youtubeEventListener.addYoutubeEventListener();
      if(count++ >= 3) {
        clearInterval(interval);
      }
    }, 300);
  }

  ionViewWillLeave() {
    this.youtubeEventListener.removeYoutubeEventListener();

    let youtubeIframe = document.getElementById('youtube-iframe') as HTMLIFrameElement;
    youtubeIframe.contentWindow.postMessage('{"event":"command","func":"stopVideo","args":""}', '*');
  }

  async setYoutube_SL() {
    this.selectQuery = SELECT_FAVORITE_YOUTUBE;
    this.countQuery = SELECT_FAVORITE_YOUTUBE_COUNT;

    this.sqlStorageService.query(SELECT_FAVORITE_YOUTUBE_STAR_NAME).then(data => {
      let dataLength = data.res.rows.length;
      for(let i = 0; i < dataLength; i++) {
        this.starNameList.push(data.res.rows.item(i).starName);
      }
    });

    await this.setYoutubeCount();
    if(this.youtubeCount == 0) this.noFavoriteContents = true;
    this.pushYoutube();
  }

  async setYoutubeCount() {
    let data = await this.sqlStorageService.query(this.countQuery);
    this.youtubeCount = data.res.rows.item(0).youtubeCount;
  }

  pushYoutube() {
    this.sqlStorageService.query(this.selectQuery, [this.offset, this.limit]).then(data => {
      let dataLength = data.res.rows.length;

      for(let i = 0; i < dataLength; i++) {
        let youtube = data.res.rows.item(i);
        this.youtubeList.push({videoId: youtube.videoId, title: youtube.title, thumbnailUrl: youtube.thumbnailUrl, time: youtube.time, starName: youtube.starName});
      }
    });
  }

  playYoutubeByClick(videoId: string) {
    youtubePlayHistory.push(videoId);
    this.playYoutube(videoId);
  }

  playYoutube(videoId: string) {
    document.getElementById('youtube-iframe').setAttribute('src', `https://www.youtube.com/embed/${videoId}?enablejsapi=1&version=3&playerapiid=ytplayer`);

    this.activeVideoId = videoId;
    document.getElementById('youtube-div').style.display = '';
    document.getElementById('youtube-player-option').style.display = '';

    let count = 0;
    let interval = setInterval(() => {
      let youtubeIframe = document.getElementById('youtube-iframe') as HTMLIFrameElement;
      youtubeIframe.contentWindow.postMessage('{"event":"command","func":"playVideo","args":""}', '*');
      if(count++ >= 3) {
        clearInterval(interval);
      }
    }, 300);
  }

  scrollToTop() {
    this.ionContent.scrollToTop(0);
  }

  logScrolling() {
    let d = document.querySelector('#youtube-content #scrollTopBtn') as HTMLElement;
    if (document.querySelector('#youtube-content').shadowRoot.querySelector('.inner-scroll').scrollTop >= 200) {
      d.style.display = "block";
    } else if (document.querySelector('#youtube-content').shadowRoot.querySelector('.inner-scroll').scrollTop < 200) {
      d.style.display = "none";
    }
  }

  removeFavorite(videoId: string, event: Event) {
    event.stopPropagation();
    this.myToastService.showToast('Removed from your favorites');

    document.querySelector('[data-id="' + videoId + '"]').remove();

    for(let i = 0; i < this.youtubeList.length; i++) {
      if(this.youtubeList[i].videoId == videoId) {
        this.youtubeList.splice(i, 1);
      }
    }

    this.sqlStorageService.query(DELETE_FAVORITE_YOUTUBE, [videoId]);
  }

  youtubeSorting(name: string, index?: number) {
    if(name == 'ALL') {
      document.querySelector('.button-contents .all').classList.add('selected');
      let d = document.querySelectorAll('.button-contents .starName');
      for (let i = 0; i < d.length; i++) {
        d[i].classList.remove('selected');
      }
    } else {
      document.querySelector('.button-contents .all').classList.remove('selected');
      document.querySelector('.button-contents .index' + index).classList.toggle('selected');

      if(!document.querySelector('.button-contents ion-button.selected')) {
        document.querySelector('.button-contents .all').classList.add('selected');
      }
    }

    this.infiniteScroll.disabled = false;
    this.youtubeList = [];
    this.offset = 0;
    this.terms = '';

    let d = document.querySelectorAll('.button-contents ion-button.selected');
    for (let i = 0; i < d.length; i++) {
      if(d[i].innerHTML == 'ALL') {
        break;
      }
      if(i > 0) this.terms += ", ";
      this.terms += "'" + d[i].innerHTML + "'";
    }

    if(this.terms == '') { // ALL
      this.selectQuery = SELECT_FAVORITE_YOUTUBE;
      this.countQuery = SELECT_FAVORITE_YOUTUBE_COUNT;
    } else {
      this.selectQuery = `SELECT youtube.* FROM youtube INNER JOIN favorite_youtube ON youtube.videoId = favorite_youtube.videoId WHERE youtube.starName IN (${this.terms}) GROUP BY youtube.videoId ORDER BY youtube.views DESC LIMIT ?, ?`;
      this.countQuery = `SELECT COUNT(DISTINCT(youtube.videoId)) AS youtubeCount FROM youtube INNER JOIN favorite_youtube ON youtube.videoId = favorite_youtube.videoId WHERE youtube.starName IN (${this.terms})`;
    }

    this.setYoutubeCount();
    this.pushYoutube();
  }

  loadData(event) {
    setTimeout(() => {
      this.offset += this.limit;
      this.pushYoutube();
      if(this.offset + this.limit >= this.youtubeCount) {
        event.target.disabled = true;
      }
      event.target.complete();
    }, 500);
  }

  closeYoutubePlayer() {
    let youtubeIframe = document.getElementById('youtube-iframe') as HTMLIFrameElement;
    youtubeIframe.contentWindow.postMessage('{"event":"command","func":"stopVideo","args":""}', '*');

    document.getElementById('youtube-div').style.display = 'none';
    document.getElementById('youtube-player-option').style.display = 'none';

    this.activeVideoId = '';
  }

  pauseYoutubePlay() {
    this.stopFlag = true;

    let youtubeIframe = document.getElementById('youtube-iframe') as HTMLIFrameElement;
    youtubeIframe.contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
  }

  playYoutubePlay() {
    this.stopFlag = false;

    let youtubeIframe = document.getElementById('youtube-iframe') as HTMLIFrameElement;
    youtubeIframe.contentWindow.postMessage('{"event":"command","func":"playVideo","args":""}', '*');
  }

  skipForwardYoutubePlay() {
    if(this.repeatStatus == 0 || this.repeatStatus == 1) { // repeat
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
    } else if(this.repeatStatus == 2) { // shuffle
      let randomNumber = Math.floor(Math.random() * document.getElementsByClassName('youtube-content').length);
      let nextPlayer = <HTMLElement>document.getElementsByClassName('youtube-content')[randomNumber];
      nextPlayer.click();
      youtubePlayHistory.push(nextPlayer.dataset.videoid);
    } else if(this.repeatStatus == 3) { // repeat only one
      let nextPlayer = <HTMLElement>document.querySelector('ion-card.active');
      nextPlayer.click();
      youtubePlayHistory.push(nextPlayer.dataset.videoid);
    }
  }

  skipBackwardYoutubePlay() {
    let preVideoId = this.getPreVideoId();
    this.playYoutube(preVideoId);
  }

  getPreVideoId() {
    let currVideoId = (<HTMLElement>document.querySelector('ion-card.active')).dataset.videoid;
    let videoId = youtubePlayHistory.pop();

    if(!videoId) return (<HTMLElement>document.querySelector('ion-card.active')).dataset.videoid;

    if(currVideoId == videoId) return this.getPreVideoId();

    return videoId;
  }

  changeRepeatStatus() {
    this.repeatStatus = (this.repeatStatus + 1) % 4;
  }

}
