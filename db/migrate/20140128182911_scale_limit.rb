class ScaleLimit < ActiveRecord::Migration
  def change
    add_column :scales, :upper_limit, :decimal
    
  end
end
