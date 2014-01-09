class Node < ActiveRecord::Base
  belongs_to :account
  has_many :rules
  has_many :edges, :class_name=>"Edge", :foreign_key=>"source_id"
  after_initialize :do_bidding
  to_info :name
  
  def all_rules
    self.rules
  end
  
  def evaluate(user,last_event)
    puts "-"*50
    code = self.rules.map{|r| r.to_code}.join("\n")
    puts code
    eval code
    self.edges.each{|e| 
      return if e.evaluate(user,last_event) 
    }
    puts "-"*50
  end
  
  def do_bidding
    puts "#### DO BIDDING ####"
    puts "Node: #{self.name} \n Account: #{self.account.id}"
    code = self.rules.map{|r| r.to_code}.join("\n")
    puts code
    puts "#"*30
    
  end
  
  #["if User Event,with Scale,add,grater then,0"] => ["revoke User of Badge,Test"]
  
  def rendered(user,last_event)
    user.remove_badge("Test") if last_event.code == "add" && last_event.value>0
  end
  
  
    
  
end
