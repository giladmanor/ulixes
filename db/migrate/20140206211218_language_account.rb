class LanguageAccount < ActiveRecord::Migration
  def change
    add_column :languages, :account_id, :integer
  end
end
