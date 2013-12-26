class UserNotification < ActiveRecord::Base
  belongs_to :user
  belongs_to :notification
  serialize :data, Hash
  
  to_info :notification_title, :sent
  
  def notification_title
    self.data[:title] unless self.data.nil?
  end
  
end
