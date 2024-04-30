import { Component, Input, OnInit } from '@angular/core';
import { IStockNewsModel } from 'src/app/core/models/stock-news.model';
import { ITradierSymbol } from 'src/app/core/models/tradier-symbol.model';
import { GeneralService } from 'src/app/core/services/general.service';
@Component({
  selector: 'app-symbol-realtime-news',
  templateUrl: './symbol-realtime-news.component.html',
  styleUrls: ['./symbol-realtime-news.component.css']
})
export class SymbolRealtimeNewsComponent implements OnInit {
  //@Input() symbol: ITradierSymbol;
  cols: any;
  news: IStockNewsModel[];
  constructor(private _generalService: GeneralService) { }

  ngOnInit(): void {
    this.cols = [
      { field: 'col1', header: 'RealTime News' },
    ];
  }

  loadNews(symbol){
    this._generalService.getSymbolNews(symbol).subscribe(data => {
      this.news = data.filter((item, idx) => idx < 5).map(x => {
        if (x.headline.length > 120)
          x.headline = x.headline.substr(0, 120) + "...";
        return x;
      });
    });
  }

}
