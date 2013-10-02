class CreateMenuItems < ActiveRecord::Migration
  def change
    create_table :menu_items do |t|
      t.references :account, index: true
      t.string :name
      t.string :uri
      t.text :args

      t.timestamps
    end
  end
end
