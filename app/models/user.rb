class User < ActiveRecord::Base
  acts_as_tree
  belongs_to :account
  belongs_to :role
end
