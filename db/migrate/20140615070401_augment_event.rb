class AugmentEvent < ActiveRecord::Migration
  def change
    add_column :events, :data, :text
  end
end
