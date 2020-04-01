# covid-api

JSON api wrapper around the [JHU covid 19 data](https://github.com/CSSEGISandData/COVID-19). Numbers are updated as JHU numbers are updated.


- County Current Values - [/api/counties](https://covid-api.timothyko.org/api/counties)
- County Historical Values - [/api/daily](https://covid-api.timothyko.org/api/daily)



### Endpoint Details

**/api/counties**

[/api/counties](https://covid-api.timothyko.org/api/counties)

Query Parameters
- `county` - name of county in lowercase, with spaces replaced with a dash(`-`). Ex: Santa Clara is `santa-clara`


**/api/daily**

[/api/daily](https://covid-api.timothyko.org/api/daily)

Query Parameters
- `county` - name of county in lowercase, with spaces replaced with a dash(`-`). Ex: Santa Clara is `santa-clara`
