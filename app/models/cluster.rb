class Cluster < ActiveRecord::Base
  acts_as_tree
  belongs_to :account
  to_info :name, :population
  serialize :vector, Hash
  serialize :require, Array
  
  def population
    self.id ? 100 : 0
  end
  
  
  
  
  
  
end
