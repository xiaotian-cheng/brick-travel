import { AfterViewInit, Component, EventEmitter, Input, OnDestroy, Output, Renderer2, ViewChild, ElementRef } from '@angular/core';

import { IDailyTripBiz, ITravelAgendaBiz, ITravelViewPointBiz } from '../../bizModel/model/travelAgenda.biz.model';
import { TransportationCategory } from '../../modules/store/entity/travelAgenda/travelAgenda.model';
import { EnumEx } from '../../utils/enumEx';
import { DragulaService } from '../../providers/dragula.service';
import { List, Scroll } from 'ionic-angular';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'travel-agenda',
  templateUrl: 'travel-agenda.component.html',
  host: {'style': 'display: flex;'}
})
export class TravelAgendaComponent implements AfterViewInit,OnDestroy {
  //#region Private member
  private  _travelAgenda : ITravelAgendaBiz;

  private _viewPointDragHandle: any;
  private _dayDragHandle: any;

  private _vpScrollRect : any;
  private _dayScrollRect : any;

  private _vpScrollContent : any;
  private _dayScrollContent : any;

  private _dayDragSub : Subscription;
  private _viewPointDragSub : Subscription;

  @ViewChild('vpList', { read: List }) private _vpListCmp: List;
  @ViewChild('dayList', { read: List }) private _dayListCmp: List;
  
  @ViewChild('dayScroll', { read: ElementRef }) private _dayScroll: ElementRef;
  @ViewChild('vpScroll', { read: ElementRef }) private _vpScroll: ElementRef;

  //#endregion

  //#region Protected member
  
  protected selectedDailyTrip : IDailyTripBiz;
  
  //#endregion

  //#region Protected property
  @Input() protected set travelAgenda(ta : ITravelAgendaBiz) {
    if (ta && ta.dailyTrips && ta.dailyTrips.length >0) {
      this._travelAgenda = ta;
      this.selectedDailyTrip = ta.dailyTrips[0];
      setTimeout(() => {
        this.dailyTripSelectedEvent.emit(this.selectedDailyTrip);
      });
    }
  }

  protected get travelAgenda() : ITravelAgendaBiz {
    return this._travelAgenda;
  }

  protected get transCategoryNameAndValues(): {name: string,value: any }[] {
    return EnumEx.getNamesAndValues(TransportationCategory)
  }

  @Output() protected dailyTripSelectedEvent : EventEmitter<IDailyTripBiz>

  //#endregion

  //#region Private property

  //#endregion

  //#region Event
  
  //#endregion

  //#region Constructor
  constructor(private _dragulaService: DragulaService,private _renderer: Renderer2) {
    this.dailyTripSelectedEvent = new EventEmitter<IDailyTripBiz>();
  }
  //#endregion

  //#region Interface implementation
  ngAfterViewInit(): void {
    this._dragulaService.drag.subscribe((value: any) => {
      let bagName = value[0];
      let el = value[1];
      let source = value[2];

      if (bagName === 'vp-bag') {
        this.onViewPointDrag(el, source);
      }
      else {
        this.onDayDrag(el, source);
      }
    });

    this._dragulaService.dragend.subscribe((value: any) => {
      let bagName = value[0];
      let el = value[1];

      if (bagName === 'vp-bag') {
        this.onViewPointDragEnd(el);
      }
      else {
        this.onDayDragEnd(el);
      }
    });

    this._vpScrollContent =this._vpScroll.nativeElement.querySelector('.scroll-content');
    this._dayScrollContent =this._dayScroll.nativeElement.querySelector('.scroll-content');
  }

  ngOnDestroy(): void {
  }
  //#endregion

  //#region Public property

 
  //#endregion

  //#region Protected properties
 
  //#endregion

  //#region Protected method
  protected get dragulaOptions() : any {
    let that = this;
    let that_moves = (el: any, source: any, handle: any, sibling: any) : boolean => {
      return that.moves(el, source, handle, sibling);
    };
    return {moves: that_moves};
  }

  protected dayClicked(dailyTrip : IDailyTripBiz) : void {
    this.selectedDailyTrip = dailyTrip;
    this.dailyTripSelectedEvent.emit(this.selectedDailyTrip);
  }

  protected isSelectedDailyTrip(dailyTrip : IDailyTripBiz) {
    return {'display': this.selectedDailyTrip === dailyTrip?'block':'none'};
  }

  protected getDayItemClass(dailyTrip: IDailyTripBiz) {
    return {
      'day-item': true,
      'active': dailyTrip === this.selectedDailyTrip
    };
  }

  protected getTravelViewPointItemClass(travelViewPoint : ITravelViewPointBiz) {
    return {
      'vp-item': true
    };
  }

  protected getTransportationItemClass(travelViewPoint : ITravelViewPointBiz) {
    return {
      'tp-item': true
    };
  }

  protected changed($event) {
    console.log('changed');  
  }
  //#endregion

  //#region Private method
  private touchMoveViewPoint(e: any) {
    this._vpScrollRect = this._vpScrollContent.getBoundingClientRect();
    
    if (e.touches[0].clientY < this._vpScrollRect.top)
      this._vpScrollContent.scrollTop -= 10;  
    //this._vpScroll.scrollTo(0,this._vpScrollContent.scrollTop - 10);

    if (e.touches[0].clientY > this._vpScrollRect.bottom)
      this._vpScrollContent.scrollTop += 10;  
    //this._vpContent.scrollTo(0,this._vpScrollContent.scrollTop + 10);
  }

  private touchMoveDay(e: any) {
    this._dayScrollRect = this._dayScrollContent.getBoundingClientRect();

    if (e.touches[0].clientY < this._dayScrollRect.top)
      this._dayScrollContent.scrollTop -= 10;
      //this._dayContent.scrollTo(0,this._dayScrollContent.scrollTop - 10);

    if (e.touches[0].clientY > this._dayScrollRect.bottom)
      this._dayScrollContent.scrollTop += 10;
      //this._dayContent.scrollTo(0,this._dayScrollContent.scrollTop + 10);
  }

  private moves(el: any, source: any, handle: any, sibling: any): boolean {
    let valid = (handle.tagName === 'I');
    if (valid) {
      if (el.children[0].classList.contains('vp-item'))
      this._viewPointDragHandle = handle;
      else
        this._dayDragHandle = handle;
    }
    return valid;
  }

  private onViewPointDrag(el: any, source: any) {
    this._vpListCmp.sliding = false;
    this._renderer.removeClass(this._vpScroll.nativeElement, 'scroll-y');
    this._viewPointDragSub =  Observable.fromEvent(this._viewPointDragHandle,'touchmove').subscribe(e=>{
      this.touchMoveViewPoint(e);
    });
  }

  private onDayDrag(el: any, source: any) {
    this._dayListCmp.sliding = false;    
    this._renderer.removeClass(this._dayScroll.nativeElement, 'scroll-y');
    this._dayDragSub = Observable.fromEvent(this._dayDragHandle,'touchmove').subscribe(e=>{
      this.touchMoveDay(e);
    });
  }

  private onViewPointDragEnd(el: any) {
    this._vpListCmp.sliding = true;
    this._renderer.addClass(this._vpScroll.nativeElement, 'scroll-y');
    this._viewPointDragSub.unsubscribe();
  }

  private onDayDragEnd(el: any) {
    this._dayListCmp.sliding = true;
    this._renderer.addClass(this._dayScroll.nativeElement, 'scroll-y');
    this._dayDragSub.unsubscribe();
  }

  //#endregion
}
