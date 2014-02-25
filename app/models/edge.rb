class Edge < ActiveRecord::Base
  belongs_to :account
  belongs_to :source, :class_name=> "Node"
  belongs_to :target, :class_name=> "Node"
  has_many :rules
  
  
  def evaluate(user,last_event)
    puts "="*50
    code = self.rules.map{|r| "#{r.line_up_cond}"}.join(" || ")
    logger.debug code
    
    if res = eval(code)
      user.move_to_node self
    end
    logger.debug res
    puts "="*50
    res
  end
  
end
