class CreateOffers < ActiveRecord::Migration
  def change
    create_table :offers do |t|
      t.string :ext_id
      t.text :data

      t.timestamps
    end
  end
end
