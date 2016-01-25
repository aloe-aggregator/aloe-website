/*
These logs stay in the collection (not displayed to the client).
{
    date: new Date(),
    message: 'My message',
    explanation: 'explanation'
}
*/
Logs = new Mongo.Collection('logs');