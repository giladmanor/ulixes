class Rule < ActiveRecord::Base
  belongs_to :node
  belongs_to :edge
  belongs_to :account
  
  serialize :require, Array
  serialize :demand, Array
  serialize :stats, Array
  to_info :name, :description, :node
  
  def relate_to_graph(node_id, edge_id)
    if self.node.nil? && self.edge.nil?
      node_id.nil? ? self.edge_id = edge_id : self.node_id = node_id 
    end
    
  end
  
end
