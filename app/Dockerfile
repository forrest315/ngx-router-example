FROM openresty/openresty:alpine

MAINTAINER Liu Chong <mail@clojure.cn>

# ENV NGXR_REDIS_HOST d.d.d.d

# ENV NGXR_REDIS_PORT dddd

ENV NGXR_DB_URL http://ngxr-api.your-domain.com/db

ENV NGXR_DB_PREFIX ngxr

ENV NGXR_DB_DELAY 60

RUN ulimit -n 10000

COPY nginx.conf /usr/local/openresty/nginx/conf/nginx.conf

COPY http.lua /usr/local/openresty/lualib/resty/http.lua

COPY http_headers.lua /usr/local/openresty/lualib/resty/http_headers.lua

COPY http_level.lua /usr/local/openresty/lualib/resty/http_level.lua

CMD ["/usr/local/openresty/nginx/sbin/nginx", "-g", "daemon off;"]
