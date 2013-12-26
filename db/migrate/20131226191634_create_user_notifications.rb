class CreateUserNotifications < ActiveRecord::Migration
  def change
    create_table :user_notifications do |t|
      t.references :user, index: true
      t.references :notification, index: true
      t.datetime :sent
      t.datetime :read
      t.text :data

      t.timestamps
    end
  end
end
