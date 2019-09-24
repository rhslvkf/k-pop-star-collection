import { Injectable } from '@angular/core';

import { MENUS } from '../vo/menus';

@Injectable({
  providedIn: 'root'
})
export class MenuToolBarService {

  constructor() { }

  changeClass(className: string) {
    let menuToolbar = document.getElementById('menu-toolbar') as HTMLElement;
    Object.keys(MENUS).forEach((key) => {
      menuToolbar.classList.remove(MENUS[key]);
    });
    menuToolbar.classList.add(className);
  }

}
