class Cluster < ActiveRecord::Base
  acts_as_tree
  belongs_to :account
  to_info :name, :population
  serialize :vector, Hash
  serialize :requirement, Array
  has_many :users
  
  def population
    self.id ? 100 : 0
  end
  
  
  
  
  
  
end
