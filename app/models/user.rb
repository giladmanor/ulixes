class User < ActiveRecord::Base
  acts_as_tree
  belongs_to :account
  belongs_to :role
  
  
  
  
  def spill
  
  end
  
  def resolve_action(code,value)
  
  end
  
  
  
  
end
