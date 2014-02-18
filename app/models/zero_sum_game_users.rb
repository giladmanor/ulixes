class ZeroSumGameUsers < ActiveRecord::Base
  belongs_to :zero_sum_game
  belongs_to :user
end
