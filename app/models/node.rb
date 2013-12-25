class Node < ActiveRecord::Base
  belogns_to :account
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
  
  
    
  
end
