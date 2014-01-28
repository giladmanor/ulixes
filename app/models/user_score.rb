class UserScore < ActiveRecord::Base
  belongs_to :user
  belongs_to :scale
  
  to_info :name, :value
  
  def name
    self.scale.code
  end
  
  def add(value)
    self.value = self.scale.upper_limit and return if !self.scale.upper_limit.nil? && self.value+value>self.scale.upper_limit
    self.value += value
  end
  
end
