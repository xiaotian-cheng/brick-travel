import 'rxjs/add/operator/combineLatest';

import { NgRedux } from '@angular-redux/store';
import { AfterViewInit, Component } from '@angular/core';
import { FabContainer } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import { asMutable } from 'seamless-immutable';

import { IFilterCategoryBiz, IFilterCriteriaBiz } from '../../bizModel/model/filterCategory.biz.model';
import { IDailyTripBiz, ITravelAgendaBiz, translateDailyTrip, translateTravelAgenda } from '../../bizModel/model/travelAgenda.biz.model';
import { IViewPointBiz } from '../../bizModel/model/viewPoint.biz.model';
import { getFilterCategories } from '../../bizModel/selector/entity/filterCategory.selector';
import { getTravelAgendas } from '../../bizModel/selector/entity/travelAgenda.selector';
import { getViewPoints } from '../../bizModel/selector/entity/viewPoint.selector';
import { getSelectedDailyTrip } from '../../bizModel/selector/ui/dailyTripSelected.selector';
import { getSelectedTravelAgenda } from '../../bizModel/selector/ui/travelAgendaSelected.selector';
import { getCurrentFilters } from '../../bizModel/selector/ui/viewPointFilter.selector';
import { getViewPointSearch } from '../../bizModel/selector/ui/viewPointSearch.selector';
import { CityActionGenerator } from '../../modules/store/entity/city/city.action';
import { FilterCategoryActionGenerator } from '../../modules/store/entity/filterCategory/filterCategory.action';
import { TravelAgendaActionGenerator } from '../../modules/store/entity/travelAgenda/travelAgenda.action';
import { ViewPointActionGenerator } from '../../modules/store/entity/viewPoint/viewPoint.action';
import { IAppState } from '../../modules/store/store.model';
import { UIActionGenerator } from '../../modules/store/ui/ui.action';
import { getSelectedViewPoint } from '../../bizModel/selector/ui/viewPointSelected.selector';

@Component({
  selector: 'page-test',
  templateUrl: 'test.page.html'
})
export class TestPage implements AfterViewInit {
  protected viewPoints$: Observable<Array<IViewPointBiz>>;
  protected travelAgendas$: Observable<Array<ITravelAgendaBiz>>;
  protected filterCategories$: Observable<Array<IFilterCategoryBiz>>;
  protected currentFilterCategories$: Observable<Array<IFilterCategoryBiz>>;
  protected selectedTravelAgenda$: Observable<ITravelAgendaBiz>;
  protected selectedDailyTrip$: Observable<IDailyTripBiz>;
  protected selectedViewPoint$: Observable<IViewPointBiz>;
  protected search$: Observable<string>;

  //protected dayTripSelected$: Subject<IDailyTripBiz> = new Subject<IDailyTripBiz>();

  protected showSearchBar: boolean = false;
  protected showFilterBar: boolean = false;
  public displayModeEnum = DisplayModeEnum;

  //private dailyTrips: Array<IDailyTripBiz> = new Array<IDailyTripBiz>();
  private firstDailyTrip: boolean = true;
  protected displayMode: DisplayModeEnum;

  constructor(private _store: NgRedux<IAppState>,
    private _uiActionGeneration: UIActionGenerator,
    private _viewPointActionGenerator: ViewPointActionGenerator, private _cityActionUIActionGenerator: CityActionGenerator,
    private _travelAgendaActionUIActionGenerator: TravelAgendaActionGenerator, private _filterCategoryActionUIActionGenerator: FilterCategoryActionGenerator) {

    this.viewPoints$ = getViewPoints(_store);
    this.travelAgendas$ = getTravelAgendas(_store);
    this.filterCategories$ = getFilterCategories(this._store);
    this.search$ = getViewPointSearch(this._store);
    this.selectedTravelAgenda$ = getSelectedTravelAgenda(this._store);
    this.selectedDailyTrip$ = getSelectedDailyTrip(this._store);
    this.selectedViewPoint$ = getSelectedViewPoint(this._store);
    this.currentFilterCategories$ =  getCurrentFilters(this._store);

    this.displayMode = DisplayModeEnum.Agenda;
  }

  ngAfterViewInit(): void {
    this._cityActionUIActionGenerator.loadCities();
    this._viewPointActionGenerator.loadViewPoints();
    this._travelAgendaActionUIActionGenerator.loadTravelAgendas();
    this._filterCategoryActionUIActionGenerator.loadFilterCategories();

    this.selectedDailyTrip$.subscribe(x => console.log(x));
  }

  dismissSearchBar(): void {
    this.showSearchBar = false;
  }

  displaySearchBar(fab: FabContainer): void {
    this.showSearchBar = true;
    fab.close();
  }

  dismissFilterBar(): void {
    this.showFilterBar = false;
  }

  displayFilterBar(fab: FabContainer): void {
    this.showFilterBar = true;
    fab.close();
  }

  fetchMore(): void {
    //this._cityAction.loadCities(1,50);
   // this._viewPointActionGenerator.loadViewPoints(1, 50);
    //this._travelAgendaAction.loadTravelAgendas();
  }

  changeDailyTrip(): void {
    //this.dayTripSelected$.next(this.dailyTrips[this.firstDailyTrip ? 1 : 0]);
    this.firstDailyTrip = !this.firstDailyTrip;
  }

  clearDailyTrip(): void {
    //this.dayTripSelected$.next(null);
  }

  dailyTripSelected(dailyTrip : IDailyTripBiz) {
    //this.dayTripSelected$.next(dailyTrip);
    this._uiActionGeneration.selectDailyTrip(dailyTrip._id);
  }

  viewPointSelected(viewPoint : IViewPointBiz) {
    this._uiActionGeneration.selectViewPoint(viewPoint);
  }

  dailyTripChanged(value : {dailyTrip : IDailyTripBiz, travelAgenda : ITravelAgendaBiz}) {
    let dailyTrip = value.dailyTrip;
    let travelAgeanda = value.travelAgenda;
    this._travelAgendaActionUIActionGenerator.updateDailyTrip(dailyTrip._id,translateDailyTrip(dailyTrip));
    this._travelAgendaActionUIActionGenerator.updateTravelAgenda(travelAgeanda._id,translateTravelAgenda(travelAgeanda));
  }

  getDailyTrips(): Array<IDailyTripBiz> {
    let ret = new Array<IDailyTripBiz>();
    let viewPoints = asMutable(this._store.getState().entities.viewPoints, { deep: true });
    let dailyTrips = asMutable(this._store.getState().entities.dailyTrips, { deep: true });
    let travelViewPoints = asMutable(this._store.getState().entities.travelViewPoints, { deep: true });

    Object.keys(dailyTrips).forEach(key => {
      let dailyTrip = dailyTrips[key];
      dailyTrip.travelViewPoints = dailyTrip.travelViewPoints.map(id => travelViewPoints[id]);
      Object.keys(dailyTrip.travelViewPoints).forEach(key => {
        let travelViewPoint = dailyTrip.travelViewPoints[key];
        travelViewPoint.viewPoint = viewPoints[travelViewPoint.viewPoint];
      });
      ret.push(dailyTrip);
    });

    return ret;
  }

  protected criteriaClicked(filterChanged: { category: IFilterCategoryBiz, criteria: IFilterCriteriaBiz }) {
    filterChanged.criteria.isChecked = !filterChanged.criteria.isChecked;

    if (!filterChanged.category.criteries.find(c => !c.isChecked)) {
      filterChanged.category.criteries.forEach(c => {
        c.isChecked = false;
      })
    }

    let checkId: string = null;
    let unCheckIds: Array<string> = new Array<string>();

    filterChanged.category.criteries.forEach(c => {
      if (c.isChecked)
        checkId = c._id;
      else
        unCheckIds.push(c._id);
    });

    this._uiActionGeneration.selectCriteria(checkId, unCheckIds);
  }

  protected searchViewPoint(searchKey: string) {
    this._uiActionGeneration.searchViewPoint(searchKey);
  }

  protected switchDisplayMode() {
    this._uiActionGeneration.selectTravelAgenda("1");
    // if (this.displayMode === DisplayModeEnum.List)
    //   this.displayMode = DisplayModeEnum.Map;
    // else
    //   this.displayMode = DisplayModeEnum.List;
  }

  protected getSwitchButtonClass() {
    return {
      'map': this.displayMode === DisplayModeEnum.Map,
      'list': this.displayMode === DisplayModeEnum.List
    }
  }

  protected getStyle(expect) {
    return {
      'display': this.displayMode === expect ? 'inline' : 'none'
    }
  }
}

export enum DisplayModeEnum {
  Map,
  List,
  Agenda
}
