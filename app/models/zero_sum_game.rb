class ZeroSumGame < ActiveRecord::Base
  serialize :conf, Hash
  serialize :resources, Hash
  belongs_to :account
  
  has_many :zero_sum_game_users
  has_many :users, :through=>:zero_sum_game_users
end
