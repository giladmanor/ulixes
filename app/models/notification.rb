class Notification < ActiveRecord::Base
  belongs_to :account
  
  to_info :name
  
  def format_types
    [["Web Message",:web],["Mobile",:sms]]
  end
  
end
