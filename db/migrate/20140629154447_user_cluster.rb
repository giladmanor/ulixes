class UserCluster < ActiveRecord::Migration
  def change
    add_column :users, :cluster_id, :integer
    add_index :users, [:cluster_id], :name => 'user_in_cluster'
  end
end
