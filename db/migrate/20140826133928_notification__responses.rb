class NotificationResponses < ActiveRecord::Migration
  def change
    add_column :notifications, :single_response,:boolean
  end
end
