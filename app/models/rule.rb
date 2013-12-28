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
  
  def relate_to_node(node_id)
    self.edge_id = nil
    self.node_id = node_id
  end
  
  def relate_to_edge(edge_id)
    self.edge_id = edge_id
    self.node_id = self.account.edges.find(edge_id).source_id 
  end  
  
  
  
  #----------------------------------------------------------------------------
  # CODE GEN # CODE GEN # CODE GEN # CODE GEN # CODE GEN # CODE GEN # CODE GEN 
  #============================================================================
  
  #string it out
  
  def to_code
    "if #{line_up_cond} \n #{line_up_result} \n end"
  end
  
  def line_up_cond
    self.require.map{|line| Rule.require_to_code(line)}.join(" and ")
  end
  
  def line_up_result
    self.demand.map{|line| Rule.demand_to_code(line)}.join("\n")
  end
  
  #------------------------------------------------------------------------------
  
  IF_USER_EVENT = "if User Event"
  IF_USER_SCALE = "if User Scale"
  IF_USER_HAS_BADGE = "if User has Badge"
  UNLESS_USER_HAS_BADGE = "unless User has Badge"
  
  OPERANDS = {"is"=>"==","not"=>"!=", "grater then"=>">","lesser then"=>"<"}
  REGEXP = {"starts with"=>".start_with?","end_with"=>".end_with?", "contains"=>".include?","equals"=>"==","expression"=>".match"}
  
  def self.require_to_code(require)
    line = require.split(",")
    case line.first
      when IF_USER_EVENT
        resolve_event_condition(line)
      when IF_USER_SCALE
        resolve_scale_condition(line)
      when IF_USER_HAS_BADGE,UNLESS_USER_HAS_BADGE 
        resolve_badge_condition(line)
    end 
  end
  
  def self.resolve_event_condition(line)
    case line[1]
      when "with Value"
        "(last_event.value #{OPERANDS[line[2]]} #{line.last})"
      when "with Code"
        "(last_event.code#{REGEXP[line[2]]}(#{line.last}))"
    end
  end
  
  def self.resolve_scale_condition(line)
    "(user.score(account.scales.find_by_code('#{line[1]}')) #{OPERANDS[line[2]]} #{line.last})"
  end
  
  def self.resolve_badge_condition(line)
    pref = line[0]==UNLESS_USER_HAS_BADGE ? "!" : ""
    "(#{pref}user.has_badge_named?('#{line[1]}'))"
  end
  
  #====================================================================
  UPSET_USER_SCALE = "upset User Scale"
  GRANT_USER_BADGE = "grant User with Badge"
  REVOKE_USER_BADGE = "revoke User of Badge"
  SEND_NOTIFICATION = "send Notification"
  
  
  
  def self.demand_to_code(demand)
    line = demand.split(",")
    case line.first
      when UPSET_USER_SCALE
        value = line.last
        added_value = line[1] == "by (value)" ? value : "last_event.value * #{value}"
        "user.upset_scale(account.scales.find_by_name(#{line[1]}),#{added_value})"
      when GRANT_USER_BADGE
        "user.add_badge(self.account.badges.find_by_name('#{line.last}'))"
      when REVOKE_USER_BADGE
        "user.remove_badge(self.account.badges.find_by_name('#{line.last}'))"
      when SEND_NOTIFICATION
        "user.announce('#{line[1]}',#{line.last}')"
    end 
  end
  
  
  #-----------------------------------------------------------------------------------
  
  
  
  
  
  
end
