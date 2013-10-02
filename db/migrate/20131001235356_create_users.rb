class CreateUsers < ActiveRecord::Migration
  def change
    create_table :users do |t|
      t.references :account, index: true
      t.string :uid
      t.string :login
      t.string :password
      t.references :role, index: true
      t.integer :parent_id
      t.text :data

      t.timestamps
    end
  end
end
