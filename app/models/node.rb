class Node < ActiveRecord::Base
  belongs_to :account
  serialize :data, Hash
  
  has_many :users
  has_many :rules
  has_many :edges, :class_name=>"Edge", :foreign_key=>"source_id"
  #after_initialize :do_bidding
  to_info :name
  def all_rules
    self.rules
  end

  def compile
    self.code_cache = self.rules.map{|r| r.to_code}.join("\n")
    self.save
    logger.debug "# Node #{self.id} Compiled #"
  end
  
  def evaluate(user,last_event)
    eval code_cache || "false"
    self.edges.each{|e|
      return if e.evaluate(user,last_event)
    }
  end
  
  def count_events(user,filter)
    
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
    #events = Event.where(:user_id=>self.users)
    logger.debug "Events Loaded, calculating sums--------------"
    Event.where(:user_id=>self.users).find_each({:batch_size=>100000}){|e|
      actions[e.code] = (actions[e.code] || 0 ) + (e.value || 0)
      count[e.code] = (count[e.code] || 0) +1
      
    }
    logger.debug "Mapping Actions------------------------"
    actions.map{|k,v| {:name=>k,:value=>v,:count=>count[k],:avg=>(v/size)}}
  end
  
  def vector(force=false)
    res = self.data[:vector] || {}
    if res.empty? || force
      events_sum.each{|e| res[e[:name]]=e[:avg]}
      self.data[:vector] = res
      self.data[:vector_updated] = Time.now
      self.save 
    end
    
    res
  end
  
  def vector_updated_at
    self.data[:vector_updated]
  end
  
end
