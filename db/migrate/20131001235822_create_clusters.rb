class CreateClusters < ActiveRecord::Migration
  def change
    create_table :clusters do |t|
      t.references :account, index: true
      t.integer :parent_id
      t.string :name
      t.boolean :entrance
      t.boolean :engaged
      t.text :vector

      t.timestamps
    end
  end
end
