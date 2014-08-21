class NotificationRequency < ActiveRecord::Migration
  def change
    add_column :notifications, :frequency, :string
  end
end
