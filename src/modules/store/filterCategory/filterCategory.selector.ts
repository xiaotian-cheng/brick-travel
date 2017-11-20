import { asMutable } from 'seamless-immutable';
import { NgRedux } from '@angular-redux/store';
import { IAppState } from '../store.model';
import { IFilterCategory } from './filterCategory.model';

export function getFilterCategories(store : NgRedux<IAppState> ) {
    return (data : { [id : string] : IFilterCategory }) => {
        let ret = new Array<IFilterCategory>();
        let criteries = asMutable(store.getState().entities.filterCriteries,{deep: true});
        let categories = asMutable(data,{deep: true});
        Object.keys(categories).forEach(key => {
            let category = categories[key];
            category.allCriteria = criteries[category.allCriteria];
            category.criteries = category.criteries.map(id => criteries[id])
            ret.push(category);
        });
        
        return ret;
    }
}