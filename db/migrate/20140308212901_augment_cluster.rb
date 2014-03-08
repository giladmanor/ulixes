class AugmentCluster < ActiveRecord::Migration
  def change
    add_column :clusters, :require, :text
    
  end
end
