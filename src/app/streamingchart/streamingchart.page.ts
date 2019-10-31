import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IonContent, IonInfiniteScroll, ModalController } from '@ionic/angular';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { GoogleAnalytics } from '@ionic-native/google-analytics/ngx';

import { Youtube } from '../vo/youtube';
import { MyToastService } from '../service/my-toast.service';
import { MenuToolBarService } from '../service/menu-toolbar.service';
import { SqlStorageService } from '../service/sql-storage.service';
import { MENUS } from '../vo/menus';
import { INSERT_FAVORITE_YOUTUBE, DELETE_FAVORITE_YOUTUBE } from '../vo/query';
import { AdmobfreeService } from '../service/admobfree.service';
import { YoutubeEventListenerService } from '../service/youtube-event-listener.service';
import { youtubePlayHistory } from '../youtube/youtube.page';

@Component({
  selector: 'app-streamingchart',
  templateUrl: './streamingchart.page.html',
  styleUrls: ['./streamingchart.page.scss'],
})
export class StreamingchartPage implements OnInit {
  @ViewChild(IonContent, {static: false}) ionContent: IonContent;
  @ViewChild(IonInfiniteScroll, {static: false}) infiniteScroll: IonInfiniteScroll;
  youtubeList: Youtube[] = [];
  activeVideoId: string;

  year: string;
  month: string;
  dates: string[] = [];
  youtubeCount = 0;
  offset = 0;
  limit = 20;

  selectQuery: string;

  stopFlag = false;
  repeatStatus = 0; // 0 : no repeat, 1 : repeat, 2 : shuffle, 3 : repeat only one

  constructor(
    private activatedRoute: ActivatedRoute,
    private myToastService: MyToastService,
    private statusBar: StatusBar,
    private modalCtrl: ModalController,
    private menuToolbarService: MenuToolBarService,
    private sqlStorageService: SqlStorageService,
    private ga: GoogleAnalytics,
    private admobFreeService: AdmobfreeService,
    private youtubeEventListener: YoutubeEventListenerService
  ) {
    activatedRoute.params.subscribe(() => {
      statusBar.backgroundColorByHexString('#d40000');
      menuToolbarService.changeClass(MENUS.YOUTUBE);
    });
  }

  async ngOnInit() {
    this.admobFreeService.removeBannerAd();

    this.ga.trackView('StreamingchartPage');

    await this.setDates();
    this.setYoutube_SL();

    setTimeout(() => {
      if(document.querySelector('ion-select').shadowRoot.querySelector('.select-text').innerHTML == '') {
        let date = this.year;
        if(this.month) date += '. ' + this.month;
        document.querySelector('ion-select').shadowRoot.querySelector('.select-text').innerHTML = date;
      }
    }, 500);
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

  setYoutube_SL() {
    this.youtubeList = [];
    this.offset = 0;

    let countQuery = `SELECT COUNT(streaming_chart.videoId) FROM youtube, streaming_chart WHERE youtube.videoId = streaming_chart.videoId AND youtube.starName = 'streamingchart' AND streaming_chart.year = ${this.year}`;
    this.selectQuery = `SELECT youtube.*, (SELECT COUNT(*) FROM favorite_youtube WHERE videoId = youtube.videoId) AS favoriteFlag FROM youtube, streaming_chart WHERE youtube.videoId = streaming_chart.videoId AND youtube.starName = 'streamingchart' AND streaming_chart.year = ${this.year}`;
    if(this.month) {
      countQuery += ` AND streaming_chart.month = ${this.month}`;
      this.selectQuery += ` AND streaming_chart.month = ${this.month}`;
    }
    this.selectQuery += ` GROUP BY youtube.videoId ORDER BY streaming_chart.rank ASC`;

    this.setYoutubeCount(countQuery);
    this.pushYoutube(this.selectQuery + ` LIMIT ${this.offset}, ${this.limit}`);
  }

  async setDates() {
    let data = await this.sqlStorageService.query(`SELECT year, month FROM streaming_chart GROUP BY year, month ORDER BY year DESC, month DESC`);
    for(let i = 0; i < data.res.rows.length; i++) {
      let year = data.res.rows.item(i).year;
      let month = data.res.rows.item(i).month;
      if(i == 0) {
        this.year = year;
        this.month = month;
      }
      let date = year;
      if(month != null) date += '. ' + month;
      this.dates.push(date);
    }
  }

  async setYoutubeCount(query: string) {
    let data = await this.sqlStorageService.query(query);
    this.youtubeCount = data.res.rows.item(0).youtubeCount;
  }

  pushYoutube(query: string) {
    this.sqlStorageService.query(query).then(data => {
      let dataLength = data.res.rows.length;
      for(let i = 0; i < dataLength; i++) {
        let youtube = data.res.rows.item(i);
        this.youtubeList.push({videoId: youtube.videoId, title: youtube.title, thumbnailUrl: youtube.thumbnailUrl, time: youtube.time, favoriteFlag: youtube.favoriteFlag});
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

  addFavorite(videoId: string, event: Event) {
    event.stopPropagation();
    this.myToastService.showToast('Added to favorites');

    for(let i = 0; i < this.youtubeList.length; i++) {
      if(this.youtubeList[i].videoId == videoId) this.youtubeList[i].favoriteFlag = true;
    }

    this.sqlStorageService.query(INSERT_FAVORITE_YOUTUBE, [videoId]);
  }

  removeFavorite(videoId: string, event: Event) {
    event.stopPropagation();
    this.myToastService.showToast('Removed from your favorites');

    for(let i = 0; i < this.youtubeList.length; i++) {
      if(this.youtubeList[i].videoId == videoId) this.youtubeList[i].favoriteFlag = false;
    }

    this.sqlStorageService.query(DELETE_FAVORITE_YOUTUBE, [videoId]);
  }

  loadData(event) {
    setTimeout(() => {
      this.offset += this.limit;
      this.pushYoutube(this.selectQuery + ` LIMIT ${this.offset}, ${this.limit}`);
      if(this.offset + this.limit >= this.youtubeCount) {
        event.target.disabled = true;
      }
      event.target.complete();
    }, 500);
  }

  changeDate(event) {
    let date = event.detail.value.split('. ');

    this.year = date[0];
    (date.length > 1) ? this.month = date[1] : this.month = null;

    date = this.year;
    if(this.month) date += '. ' + this.month;

    document.querySelector('ion-select').shadowRoot.querySelector('.select-text').innerHTML = date;

    this.setYoutube_SL();
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
        } else {
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
