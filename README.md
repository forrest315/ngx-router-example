# ngx-router
[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Fliuchong%2Fngx-router-example.svg?type=shield)](https://app.fossa.io/projects/git%2Bgithub.com%2Fliuchong%2Fngx-router-example?ref=badge_shield)


A router based on openresty, with an API to update the mappers.

## Quick start

#### Deploy:

``` bash
$ make all
```

Please refer to Makefile, nginx/Dockerfile, api/Dockerfile for more details.

Suppose the urls on docker cluster are:

http://ngxr-app.your-domain.com/ (the proxy router)

http://ngxr-api.your-domain.com/ (the api)

#### Use API

There are two apis currently: /api and /db, every update(add or del) of mapper will take some time (the 'NGXR_DB_DELAY' in nginx/Dockerfile) to take effect.


***/api:***

This is to update the mappers.

> /api/conf: need to set status to "OK" to active the mappers.

``` bash
$ curl 'http://ngxr-api.your-domain.com/api/conf?status=OK'
```

> /api/add

``` bash
$ curl 'http://ngxr-api.your-domain.com/api/add?pattern=/robots.txt&target=www.baidu.com'

```

``` json
[
  {
    "pattern": "/robots.txt",
    "target": "www.baidu.com",
    "status": "OK"
  }
]

```

``` bash
$ curl -H 'Content-Type:application/json' -d '[{"pattern": "/good","target": "y.com"},{"pattern": "bad","target": "x.com"},{"pattern": "/foo/","target": "127.0.0.1:8081"},{"pattern": "/bar","target": "127.0.0.1:8081"}]'  'http://ngxr-api.your-domain.com/api/add'

```

``` json
[
  {
    "pattern": "/good",
    "target": "y.com",
    "status": "OK"
  },
  {
    "pattern": "bad",
    "target": "x.com",
    "status": "BAD"
  },
  {
    "pattern": "/foo/",
    "target": "127.0.0.1:8081",
    "status": "OK"
  },
  {
    "pattern": "/bar",
    "target": "127.0.0.1:8081",
    "status": "OK"
  }
]
```

> /api/list

``` bash
$ curl 'http://ngxr-api.your-domain.com/api/list'
```

> /api/del

``` bash
$ curl 'http://ngxr-api.your-domain.com/api/del?pattern=/foo'
```

***/db:***
This is for access leveldb directly.

> /db/keys

``` bash
$ curl 'http://ngxr-api.your-domain.com/db/keys?p=.*'
```


> /db/get

``` bash
$ curl 'http://ngxr-api.your-domain.com/db/get?k=ngxr:ptn:/foo/'
```

> /db/set

``` bash
$ curl 'http://ngxr-api.your-domain.com/db/set?k=x&v=y'
$ curl -H 'Content-Type:application/json' -d '{"k":"ngxr:conf:status","v":"OK"}' 'http://ngxr-api.your-domain.com/db/set'
```

> /db/del

``` bash
$ curl 'http://ngxr-api.your-domain.com/db/del?k=ngxr:conf:status'
```

> /db/keys

``` bash
$ curl 'http://ngxr-api.your-domain.com/db/keys'
$ curl 'http://ngxr-api.your-domain.com/db/keys?p=ngxr:conf:.*'
```

> /db/dump

``` bash
$ curl 'http://ngxr-api.your-domain.com/db/dump'
$ curl 'http://ngxr-api.your-domain.com/db/dump?p=ngxr:ptn:/.*'
```

## logic of nginx router the proxy:

1. cache will be updated immediately on the start of the nginx, and set a update routine job running on the backend.
2. cache will not out of date, until the next update job set the update time to the NGXR_DB_DELAY.
3. when successfully connected to db, set the out-of-date time of current cache to be NGXR_DB_DELAY, then read the mappers again.
4. uri will started of a "/", and /xxx/ will be effective to /xxx/, /xxx/yyy, /xxx/yyy/zzz, /xxx will only match itself exactly.
5. for example, give a "/xxx/yyy/zzz": if there is an exactly mapper in the cache, will use it, if not, will use the father path "/xxx/yyy/" to do the next match, util "/".
6. once found a mapper which not appears in cache via the "father path match", it will be put into cache; if there is no match at all, a default match will be put into cache to avoid next match loop, which will get out-of-date after the next cache update job.
7. default match is to 127.0.0.1:8081, which will only return an error message.

## redis version

use nginx_redis.conf and set up a redis service, do not need api and http_level.lua.

## Author

Liu Chong <mail@clojure.cn>


## License

[MIT](LICENSE)

[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Fliuchong%2Fngx-router-example.svg?type=large)](https://app.fossa.io/projects/git%2Bgithub.com%2Fliuchong%2Fngx-router-example?ref=badge_large)
