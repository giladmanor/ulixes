class OfferAccount < ActiveRecord::Migration
  def change
    add_column :offers, :account_id, :integer 
  end
end
