class AccountClientKey < ActiveRecord::Migration
  def change
    add_column :accounts, :client_key, :string
  end
end
