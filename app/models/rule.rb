class Rule < ActiveRecord::Base
  belongs_to :node
  belongs_to :edge
  belongs_to :account
  
  serialize :require, Array
  serialize :demand, Array
  serialize :stats, Array
  to_info :name, :description, :node
  
  
  
end
