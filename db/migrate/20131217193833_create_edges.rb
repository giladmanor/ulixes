class CreateEdges < ActiveRecord::Migration
  def change
    create_table :edges do |t|
      t.integer :source_id
      t.integer :target_id

      t.timestamps
    end
  end
end
