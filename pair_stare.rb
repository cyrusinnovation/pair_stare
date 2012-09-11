#!/usr/bin/env ruby
require "sinatra"

set :public_folder, 'public'

get "/" do
  redirect "/pair_stare.html"
end