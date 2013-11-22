class Rule < ActiveRecord::Base
  belongs_to :projection, :class_name=> "Cluster"
  belongs_to :account
  
  serialize :require, Array
  serialize :demand, Array
  serialize :stats, Array
  to_info :name, :description, :projection_id
  
  
  
end
