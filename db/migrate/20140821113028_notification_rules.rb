class NotificationRules < ActiveRecord::Migration
  def change
    add_column :notifications, :event_handlers, :text
    add_column :notifications, :bank_policy, :text
    add_column :notifications, :vector, :text
    
  end
end
