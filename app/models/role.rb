
class Role < ActiveRecord::Base
  
  
  to_info :name, :value
  
  belongs_to :account
  
  
  
  def value
    "1"
  end
  
  
  
end
