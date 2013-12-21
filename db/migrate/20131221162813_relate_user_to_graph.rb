class RelateUserToGraph < ActiveRecord::Migration
  def change
    add_column :users, :node_id, :integer
  end
end
