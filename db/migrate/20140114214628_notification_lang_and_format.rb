class NotificationLangAndFormat < ActiveRecord::Migration
  def change
    add_column :notifications, :multilang, :boolean
    add_column :notifications, :format, :string
  end
end
