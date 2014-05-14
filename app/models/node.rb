class Node < ActiveRecord::Base
  belongs_to :account
  has_many :users
  has_many :rules
  has_many :edges, :class_name=>"Edge", :foreign_key=>"source_id"
  #after_initialize :do_bidding
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

  def events_sum
    actions = {}
    count = {}
    size = self.users.size
    return [] unless size>0
    events = Event.where(:user_id=>self.users)
    events.each{|e|
      actions[e.code] = (actions[e.code] || 0 ) + (e.value || 0)
      count[e.code] = (count[e.code] || 0) +1
    }
    
    actions.map{|k,v| {:name=>k,:value=>v,:count=>count[k],:avg=>(v/size)}}
  end
  
  def vector
    res = {}
    events_sum.each{|e| res[e[:name]]=e[:avg]}
    res
  end
  
end
