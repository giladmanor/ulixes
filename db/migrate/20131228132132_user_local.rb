class UserLocal < ActiveRecord::Migration
  def change
    add_column :users, :local, :string
  end
end
