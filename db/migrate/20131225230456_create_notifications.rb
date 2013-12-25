class CreateNotifications < ActiveRecord::Migration
  def change
    create_table :notifications do |t|
      t.references :account, index: true
      t.string :name
      t.text :data
      t.string :channel

      t.timestamps
    end
  end
end
