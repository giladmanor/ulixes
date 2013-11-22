
class Role < ActiveRecord::Base
  
  #attr_accessible :name, :code, :lock
  serialize :lock, Array
  belongs_to :account
  to_info :name, :code
  
  
  
  
end
