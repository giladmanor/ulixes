class CreateZeroSumGames < ActiveRecord::Migration
  def change
    create_table :zero_sum_games do |t|
      t.references :account, index: true
      t.string :name
      t.text :resources
      t.text :conf

      t.timestamps
    end
  end
end
