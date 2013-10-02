class CreateEvents < ActiveRecord::Migration
  def change
    create_table :events do |t|
      t.references :user, index: true
      t.references :scale, index: true
      t.decimal :value

      t.timestamps
    end
  end
end
