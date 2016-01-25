/*
The statistics are realised avery month. 1 document = 1 month.
There are 3 types of statistic :
    - presence : number of offer from the websites
    - click : number of click by the client
    - redirection : number of redirection of the client, when they want to see the offer on the original website
They contain all the websites of fixtures_websites.js

{
    dateString: 201601,       // Year and month of the statistic (format: 'YYYYMM')
    presence: {
        Indeed: 0,
        ...
        Monster: 0
    },
    click: {
        Indeed: 0,
        ...
        Monster: 0
    },
    redirection: {
        Indeed: 0,
        ...
        Monster: 0
    }
}
*/
Stats = new Mongo.Collection('statistics');