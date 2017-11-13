import { schema } from 'normalizr';

export const viewPointComment = new schema.Entity('viewPointComments');

export const user = new schema.Entity('users');

export const viewPoint = new schema.Entity('viewPoints',{
    comments: [ viewPointComment ]
});

export const city = new schema.Entity('cities');

export const travelViewPoint = new schema.Entity('travelViewPoints',{
    viewPoint: viewPoint
});

export const dailyTrip = new schema.Entity('dailyTrips',{
    travelViewPoints: [travelViewPoint]
});

export const travelAgenda = new schema.Entity('travelAgendas',{
    user: user,
    dailyTrips: [dailyTrip]
});