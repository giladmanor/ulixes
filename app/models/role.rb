
class Role < ActiveRecord::Base
  serialize :lock, Array
  belongs_to :account
  
  
  
  to_info :name, :value
  
  def value
    "1"
  end
  
  
  
end
