class CreateScales < ActiveRecord::Migration
  def change
    create_table :scales do |t|
      t.references :account, index: true
      t.string :name
      t.string :code

      t.timestamps
    end
  end
end
