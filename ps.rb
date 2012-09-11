require 'json'

def name_id_pairs(nodes)
  nodes.each_with_index.map { |x, i| [x['name'], i] }
end

ps_file = File.read("ps.json")
nodes = JSON.parse(ps_file)["nodes"]

name_id_pairs(nodes).each do |name, id|
  ps_file.gsub!(/"#{name}"/, id.to_s)
end
links = JSON.parse(ps_file)["links"]



File.write("pair_stare.json", {nodes: nodes, links: links}.to_json)