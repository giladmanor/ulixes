class UserNotification < ActiveRecord::Base
  belongs_to :user
  belongs_to :notification
  serialize :data, Hash
  
  
  to_info :notification_title, :sent
  
  def to_data
    {
      :id=>self.id,
      :data=>self.data, 
      :channel=>self.notification.nil? ? "" : self.notification.channel,
      :format=>self.notification.nil? ? "" : self.notification.format
    }
  end
  
  
  def notification_title
    self.data[:title] unless self.data.nil?
  end
  
end
