class Cluster < ActiveRecord::Base
  acts_as_tree
  belongs_to :account
  to_info :name
  serialize :vector, Hash
  serialize :require, Array
  
  
  
  
  
  
  
  
end
