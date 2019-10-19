import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'search'
})
export class SearchPipe implements PipeTransform {

  transform(items: any[], terms: string): any[] {
    if (!items) return [];
    if (!terms) return items;

    return items.filter( it => {
      // search starName from favorite/starPage and modalPage
      if(it.name && it.name.toLowerCase().includes(terms.toLowerCase())) {
        return true;
      }

      let termsArray = terms.split('|');
      if(termsArray[0] == 'starName') {
        // search youtubeStar from favorite/youtubePage
        if(termsArray.length == 1) return true;
        for(let i = 1; i < termsArray.length; i++) {
          if(it.starName.toLowerCase().includes(termsArray[i].toLocaleLowerCase())) {
            return true;
          }
        }
      }
    });
  }

}
