class ExpertModeRules < ActiveRecord::Migration
  def change
    add_column :nodes,:expert_mode, :boolean
    add_column :edges,:expert_mode, :boolean
    
  end
end
