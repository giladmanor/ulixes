class CreateRoles < ActiveRecord::Migration
  def change
    create_table :roles do |t|
      t.references :account, index: true
      t.string :name
      t.string :code
      t.text :lock

      t.timestamps
    end
  end
end
