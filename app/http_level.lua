local http = require "resty.http";
local json = require "cjson";

local _M = {}

local mt = { __index = _M }

function _M.keys (self, p)
   local httpc = http.new();
   local res, err = httpc:request_uri(
      self.url .. "/keys?p=" .. p , {
         method = "GET",
         headers = {
            ["Content-Type"] = "application/json"
         }
   })
   if(err) then
      return {}, err
   else
      local j = json.decode(res.body)
      return j, err
   end
end

function _M.get (self, k)
  local httpc = http.new();
  local res, err = httpc:request_uri(
      self.url .. "/get?k=" .. k , {
         method = "GET",
         headers = {
            ["Content-Type"] = "application/json"
         }
  })
  if(err) then
     return nil, err
  else
     return res.body, err
  end
end

function _M.set (self, k, v)
   local httpc = http.new();
   local res, err = httpc:request_uri(
      self.url .. "/set?k=" .. k .. "v=" .. v, {
         method = "GET",
         headers = {
            ["Content-Type"] = "application/json"
         }
   })
   return res.body, err
end

function _M.del (self, v)
   local httpc = http.new();
   local res, err = httpc:request_uri(
      self.url .. "/del?k=" .. k , {
         method = "GET",
         headers = {
            ["Content-Type"] = "application/json"
         }
   })
   return res.body, err
end

function _M.all (self, p)
   local httpc = http.new();
   local res, err = httpc:request_uri(
      self.url .. "/all?p=" .. p , {
         method = "GET",
         headers = {
            ["Content-Type"] = "application/json"
         }
   })
   return res.body, err
end

function _M.new (self, url)
   return setmetatable({url = url}, mt)
end

return _M
