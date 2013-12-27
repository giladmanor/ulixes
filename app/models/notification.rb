class Notification < ActiveRecord::Base
  belongs_to :account
  
  to_info :name
  
end
