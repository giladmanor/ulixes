class Role < ActiveRecord::Base
  
  info :name
  
  
  
  belongs_to :account
end
