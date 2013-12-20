class RenameEventScale < ActiveRecord::Migration
  def change
    remove_column :events, :scale_id
    add_column :events, :code, :string
    add_index :events, :code
  end
end
