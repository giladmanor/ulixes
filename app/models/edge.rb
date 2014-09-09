class Edge < ActiveRecord::Base
  belongs_to :account
  belongs_to :source, :class_name=> "Node"
  belongs_to :target, :class_name=> "Node"
  has_many :rules
  
  def compile
    self.code_cache = self.rules.map{|r| "#{r.line_up_cond}"}.join(" || ") 
    self.save
    logger.debug "# Edge #{self.id} Compiled #"
  end
  
  def evaluate(user,last_event)
    if res = eval(code_cache || "false")
      user.move_to_node self
    end
    res
  end
  
end
