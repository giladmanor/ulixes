class RuleReferences < ActiveRecord::Migration
  def change
    remove_column :rules, :projection_id
    add_column :rules, :node_id,:integer
    add_column :rules, :edge_id,:integer 
  end
end
