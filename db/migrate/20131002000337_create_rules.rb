class CreateRules < ActiveRecord::Migration
  def change
    create_table :rules do |t|
      t.references :account, index: true
      t.string :name
      t.string :description
      t.text :require
      t.text :demand
      t.integer :projection_id
      t.text :stats

      t.timestamps
    end
  end
end
