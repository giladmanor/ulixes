class Node < ActiveRecord::Base
  has_many :rules
  has_many :edges, :class_name=>"Edge", :foreign_key=>"source_id"
  after_initialize :do_bidding
  
  def all_rules
    self.rules
  end
  
  def evaluate(user,last_event)
    
  end
  
  def do_bidding
    puts "#### DO BIDDING ####"
    
  end
  
  #["if User Event,with Scale,add,grater then,0"] => ["revoke User of Badge,Test"]
  
  def rendered(user,last_event)
    user.remove_badge("Test") if last_event.code == "add" && last_event.value>0
  end
  
  
  
  def code_for_require(require)
    line = require.split(",")
    case line.first
      when "revoke User of Badge"
        "user.remove_badge(#{account.badges.find_by_name(demand.last)})"
      when ""
      
    end 
  end
  
  
  
  
  def code_for_demand(demand)
    line = demand.split(",")
    case line.first
      when "revoke User of Badge"
        "user.remove_badge(#{account.badges.find_by_name(demand.last)})"
      when ""
      
    end 
  end
  
  
  
  
  
  
  
  
  
  
  
end
