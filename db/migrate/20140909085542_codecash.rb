class Codecash < ActiveRecord::Migration
  def change
    add_column :nodes, :code_cache, :text
    add_column :edges, :code_cache, :text
  end
end
