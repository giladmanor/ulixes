class CreateZeroSumGameUsers < ActiveRecord::Migration
  def change
    create_table :zero_sum_game_users do |t|
      t.references :zero_sum_game, index: true
      t.references :user, index: true
      t.string :group, index: true

      t.timestamps
    end
  end
end
