import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IonContent, ModalController, IonInfiniteScroll } from '@ionic/angular';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { GoogleAnalytics } from '@ionic-native/google-analytics/ngx';

import { MyToastService } from '../service/my-toast.service';
import { ModalPage } from '../modal/modal.page';
import { MenuToolBarService } from '../service/menu-toolbar.service';
import { MENUS } from '../vo/menus';
import { SqlStorageService } from '../service/sql-storage.service';
import { INSERT_FAVORITE_YOUTUBE, DELETE_FAVORITE_YOUTUBE } from '../vo/query';
import { Youtube } from '../vo/youtube';
import { AdmobfreeService } from '../service/admobfree.service';
import { YoutubeEventListenerService } from '../service/youtube-event-listener.service';

export let youtubePlayHistory = [];

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
  starName = "";
  allSort = true;
  mvSort = false;
  fanCamSort = false;
  stageMixSort = false;
  dancePracticeSort = false;
  lyricsSort = false;

  youtubeCount = 0;
  offset = 0;
  limit = 20;

  selectQuery: string;
  countQuery: string;

  stopFlag = 'T'; // F : false, T : true
  repeatStatus = 0; // 0 : no repeat, 1 : repeat, 2 : shuffle, 3 : repeat only one

  sortType: string = 'R'; // R : Recently Popular, M : Most Viewed

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
  
  goSelf(starName: string) {
    this.starName = starName;
    this.youtubeList = [];

    this.allSort = true;
    this.mvSort = false;
    this.fanCamSort = false;
    this.stageMixSort = false;
    this.dancePracticeSort = false;
    this.lyricsSort = false;

    this.ngOnInit();
  }

  ngOnInit() {
    this.admobFreeService.removeBannerAd();

    this.ga.trackView('YoutubePage');

    if(this.starName == '') this.starName = this.activatedRoute.snapshot.paramMap.get('starName');

    let countQuery = '';
    let selectQuery = '';
    if(this.starName == 'fullList') {
      countQuery = `SELECT COUNT(*) AS youtubeCount FROM hot_youtube`;
      selectQuery = `
        SELECT
          youtube.*, (SELECT COUNT(*) FROM favorite_youtube WHERE videoId = hot_youtube.videoId) AS favoriteFlag
        FROM
          hot_youtube
        INNER JOIN
          youtube
        ON
          hot_youtube.videoId = youtube.videoId AND hot_youtube.starName = youtube.starName
        GROUP BY hot_youtube.videoId
        ORDER BY youtube.views DESC
      `;
    } else {
      countQuery = `SELECT COUNT(*) AS youtubeCount FROM hot_youtube WHERE starName = '${this.starName}'`;
      selectQuery = `
        SELECT
          youtube.*, (SELECT COUNT(*) FROM favorite_youtube WHERE videoId = hot_youtube.videoId) AS favoriteFlag
        FROM
          hot_youtube
        INNER JOIN
          youtube
        ON
          hot_youtube.videoId = youtube.videoId AND hot_youtube.starName = youtube.starName
        WHERE
          hot_youtube.starName = '${this.starName}'
        ORDER BY hot_youtube.rank ASC
      `;
    }

    this.setYoutube_SL(countQuery, selectQuery);
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

  pushYoutube(query: string) {
    this.sqlStorageService.query(query).then(data => {
      let dataLength = data.res.rows.length;
      for(let i = 0; i < dataLength; i++) {
        let youtube = data.res.rows.item(i);
        this.youtubeList.push({videoId: youtube.videoId, title: youtube.title, thumbnailUrl: youtube.thumbnailUrl, time: youtube.time, favoriteFlag: youtube.favoriteFlag});
      }
    });
  }

  async setYoutubeCount(query: string) {
    let data = await this.sqlStorageService.query(query);
    this.youtubeCount = data.res.rows.item(0).youtubeCount;
  }

  setYoutube_SL(countQuery: string, selectQuery: string) {
    this.youtubeList = [];
    this.offset = 0;
    
    this.setYoutubeCount(countQuery);
    this.pushYoutube(selectQuery + ` LIMIT ${this.offset}, ${this.limit}`);

    this.countQuery = countQuery;
    this.selectQuery = selectQuery;
  }

  playYoutubeByClick(videoId: string) {
    youtubePlayHistory.push(videoId);
    this.playYoutube(videoId);
  }

  playYoutube(videoId: string) {
    document.getElementById('youtube-iframe').setAttribute('src', `https://www.youtube.com/embed/${videoId}?enablejsapi=1&version=3&playerapiid=ytplayer&fs=0&rel=0`);

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

  youtubeSorting(terms: string) {
    if(terms == 'ALL' && !this.allSort) {
      this.allSort = true;
      this.mvSort = this.fanCamSort = this.stageMixSort = this.dancePracticeSort = false;
    } else if(terms == 'MV') {
      this.mvSort = !this.mvSort;
      if(this.allSort) this.allSort = false;
    } else if(terms == 'FanCam') {
      this.fanCamSort = !this.fanCamSort;
      if(this.allSort) this.allSort = false;
    } else if(terms == 'StageMix') {
      this.stageMixSort = !this.stageMixSort;
      if(this.allSort) this.allSort = false;
    } else if(terms == 'DancePractice') {
      this.dancePracticeSort = !this.dancePracticeSort;
      if(this.allSort) this.allSort = false;
    } else if(terms == 'Lyrics') {
      this.lyricsSort = !this.lyricsSort;
      if(this.allSort) this.allSort = false;
    }

    if(!(this.allSort || this.mvSort || this.fanCamSort || this.stageMixSort || this.dancePracticeSort || this.lyricsSort)) {
      this.allSort = true;
    }

    let words: string[] = [];

    if(this.mvSort) {
      words.push('MV');
      words.push('M/V');
    }
    if(this.fanCamSort) {
      words.push('fancam');
      words.push('fan cam');
      words.push('직캠');
    }
    if(this.stageMixSort) {
      words.push('stagemix');
      words.push('stage mix');
      words.push('교차편집');
      words.push('교차 편집');
    }
    if(this.dancePracticeSort) {
      words.push('dancepractice');
      words.push('dance practice');
      words.push('안무연습');
      words.push('안무 연습');
    }
    if(this.lyricsSort) {
      words.push('lyrics');
      words.push('가사')
    }

    let countQuery = "";
    let selectQuery = "";
    if(this.allSort) {
      if(this.starName == 'fullList') {
        countQuery = `SELECT COUNT(*) AS youtubeCount FROM youtube WHERE starName != 'streamingchart'`;
        selectQuery = `SELECT *, (SELECT COUNT(*) FROM favorite_youtube WHERE videoId = youtube.videoId) AS favoriteFlag FROM youtube WHERE starName != 'streamingchart' GROUP BY videoId ORDER BY views DESC`;
      } else {
        countQuery = `SELECT COUNT(*) AS youtubeCount FROM youtube WHERE starName = '${this.starName}'`;
        selectQuery = `SELECT *, (SELECT COUNT(*) FROM favorite_youtube WHERE videoId = youtube.videoId) AS favoriteFlag FROM youtube WHERE starName = '${this.starName}' ORDER BY views DESC`;
      }
    } else {
      if(this.starName == 'fullList') {
        countQuery = `SELECT COUNT(*) AS youtubeCount FROM youtube WHERE starName != 'streamingchart' AND (`;
        selectQuery = `SELECT *, (SELECT COUNT(*) FROM favorite_youtube WHERE videoId = youtube.videoId) AS favoriteFlag FROM youtube WHERE starName != 'streamingchart' AND (`;
      } else {
        countQuery = `SELECT COUNT(*) AS youtubeCount FROM youtube WHERE starName = '${this.starName}' AND (`;
        selectQuery = `SELECT *, (SELECT COUNT(*) FROM favorite_youtube WHERE videoId = youtube.videoId) AS favoriteFlag FROM youtube WHERE starName = '${this.starName}' AND (`;
      }
      for (let i = 0; i < words.length; i++) {
        if(i != 0) {
          countQuery += ' OR ';
          selectQuery += ' OR ';
        }
        countQuery += `title LIKE '%${words[i]}%'`;
        selectQuery += `title LIKE '%${words[i]}%'`;
      }
      if(this.starName == 'fullList') {
        countQuery += `)`;
        selectQuery += `) GROUP BY videoId ORDER BY views DESC`;
      } else {
        countQuery += `)`;
        selectQuery += `) ORDER BY views DESC`;
      }
    }

    this.infiniteScroll.disabled = false;

    this.youtubeList = [];
    this.offset = 0;
    this.setYoutubeCount(countQuery);
    this.pushYoutube(selectQuery + ` LIMIT ${this.offset}, ${this.limit}`);

    this.countQuery = countQuery;
    this.selectQuery = selectQuery;
  }

  async openModal() {
    const modal = await this.modalCtrl.create({
      showBackdrop: true,
      backdropDismiss: true,
      cssClass: 'search-star-modal',
      component: ModalPage,
      componentProps: {
        'callParentFunction': this.goSelf.bind(this)
      }
    });

    return await modal.present();
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

  closeYoutubePlayer() {
    let youtubeIframe = document.getElementById('youtube-iframe') as HTMLIFrameElement;
    youtubeIframe.contentWindow.postMessage('{"event":"command","func":"stopVideo","args":""}', '*');

    document.getElementById('youtube-div').style.display = 'none';
    document.getElementById('youtube-player-option').style.display = 'none';

    this.activeVideoId = '';
  }

  pauseYoutubePlay() {
    this.stopFlag = 'T';

    let youtubeIframe = document.getElementById('youtube-iframe') as HTMLIFrameElement;
    youtubeIframe.contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
  }

  playYoutubePlay() {
    this.stopFlag = 'F';

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

  fullScreenYoutubePlay() {
    let youtubeIframe = document.getElementById('youtube-iframe') as any;
    if(youtubeIframe.requestFullscreen) {
      youtubeIframe.requestFullscreen();
    } else if(youtubeIframe.mozRequestFullScreen) { /* Firefox */
      youtubeIframe.mozRequestFullScreen();
    } else if(youtubeIframe.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
      youtubeIframe.webkitRequestFullscreen();
    } else if(youtubeIframe.msRequestFullscreen) { /* IE/Edge */
      youtubeIframe.msRequestFullscreen();
    }
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

  changeSortType() {
    if(this.sortType == 'R') { // Recently Popular
      let countQuery = '';
      let selectQuery = '';
      if(this.starName == 'fullList') {
        countQuery = `SELECT COUNT(*) AS youtubeCount FROM hot_youtube`;
        selectQuery = `
          SELECT
            youtube.*, (SELECT COUNT(*) FROM favorite_youtube WHERE videoId = hot_youtube.videoId) AS favoriteFlag
          FROM
            hot_youtube
          INNER JOIN
            youtube
          ON
            hot_youtube.videoId = youtube.videoId AND hot_youtube.starName = youtube.starName
          GROUP BY hot_youtube.videoId
          ORDER BY youtube.views DESC
        `;
      } else {
        countQuery = `SELECT COUNT(*) AS youtubeCount FROM hot_youtube WHERE starName = '${this.starName}'`;
        selectQuery = `
          SELECT
            youtube.*, (SELECT COUNT(*) FROM favorite_youtube WHERE videoId = hot_youtube.videoId) AS favoriteFlag
          FROM
            hot_youtube
          INNER JOIN
            youtube
          ON
            hot_youtube.videoId = youtube.videoId AND hot_youtube.starName = youtube.starName
          WHERE
            hot_youtube.starName = '${this.starName}'
          ORDER BY hot_youtube.rank ASC
        `;
      }

      this.setYoutube_SL(countQuery, selectQuery);
    } else if(this.sortType == 'M') { // Most Viewed
      this.allSort = true;
      this.mvSort = false;
      this.fanCamSort = false;
      this.stageMixSort = false;
      this.dancePracticeSort = false;
      this.lyricsSort = false;

      let countQuery = '';
      let selectQuery = '';
      if(this.starName == 'fullList') {
        countQuery = `SELECT COUNT(*) AS youtubeCount FROM youtube WHERE starName != 'streamingchart'`;
        selectQuery = `SELECT *, (SELECT COUNT(*) FROM favorite_youtube WHERE videoId = youtube.videoId) AS favoriteFlag FROM youtube WHERE starName != 'streamingchart' GROUP BY videoId ORDER BY views DESC`;
      } else {
        countQuery = `SELECT COUNT(*) AS youtubeCount FROM youtube WHERE starName = '${this.starName}'`;
        selectQuery = `SELECT *, (SELECT COUNT(*) FROM favorite_youtube WHERE videoId = youtube.videoId) AS favoriteFlag FROM youtube WHERE starName = '${this.starName}' ORDER BY views DESC`;
      }

      this.setYoutube_SL(countQuery, selectQuery);
    }
  }

}
