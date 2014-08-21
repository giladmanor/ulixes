class UserNotification < ActiveRecord::Base
  belongs_to :user
  belongs_to :notification
  serialize :data, Hash
  
  
  to_info :notification_title, :sent
  
  
  def self.make(user,notification)
    former = user.user_notifications.where(:notification_id=>notification.id).last
    
    if notification.can_send?(former)
      un = UserNotification.create({:data=>notification.reduce(user), :notification_id=>notification.id})
      un.data["message"] = un.data["message"].gsub("[:NOTIFICATION_ID]",un.id.to_s)
      user.user_notifications << un
    end
    
  end
  
  
  
  
  
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
