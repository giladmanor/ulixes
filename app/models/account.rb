class Account < ActiveRecord::Base
  serialize :conf, Hash
  has_many :clusters
  has_many :badges
  has_many :menu_items
  has_many :roles
  has_many :rules
  has_many :scales
  has_many :users
  has_many :nodes
  has_many :edges
  has_many :notifications
  has_many :languages
  
  def find_user(uid)
    user = self.users.find_by_uid(uid)
    if user.nil? && self.conf[:on_the_fly]
      user = User.new(:uid=>uid, :account=>self, :node=>self.conf[:graph_entry_point])
      self.users<<user
    end
    user
  end
  
end
