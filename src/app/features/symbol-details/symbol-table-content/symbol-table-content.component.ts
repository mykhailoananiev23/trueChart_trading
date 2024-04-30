import { DecimalPipe } from '@angular/common';
import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ITradierSymbol } from 'src/app/core/models/tradier-symbol.model';
import { StockService } from 'src/app/core/services/stock.service';

@Component({
  selector: 'app-symbol-table-content',
  templateUrl: './symbol-table-content.component.html',
  styleUrls: ['./symbol-table-content.component.css']
})
export class SymbolTableContentComponent implements OnInit,OnChanges {
  @Input() symbol: ITradierSymbol;

  tableData: any[];
  cols: any[];
  quote: any;
  dividend: any;
  stableStock: any;
  clock: any;
  change: any;
  price: any;
  priceChangeOpen: any;
  priceChangeClose: any;
  prevClose: any;
  isClockSubscribed: boolean;

  constructor(private _stockservice: StockService, private numberPipe: DecimalPipe) { }
  ngOnChanges(changes: SimpleChanges): void {
    if(changes['symbol'] && changes['symbol'].currentValue && !this.isClockSubscribed){
      this._stockservice.getClock().subscribe(data => {
        this.clock = data;
        if (this.clock.clock.state === 'closed') {
          this._stockservice.getCloseStock(this.symbol?.symbol).subscribe((x: any) => {
            this.price = x.close;
            this.change = x.percentChange;
            this.priceChangeOpen = x.open;
            this.priceChangeClose = x.close;
            this.prevClose = x.previousClose;
          }); 
        } else {
          this._stockservice.getMarketQuotes(this.symbol?.symbol).subscribe((data: any) => {
            this.symbol.close = this.symbol?.last;
          });
        }
      });
      this.isClockSubscribed=true;
    }

  }

  ngOnInit(): void {
    

  }

  reloadTable(symbol: ITradierSymbol) {
    this.symbol = symbol;

    this._stockservice.getMarketQuotes(this.symbol?.symbol).subscribe((data: any) => {
      this.quote = data.quotes.quote;
    });

    this._stockservice.getDividends(this.symbol?.symbol).subscribe((data: any) => {
      if (!!data && data.length > 0) {
        let i = 1;
        while (i < 5 && (data[0].results[i].tables.valuation_ratios === null || data[0].results[i].tables.valuation_ratios === undefined)) {
          i++;
        }

        this.dividend = data[0].results[i].tables.valuation_ratios ? data[0].results[i].tables : null;
      } else {
        this.dividend = null;
      }
    });

    this._stockservice.getStableStock(this.symbol?.symbol).subscribe(data => {
      this.stableStock = data;
    })
  }

  getDisplayValue(value, pipeFormat = '1.2-2') {
    if (!!value || value === 0)
      return this.numberPipe.transform(value, pipeFormat);
    return "-";
  }

  getPercentageDisplayValue(value, pipeFormat = '1.2-2') {
    if (!!value || value === 0)
      return this.numberPipe.transform(value, pipeFormat) + "%";
    return "-";
  }

  get stock_price() {
    // if (!!this.price)
    //   return this.price;
    return this.quote?.last;
  }

  get stock_high() {
    // if (this.priceChangeClose)
    //   return this.priceChangeClose;
    return this.quote?.low;
  }

  get stock_prevclose() {
    // if (!!this.prevClose)
    //   return this.prevClose;
    return this.quote?.prevclose;
  }

  get stock_low() {
    // if (this.priceChangeOpen)
    //   return this.priceChangeOpen;
    return this.quote?.high;
  }

  get change_percentage() {
    if (!!this.change)
      return this.change;
    return this.quote?.change_percentage;
  }

  getExchangeValue(value) {
    switch (value) {
      case 'A':
        return 'AMEX';
      case 'Q':
        return 'NASDAQ';
      case 'N':
        return 'NYSE ';
      default:
        return '-';
    }
  }
}
