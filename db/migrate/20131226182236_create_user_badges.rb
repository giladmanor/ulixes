class CreateUserBadges < ActiveRecord::Migration
  def change
    create_table :user_badges do |t|
      t.references :user, index: true
      t.references :badge, index: true

      t.timestamps
    end
  end
end
