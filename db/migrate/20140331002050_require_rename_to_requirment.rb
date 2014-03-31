class RequireRenameToRequirment < ActiveRecord::Migration
  def change
    rename_column :rules, :require, :requirement
    rename_column :clusters, :require, :requirement
    
  end
end
