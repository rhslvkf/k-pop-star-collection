import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'search'
})
export class SearchPipe implements PipeTransform {

  transform(items: any[], terms: string): any[] {
    if (!items) return [];
    if (!terms) return items;

    return items.filter( it => {
      console.log('search pipe');
      console.log(terms);
      // search starName from HomePage
      if(it.name && it.name.toLowerCase().includes(terms.toLowerCase())) {
        return true;
      }

      // search youtubeTitle from YoutubePage
      let result = false;
      let termsArray = terms.split('|');
      for(let i = 0; i < termsArray.length; i++) {
        if(it.title && it.title.toLowerCase().includes(termsArray[i].toLowerCase())) {
          result = true;
          break;
        }
      }
      
      return result;
    });
  }

}
