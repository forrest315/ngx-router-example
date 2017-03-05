#!/usr/bin/env dtrace -s

pid$1::ngx_http_handler:entry
{
    elapsed = 0;
}

pid$1::ngx_http_core_access_phase:entry
{
    begin = timestamp;
}

pid$1::ngx_http_core_access_phase:return
/begin > 0/
{
    elapsed += timestamp - begin;
    begin = 0;
}

pid$1::ngx_http_finalize_request:return
/elapsed > 0/
{
    @elapsed = avg(elapsed);
    elapsed = 0;
}
