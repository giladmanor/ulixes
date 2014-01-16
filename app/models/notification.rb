class Notification < ActiveRecord::Base
  belongs_to :account
  validates_uniqueness_of :name, :scope => [:account_id], :message => "Name taken"
  to_info :name, :format, :multilang
  
  def format_types
    [["Web Message",:web],["Short Message",:sms]]
  end
  
end
