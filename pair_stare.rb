#!/usr/bin/env ruby
require "sinatra"

set :public_folder, 'force'

get "/" do
  redirect "/force.html"
end