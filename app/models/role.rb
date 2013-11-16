
class Role < ActiveRecord::Base
  serialize :lock, Array
  belongs_to :account
  
  
  
  to_info :name, :code
  
  
  
  
  
end
