require 'json'

ps = JSON.parse(File.read("ps.json"))
puts ps["nodes"].each_with_index.map {|x, i| [x["name"], i] }.inspect