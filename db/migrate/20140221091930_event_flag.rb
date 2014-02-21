class EventFlag < ActiveRecord::Migration
  def change
    add_column :events, :flag, :boolean, :default=>false
  end
end
