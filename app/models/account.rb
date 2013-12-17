class Account < ActiveRecord::Base
  
  has_many :clusters
  has_many :badges
  has_many :menu_items
  has_many :roles
  has_many :scales
  has_many :users
  has_many :nodes
  has_many :edges
  
end
