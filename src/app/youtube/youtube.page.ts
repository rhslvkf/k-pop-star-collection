import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IonContent, ModalController, IonInfiniteScroll } from '@ionic/angular';
import { YoutubeVideoPlayer } from '@ionic-native/youtube-video-player/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { MyToastService } from '../service/my-toast.service';
import { ModalPage } from '../modal/modal.page';
import { MenuToolBarService } from '../service/menu-toolbar.service';
import { MENUS } from '../vo/menus';
import { SqlStorageService } from '../service/sql-storage.service';
import { INSERT_FAVORITE_YOUTUBE, DELETE_FAVORITE_YOUTUBE } from '../vo/query';
import { Youtube } from '../vo/youtube';

@Component({
  selector: 'app-youtube',
  templateUrl: './youtube.page.html',
  styleUrls: ['./youtube.page.scss'],
})
export class YoutubePage implements OnInit {
  @ViewChild(IonContent, {static: false}) ionContent: IonContent;
  @ViewChild(IonInfiniteScroll, {static: false}) infiniteScroll: IonInfiniteScroll;
  youtubeList: Youtube[] = [];
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

  constructor(
    private activatedRoute: ActivatedRoute,
    private youtube: YoutubeVideoPlayer,
    private myToastService: MyToastService,
    private statusBar: StatusBar,
    private modalCtrl: ModalController,
    private menuToolbarService: MenuToolBarService,
    private sqlStorageService: SqlStorageService
  ) {
    activatedRoute.params.subscribe(() => {
      statusBar.backgroundColorByHexString('#d40000');
      menuToolbarService.changeClass(MENUS.YOUTUBE);
    });
  }
  
  goSelf(starName: string) {
    this.starName = starName;
    this.youtubeList = [];
    this.ngOnInit();
  }

  ngOnInit() {
    if(this.starName == '') this.starName = this.activatedRoute.snapshot.paramMap.get('starName');

    this.setYoutube_SL();
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

  setYoutube_SL() {
    this.youtubeList = [];
    this.offset = 0;
    let countQuery = `SELECT COUNT(*) AS youtubeCount FROM youtube WHERE starName = '${this.starName}'`;
    let selectQuery = `SELECT *, (SELECT COUNT(*) FROM favorite_youtube WHERE videoId = youtube.videoId) AS favoriteFlag FROM youtube WHERE starName = '${this.starName}' ORDER BY views DESC`;
    this.setYoutubeCount(countQuery);
    this.pushYoutube(selectQuery + ` LIMIT ${this.offset}, ${this.limit}`);

    this.countQuery = countQuery;
    this.selectQuery = selectQuery;
  }

  playYoutube(videoId: string) {
    this.youtube.openVideo(videoId);
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
      countQuery = `SELECT COUNT(*) AS youtubeCount FROM youtube WHERE starName = '${this.starName}'`;
      selectQuery = `SELECT *, (SELECT COUNT(*) FROM favorite_youtube WHERE videoId = youtube.videoId) AS favoriteFlag FROM youtube WHERE starName = '${this.starName}' ORDER BY views DESC`;
    } else {
      countQuery = `SELECT COUNT(*) AS youtubeCount FROM youtube WHERE starName = '${this.starName}' AND (`;
      selectQuery = `SELECT *, (SELECT COUNT(*) FROM favorite_youtube WHERE videoId = youtube.videoId) AS favoriteFlag FROM youtube WHERE starName = '${this.starName}' AND (`;
      for (let i = 0; i < words.length; i++) {
        if(i != 0) {
          countQuery += ' OR ';
          selectQuery += ' OR ';
        }
        countQuery += `title LIKE '%${words[i]}%'`;
        selectQuery += `title LIKE '%${words[i]}%'`;
      }
      countQuery += ')';
      selectQuery += `) ORDER BY views DESC`;
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

}
