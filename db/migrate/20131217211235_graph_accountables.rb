class GraphAccountables < ActiveRecord::Migration
  def change
    add_column :nodes, :account_id,:integer
    add_column :edges, :account_id,:integer
  end
end
